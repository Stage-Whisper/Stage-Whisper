import { Alert, Button, Center, LoadingOverlay, Modal, SimpleGrid, Stack, Title } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import React from 'react';

// Components
import Language from './components/language/Language';
// import Model from './components/model/Model';
import Audio, { AudioType } from './components/audio/Audio';

// Redux
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  resetInput,
  selectAbout,
  selectAudio,
  selectLanguage,
  // selectModel,
  selectSubmittingState,
  setHighlightInvalid,
  setSubmitted,
  setSubmitting
} from './inputSlice';

// Localization
import { useNavigate } from 'react-router-dom';
import { WhisperArgs } from '../../../electron/whisperTypes';
import strings from '../../localization';
import { getLocalFiles } from '../entries/entrySlice';
import About, { AboutType } from './components/about/About';

function Input() {
  // Redux
  const dispatch = useAppDispatch();
  const { audio } = useAppSelector(selectAudio);
  const { language } = useAppSelector(selectLanguage);
  const { about } = useAppSelector(selectAbout);
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
    about: AboutType;
    audio: AudioType;
    language: WhisperArgs['language'];
  }) => {
    if (audio.path && audio.name && language && about.name) {
      console.log('Input: All selections made');
      dispatch(setHighlightInvalid(false));
      dispatch(setSubmitting(true));
      await window.Main.newEntry({
        filePath: audio.path,
        audio: {
          name: audio.name,
          type: audio.type || audio.path.split('.').pop() || 'unknown',
          language: language
        },
        config: {
          name: about.name,
          description: about.description || '',
          tags: about.tags || []
        }
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
          title="This is fullscreen modal!"
          size="lg"
          withCloseButton={false}
          centered
          opened={submitted}
          fullScreen={isMobile}
          onClose={() => dispatch(resetInput())}
        >
          <Stack>
            <Alert color="green" title="Entry successfully added!">
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
        <Title italic order={5}>
          {strings.input?.prompt}
        </Title>
        <About />
        <Audio />
        <Language />

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
