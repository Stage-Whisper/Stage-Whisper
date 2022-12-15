import {Alert, Button, Center, LoadingOverlay, Modal, Stack, Title} from '@mantine/core';
import {useMediaQuery} from '@mantine/hooks';
import * as React from 'react';
import {useNavigate} from 'react-router-dom';

// Components
import type {AudioUtilityType} from './components/audio/Audio';
import Audio from './components/audio/Audio';
import About from './components/about/About';
import SimpleInput from './SimpleInput';

// Redux
import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import {
  resetInput,
  selectAbout,
  selectAudio,
  selectLanguage,
  selectSubmittingState,
  selectUseSimpleInput,
  setHighlightInvalid,
  setSubmitted,
  setSubmitting,
} from '../../redux/inputSlice';
import {getLocalFiles} from '../../redux/entrySlice';
import {passToWhisper, selectTranscribingStatus} from '../../redux/whisperSlice';

// Localization
import strings from '../../features/localization';

// Types
import type {Entry} from 'knex/types/tables';
import type {WhisperArgs} from '../../../../../types/whisper';
import type {AboutUtilityType} from './components/about/About';

function Input() {
  // Redux
  const dispatch = useAppDispatch();
  const {audio} = useAppSelector(selectAudio);
  const {language} = useAppSelector(selectLanguage);
  const {about} = useAppSelector(selectAbout);
  const useSimpleInput = useAppSelector(selectUseSimpleInput);
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Temporary state for created entry
  const [createdEntry, setCreatedEntry] = React.useState<Entry | null>(null);

  // Modal
  const {submitting, error, submitted} = useAppSelector(selectSubmittingState);

  const transcribing = useAppSelector(selectTranscribingStatus);

  // On page load reset inputs to default
  React.useEffect(() => {
    dispatch(setHighlightInvalid(false));
  }, []);

  const handleNewEntry = async ({
    about,
    audio,
    language,
  }: {
    about: AboutUtilityType;
    audio: AudioUtilityType;
    language: WhisperArgs['language'];
  }): Promise<Entry> => {
    if (audio.audio_path && audio.audio_name && language && about.name) {
      console.log('Input: All selections made');
      dispatch(setHighlightInvalid(false));
      dispatch(setSubmitting(true));

      // Convert audio type string to valid entryAudioParams type
      const audioType = audio.audio_type?.split('/')[1] as Entry['audio_type'];

      const newEntry = await window.Main.newEntry({
        // TODO: #51 Convert to redux action
        filePath: audio.audio_path,
        name: about.name,
        audio_name: audio.audio_name,
        description: about.description,
        audio_type: audioType,
        audio_language: language,
      })
        .then(result => {
          // If the submission was successful
          if (result) {
            console.log(result);
            setCreatedEntry(result.entry);
            console.log('New entry created', result, 'Showing modal');
            dispatch(setSubmitting(false));
            dispatch(setSubmitted(true));

            console.log('Getting local files');
            dispatch(getLocalFiles());

            console.log('CreatedEntry' + createdEntry);
            return result.entry;
          }
        })
        .catch(error => {
          // If the submission failed
          console.log('Error creating new entry: ' + error);
        });

      if (!newEntry) throw new Error('Error creating new entry');
      return newEntry;
    } else {
      dispatch(setHighlightInvalid(true));
      throw new Error('Input: Missing selections');
    }
  };

  return (
    <Center>
      {/* Modal that reports whether an entry was successfully added and prompts the user to add another file, add the file to the queue or go to the list of entries */}
      {submitted && (
        <Modal
          size="lg"
          withCloseButton={false}
          centered
          opened={submitted}
          fullScreen={isMobile}
          onClose={() => {
            setCreatedEntry(null);
            dispatch(resetInput());
          }}
        >
          <Stack>
            <Alert
              color="green"
              title={`${strings.input?.modal?.success_add}`}
            >
              <Stack>
                <Button
                  variant="filled"
                  color={'violet'}
                  disabled={transcribing.status !== 'idle'}
                  onClick={() => {
                    if (transcribing.status === 'idle') {
                      const entry = createdEntry;
                      if (entry) {
                        dispatch(
                          passToWhisper({
                            entry,
                          }),
                        )
                          .then(() => {
                            setCreatedEntry(null);
                            dispatch(resetInput());
                          })
                          .catch(error => {
                            // Add error handling and feedback to user
                            console.log('Error passing entry to whisper: ' + error);
                          });

                        if (!createdEntry) console.log('No entry, cannot pass to whisper');
                      }
                    } else {
                      console.log('Transcribing already in progress');
                    }
                  }}
                >
                  Begin Transcription
                </Button>

                {/* Add another file  */}
                <Button
                  onClick={() => dispatch(resetInput())}
                  variant="filled"
                  color={'green'}
                >
                  {strings.input?.modal?.add_another}
                </Button>

                {/* View entries */}
                <Button
                  onClick={() => {
                    dispatch(setSubmitted(false));
                    dispatch(resetInput());
                    setCreatedEntry(null);
                    navigate('/entries');
                  }}
                  variant="filled"
                  color={'blue'}
                >
                  {strings.input?.modal?.view_entries}
                </Button>
              </Stack>
              {/* Add to queue */}
              {/* Button that goes green when the job is added, keeps modal open, user can then choose to add another file or go to entries */}
            </Alert>
          </Stack>
        </Modal>
      )}
      <Stack style={{maxWidth: 1000}}>
        <LoadingOverlay visible={submitting} />

        <Title order={3}>{strings.input?.title}</Title>

        {useSimpleInput ? (
          <SimpleInput />
        ) : (
          <>
            <Title
              italic
              order={5}
            >
              {strings.input?.prompt}
            </Title>
            <About />
            <Audio />
          </>
        )}

        <Center my="lg">
          {/* Error Alert */}
          <Stack>
            <Alert
              color="red"
              hidden={!error}
              title={strings.util.error}
            >
              {error || strings.util.unknownError}
            </Alert>

            <Button
              onClick={async () => {
                console.log('Input values: ' + language, audio);
                if (window.Main) {
                  handleNewEntry({
                    language,
                    audio,
                    about,
                  }).then(entry => {
                    setCreatedEntry(entry);
                  });
                } else {
                  // eslint-disable-next-line no-alert
                  alert(
                    'window.Main is undefined, app in dev mode, please view in electron to select an output directory',
                  );
                }
              }}
            >
              {strings.input?.submit_button}
            </Button>
          </Stack>
        </Center>
      </Stack>
    </Center>
  );
}

export default Input;
