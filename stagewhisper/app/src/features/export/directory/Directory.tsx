import { Text, Card, Input, Stack, Title } from '@mantine/core';
import React from 'react';

// Redux
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { selectDirectory, selectHighlightInvalid, setDirectory } from '../../input/inputSlice';

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
        <Title order={4}>{strings.input?.directory.title}</Title>
        <Input.Wrapper label={strings.input?.directory.prompt}>
          <Input
            placeholder={strings.input?.directory.placeholder}
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
            {directory || strings.input?.directory.placeholder}
          </Input>
        </Input.Wrapper>
        <Text italic size="xs" color="dimmed" align="center">
          {strings.input?.directory.not_functional}
        </Text>
      </Stack>
    </Card>
  );
}

export default Directory;
