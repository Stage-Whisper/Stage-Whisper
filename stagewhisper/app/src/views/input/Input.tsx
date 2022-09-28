import { SimpleGrid, Center, Button } from '@mantine/core';
import React, { useState } from 'react';
import Directory from '../../components/directory/Directory';
import Language from '../../components/language/Language';
import Model from '../../components/model/Model';
import Audio, { AudioFile } from '../../components/audio/Audio';

function Input() {
  // Selections for the user
  const [selectedModel, setSelectedModel] = useState<string>('Base');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('english');
  const [selectedAudio, setSelectedAudio] = useState<AudioFile[]>([
    {
      name: '',
      type: ''
    }
  ]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const [selectedDirectory, setSelectedDirectory] = useState<string>('');
  return (
    <>
      <SimpleGrid cols={2} breakpoints={[{ maxWidth: 900, cols: 1, spacing: 'sm' }]}>
        <Audio setSelectedAudio={setSelectedAudio} />
        <Language selectedLanguage={selectedLanguage} setSelectedLanguage={setSelectedLanguage} />
        <Model selectedModel={selectedModel} setSelectedModel={setSelectedModel} />
        <Directory setSelectedDirectory={setSelectedDirectory} />
      </SimpleGrid>

      <Center my="lg">
        <Button
          onClick={() => {
            window.ipcRenderer.send('start', {
              model: selectedModel,
              language: selectedLanguage,
              audio: selectedAudio
            });
          }}
        >
          Start
        </Button>
      </Center>
    </>
  );
}

export default Input;
