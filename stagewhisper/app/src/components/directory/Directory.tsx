import { Text, Card, Input, Stack, Title } from '@mantine/core';
import React, { Dispatch, SetStateAction } from 'react';

import strings from '../../localization';

// import { ipcRenderer } from 'electron';
// const { ipcRenderer } = window.require('electron');

interface Props {
  setSelectedDirectory: Dispatch<SetStateAction<string | undefined>>;
  selectedDirectory: string | undefined;
  showWarning: {
    audio: boolean;
    directory: boolean;
  };
}

// const handleDirectory = () => {
//   ipcRenderer.send('open-directory-dialog');
// };

function Directory({ setSelectedDirectory, selectedDirectory, showWarning }: Props) {
  return (
    <Card shadow="xs" p="md" withBorder title="Output">
      <Stack>
        <Title order={4}>{strings.transcribe.directory.title}</Title>
        <Input.Wrapper label={strings.transcribe.directory.prompt}>
          <Input
            placeholder={strings.transcribe.directory.placeholder}
            invalid={showWarning.directory}
            component="button"
            onClick={() => {
              if (window.Main) {
                window.Main.openDirectoryDialog().then((result: string) => {
                  setSelectedDirectory(result);
                });
              } else {
                // eslint-disable-next-line no-alert
                alert(
                  'window.Main is undefined, app in dev mode, please view in electron to select an output directory'
                );
              }
            }}
          >
            {selectedDirectory || strings.transcribe.directory.placeholder}
          </Input>
        </Input.Wrapper>
        <Text italic size="xs" color="dimmed" align="center">
          {strings.transcribe.directory.not_functional}
        </Text>
      </Stack>
    </Card>
  );
}

export default Directory;
