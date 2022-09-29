import { SimpleGrid, Center, Button } from '@mantine/core';
import React, { useState } from 'react';
import Directory from '../../components/input/directory/Directory';
import Language from '../../components/input/language/Language';
import Model from '../../components/input/model/Model';
import Audio, { AudioFile } from '../../components/input/audio/Audio';

import strings from '../../localization';
import { languages } from '../../components/input/language/languages';

function Input() {
  // Selections for the user
  const [selectedModel, setSelectedModel] = useState<'tiny' | 'base' | 'small' | 'medium' | 'large'>('base');
  const [selectedLanguage, setSelectedLanguage] = useState<typeof languages[number]>('english');
  const [selectedDirectory, setSelectedDirectory] = useState<string>();
  const [selectedAudio, setSelectedAudio] = useState<AudioFile>({
    name: undefined,
    type: undefined,
    path: undefined
  });
  const [showWarning, setShowWarning] = useState({
    audio: false,
    directory: false
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars

  return (
    <>
      <SimpleGrid cols={2} breakpoints={[{ maxWidth: 900, cols: 1, spacing: 'sm' }]}>
        <Audio setSelectedAudio={setSelectedAudio} showWarning={showWarning} />
        <Language selectedLanguage={selectedLanguage} setSelectedLanguage={setSelectedLanguage} />
        <Model selectedModel={selectedModel} setSelectedModel={setSelectedModel} />
        <Directory
          selectedDirectory={selectedDirectory}
          setSelectedDirectory={setSelectedDirectory}
          showWarning={showWarning}
        />
      </SimpleGrid>

      <Center my="lg">
        <Button
          onClick={() => {
            // eslint-disable-next-line no-console
            console.log(selectedModel, selectedLanguage, selectedAudio, selectedDirectory);

            // Check if all selections are made
            if (selectedModel && selectedLanguage && selectedAudio.path && selectedDirectory) {
              // eslint-disable-next-line no-console
              console.log('All selections made');
              setShowWarning({
                audio: false,
                directory: false
              });
              if (window.Main) {
                window.Main.runWhisper({
                  file: selectedAudio.path,
                  model: selectedModel,
                  language: selectedLanguage,
                  output_dir: selectedDirectory,
                  translate: selectedLanguage !== 'english'
                });
              } else {
                // eslint-disable-next-line no-alert
                alert(
                  'window.Main is undefined, app in dev mode, please view in electron to select an output directory'
                );
              }
            } else {
              setShowWarning({
                audio: selectedAudio.path === undefined,
                directory: !selectedDirectory
              });
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
