import { Alert, Button, Center, LoadingOverlay, Modal, SimpleGrid, Stack, Title } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import React from 'react';

// Components
// import Model from './components/model/Model';
import Audio, { AudioUtilityType } from './components/audio/Audio';

// Redux
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  resetInput,
  selectAbout,
  selectAudio,
  selectLanguage,
  // selectModel,
  selectSubmittingState,
  selectUseSimpleInput,
  setHighlightInvalid,
  setSubmitted,
  setSubmitting
} from './inputSlice';

// Localization
import { useNavigate } from 'react-router-dom';

import strings from '../../localization';
import { getLocalFiles } from '../entries/entrySlice';
import About, { AboutUtilityType } from './components/about/About';
import { WhisperArgs } from '../../../electron/types/whisperTypes';
import SimpleInput from './components/audio/SimpleInput';
import { Entry } from 'knex/types/tables';

function Input() {
  // Redux
  const dispatch = useAppDispatch();
  const { audio } = useAppSelector(selectAudio);
  const { language } = useAppSelector(selectLanguage);
  const { about } = useAppSelector(selectAbout);
  const useSimpleInput = useAppSelector(selectUseSimpleInput);
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 600px)');

  // Modal
  const { submitting, error, submitted } = useAppSelector(selectSubmittingState);

  // On page load reset inputs to default
  React.useEffect(() => {
    dispatch(setHighlightInvalid(false));
  }, []);

  const handleNewEntry = async ({
    about,
    audio,
    language
  }: {
    about: AboutUtilityType;
    audio: AudioUtilityType;
    language: WhisperArgs['language'];
  }) => {
    if (audio.audio_path && audio.audio_name && language && about.name) {
      console.log('Input: All selections made');
      dispatch(setHighlightInvalid(false));
      dispatch(setSubmitting(true));

      // Convert audio type string to valid entryAudioParams type
      const audioType = audio.audio_type?.split('/')[1] as Entry['audio_type'];

      await window.Main.newEntry({
        // TODO: #51 Convert to redux action
        filePath: audio.audio_path,
        name: about.name,
        audio_name: audio.audio_name,
        description: about.description,
        audio_type: audioType,
        audio_language: language
      })
        .then((result) => {
          // If the submission was successful
          if (result) {
            console.log('New entry created', result, 'Showing modal');
            dispatch(setSubmitting(false));
            dispatch(setSubmitted(true));
            console.log('Getting local files');
            dispatch(getLocalFiles());
          }
        })
        .catch((error) => {
          // If the submission failed
          console.log('Error creating new entry: ' + error);
        });
    } else {
      dispatch(setHighlightInvalid(true));
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
          onClose={() => dispatch(resetInput())}
        >
          <Stack>
            <Alert color="green" title={`${strings.input?.modal?.success_add}`}>
              <SimpleGrid cols={2} spacing={10}>
                {/* Add another file  */}
                <Button onClick={() => dispatch(resetInput())} variant="default">
                  {strings.input?.modal?.add_another}
                </Button>
                {/* View Queue */}
                <Button
                  disabled
                  onClick={() => {
                    dispatch(setSubmitted(false));
                    dispatch(resetInput());
                    navigate('/queue');
                  }}
                  variant="default"
                >
                  {strings.input?.modal?.view_queue}
                </Button>
                {/* View entries */}
                <Button
                  onClick={() => {
                    dispatch(setSubmitted(false));
                    dispatch(resetInput());
                    navigate('/entries');
                  }}
                  variant="default"
                >
                  {strings.input?.modal?.view_entries}
                </Button>
                {/* Add to queue */}
                {/* Button that goes green when the job is added, keeps modal open, user can then choose to add another file or go to entries */}
                <Button variant="default" disabled>
                  {strings.input?.modal?.add_queue}
                </Button>
              </SimpleGrid>
            </Alert>
          </Stack>
        </Modal>
      )}
      <Stack style={{ maxWidth: 1000 }}>
        <LoadingOverlay visible={submitting} />

        <Title order={3}>{strings.input?.title}</Title>

        {useSimpleInput ? (
          <SimpleInput />
        ) : (
          <>
            <Title italic order={5}>
              {strings.input?.prompt}
            </Title>
            <About />
            <Audio />
          </>
        )}

        <Center my="lg">
          {/* Error Alert */}
          <Stack>
            <Alert color="red" hidden={!error} title={strings.util.error}>
              {error || strings.util.unknownError}
            </Alert>

            <Button
              onClick={async () => {
                console.log('Input values: ' + language, audio);
                if (window.Main) {
                  handleNewEntry({
                    language,
                    audio,
                    about
                  });
                } else {
                  // eslint-disable-next-line no-alert
                  alert(
                    'window.Main is undefined, app in dev mode, please view in electron to select an output directory'
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
