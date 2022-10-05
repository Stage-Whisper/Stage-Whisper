import { Card, Group, Stack, Text, useMantineTheme } from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import { IconMicrophone2, IconUpload, IconX } from '@tabler/icons';
import React, { useState } from 'react';
import strings from '../../../../localization';
import { useAppDispatch } from '../../../../redux/hooks';

// Card with file picker that allows user to select a file from their computer
function SimpleInput() {
  const [active, setActive] = useState(false);
  const theme = useMantineTheme();

  // Redux
  const dispatch = useAppDispatch();

  return (
    <Card>
      <Dropzone
        onDrop={(files) => console.log('accepted files', files)}
        onReject={(files) => console.log('rejected files', files)}
        // maxSize={3 * 1024 ** 2}
        accept={['audio/*']}
        style={{ height: 200 }}
      >
        <Group position="center" spacing="xl" style={{ pointerEvents: 'none' }}>
          <Stack align={'center'} justify={'space-between'}>
            <Dropzone.Accept>
              <IconUpload
                size={50}
                stroke={1.5}
                color={theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 6]}
              />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX size={50} stroke={1.5} color={theme.colors.red[theme.colorScheme === 'dark' ? 4 : 6]} />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <IconMicrophone2 size={50} stroke={1.5} />
            </Dropzone.Idle>
            <Group>
              <Text size="xl" inline>
                {strings?.simpleInput?.drag_drop}
              </Text>
            </Group>
            <Text size="sm" color="dimmed" inline mt={7}>
              {strings?.simpleInput?.tip}
            </Text>
          </Stack>
        </Group>
      </Dropzone>
    </Card>
  );
}

export default SimpleInput;
