import { Text, Card, Input, Stack, Title } from '@mantine/core';
import React from 'react';

// Redux
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { selectDirectory, selectHighlightInvalid, setDirectory } from '../../../views/input/inputSlice';

// Localization
import strings from '../../../localization';

function Directory() {
  // Redux
  const dispatch = useAppDispatch();
  const { directory, directoryValid } = useAppSelector(selectDirectory);
  const highlightInvalid = useAppSelector(selectHighlightInvalid);
  return (
    <Card shadow="xs" p="md" withBorder title="Output">
      <Stack>
        <Title order={4}>{strings.transcribe.directory.title}</Title>
        <Input.Wrapper label={strings.transcribe.directory.prompt}>
          <Input
            placeholder={strings.transcribe.directory.placeholder}
            invalid={directoryValid && highlightInvalid}
            component="button"
            onClick={() => {
              if (window.Main) {
                window.Main.openDirectoryDialog().then((result: string) => {
                  dispatch(setDirectory(result));
                });
              } else {
                // eslint-disable-next-line no-alert
                alert(
                  'window.Main is undefined, app in dev mode, please view in electron to select an output directory'
                );
              }
            }}
          >
            {directory || strings.transcribe.directory.placeholder}
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
