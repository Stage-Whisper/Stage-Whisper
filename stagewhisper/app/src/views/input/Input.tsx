import { SimpleGrid, Center, Button } from '@mantine/core';
import React, { useState } from 'react';
import Directory from '../../components/directory/Directory';
import Language from '../../components/language/Language';
import Model from '../../components/model/Model';
import Audio, { AudioFile } from '../../components/audio/Audio';

import strings from '../../localization';

function Input() {
  // Selections for the user
  const [selectedModel, setSelectedModel] = useState<string>('Base');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('english');
  const [selectedDirectory, setSelectedDirectory] = useState<string>();
  const [selectedAudio, setSelectedAudio] = useState<AudioFile[]>([
    {
      name: '',
      type: ''
    }
  ]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars

  return (
    <>
      <SimpleGrid cols={2} breakpoints={[{ maxWidth: 900, cols: 1, spacing: 'sm' }]}>
        <Audio setSelectedAudio={setSelectedAudio} />
        <Language selectedLanguage={selectedLanguage} setSelectedLanguage={setSelectedLanguage} />
        <Model selectedModel={selectedModel} setSelectedModel={setSelectedModel} />
        <Directory selectedDirectory={selectedDirectory} setSelectedDirectory={setSelectedDirectory} />
      </SimpleGrid>

      <Center my="lg">
        <Button
          onClick={() => {
            // eslint-disable-next-line no-console
            console.log(selectedModel, selectedLanguage, selectedAudio, selectedDirectory);
          }}
        >
          {strings.transcribe.submit_button}
        </Button>
      </Center>
    </>
  );
}

export default Input;
