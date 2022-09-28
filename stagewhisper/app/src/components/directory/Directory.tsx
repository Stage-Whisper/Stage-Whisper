import { Text, Card, FileInput, Stack, Title } from '@mantine/core';
import React, { Dispatch, SetStateAction } from 'react';

import strings from '../../localization';

// import { ipcRenderer } from 'electron';
// const { ipcRenderer } = window.require('electron');

interface Props {
  setSelectedDirectory: Dispatch<SetStateAction<string>>;
}

// const handleDirectory = () => {
//   ipcRenderer.send('open-directory-dialog');
// };

function Directory({ setSelectedDirectory }: Props) {
  return (
    <Card shadow="xs" p="md" withBorder title="Output">
      <Stack>
        <Title order={4}>{strings.transcribe.directory.title}</Title>
        <FileInput
          placeholder={strings.transcribe.directory.placeholder}
          label={strings.transcribe.directory.prompt}
          disabled
          onChange={(file) => {
            if (file) {
              setSelectedDirectory(file.path);
            }
          }}

          //   console.log('clicked');
          //   if (window.Main) {
          //     console.log('clicked and window.Main exists');
          //     handleDirectory();
          //   } else {
          //     const devDirectory = prompt(
          //       'window.Main is undefined, app in dev mode, please enter a directory manually'
          //     );
          //     if (devDirectory) {
          //       setSelectedDirectory(devDirectory);
          //     }
          //   }
          // }}
        />
        <Text italic size="xs" color="dimmed" align="center">
          {strings.transcribe.directory.not_functional}
        </Text>
      </Stack>
    </Card>
  );
}

export default Directory;
