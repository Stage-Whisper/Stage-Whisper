import { SimpleGrid, Center, Button } from '@mantine/core';
import React from 'react';

// Components
import Directory from '../../components/input/directory/Directory';
import Language from '../../components/input/language/Language';
import Model from '../../components/input/model/Model';
import Audio from '../../components/input/audio/Audio';

// Redux
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { selectAudio, selectDirectory, selectLanguage, selectModel, setHighlightInvalid } from './inputSlice';

// Localization
import strings from '../../localization';

function Input() {
  // Redux
  const dispatch = useAppDispatch();
  const { audio } = useAppSelector(selectAudio);
  const { directory } = useAppSelector(selectDirectory);
  const { language } = useAppSelector(selectLanguage);
  const { model } = useAppSelector(selectModel);

  return (
    <>
      <SimpleGrid cols={2} breakpoints={[{ maxWidth: 900, cols: 1, spacing: 'sm' }]}>
        <Audio />
        <Language />
        <Model />
        <Directory />
      </SimpleGrid>

      <Center my="lg">
        <Button
          onClick={() => {
            // eslint-disable-next-line no-console
            console.log(model, language, audio, directory);

            // Check if all selections are made
            if (model && language && audio.path && directory) {
              // eslint-disable-next-line no-console
              console.log('All selections made');
              dispatch(setHighlightInvalid(false));
              if (window.Main) {
                window.Main.runWhisper({
                  file: audio.path,
                  model,
                  language,
                  output_dir: directory,
                  translate: language !== 'english'
                });
              } else {
                // eslint-disable-next-line no-alert
                alert(
                  'window.Main is undefined, app in dev mode, please view in electron to select an output directory'
                );
              }
            } else {
              // Trigger error highlighting for each element
              dispatch(setHighlightInvalid(true));
            }
          }}
        >
          {strings.transcribe.submit_button}
        </Button>
      </Center>
    </>
  );
}

export default Input;
