import { Card, FileInput, Stack, Title, useMantineTheme } from '@mantine/core';
import { IconUpload } from '@tabler/icons';
import React from 'react';
import strings from '../../../../localization';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { selectAudio, selectHighlightInvalid, setAudioValid, setSimpleAudioInput } from '../../inputSlice';

// Card with file picker that allows user to select a file from their computer
function SimpleInput() {
  const theme = useMantineTheme();

  // Redux
  const dispatch = useAppDispatch();
  const { audioValid, audio } = useAppSelector(selectAudio);
  const highlightInvalid = useAppSelector(selectHighlightInvalid);

  return (
    // <Card>
    // <Dropzone TODO: Mantine dropzone doesnt allow for paths to be passed in
    //   onDrop={(files) => {
    //     const file = files[0];
    //     console.log(file);
    //     if (file.path && file.name && file.type) {
    //       dispatch(
    //         setSimpleAudioInput({
    //           path: file.path,
    //           name: file.name,
    //           type: file.type
    //         })
    //       );
    //     } else {
    //       if (!file.path) console.log('File path undefined');
    //       if (!file.name) console.log('File name undefined');
    //       if (!file.type) console.log('File type undefined');
    //     }
    //   }}
    //   onReject={(file) => console.log('rejected files', file)}
    //   // maxSize={3 * 1024 ** 2}
    //   accept={['audio/*']}
    //   style={{ height: 200, minWidth: 400 }}
    //   multiple={false}
    // >
    //   <Group position="center" spacing="xl" style={{ pointerEvents: 'none' }}>
    //     <Stack align={'center'} justify={'space-between'}>
    //       <Dropzone.Accept>
    //         <IconUpload
    //           size={50}
    //           stroke={1.5}
    //           color={theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 6]}
    //         />
    //       </Dropzone.Accept>
    //       <Dropzone.Reject>
    //         <IconX size={50} stroke={1.5} color={theme.colors.red[theme.colorScheme === 'dark' ? 4 : 6]} />
    //       </Dropzone.Reject>

    //       {audioValid ? (
    //         <Stack justify={'center'} mt={55}>
    //           <Group>
    //             <Dropzone.Idle>
    //               <IconUpload
    //                 size={50}
    //                 stroke={1.5}
    //                 color={theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 6]}
    //               />
    //             </Dropzone.Idle>
    //             <Text size="xl" inline>
    //               {audio?.name}
    //             </Text>
    //           </Group>
    //         </Stack>
    //       ) : (
    //         <>
    //           <Dropzone.Idle>
    //             <IconMicrophone2 size={50} stroke={1.5} />
    //           </Dropzone.Idle>
    //           <Group>
    //             <Text size="xl" inline>
    //               {strings?.simpleInput?.drag_drop}
    //             </Text>
    //           </Group>
    //           <Text size="sm" color="dimmed" inline mt={7}>
    //             {strings?.simpleInput?.tip}
    //           </Text>
    //         </>
    //       )}
    //     </Stack>
    //   </Group>
    // </Dropzone>

    <Card shadow="xs" p="md">
      <Stack>
        <Title order={4}>{strings.input?.audio.title}</Title>
        <FileInput
          error={audioValid && highlightInvalid}
          placeholder={strings.input?.audio.placeholder}
          label={strings.input?.audio.prompt}
          accept="audio/*"
          onChange={(file) => {
            if (file) {
              if (file.name && file.path && file.type) {
                dispatch(
                  setSimpleAudioInput({
                    name: file.name,
                    path: file.path,
                    type: file.type
                  })
                );
              } else {
                if (!file.name) console.log('File name undefined');
                if (!file.path) console.log('File path undefined');
                if (!file.type) console.log('File type undefined');
                dispatch(setAudioValid(false));
              }
            } else {
              console.log('File undefined');
              dispatch(setAudioValid(false));
            }
          }}
          icon={audioValid ? <IconUpload color="green" size={14} /> : <IconUpload size={14} />}
        />
      </Stack>
    </Card>
    // </Card>
  );
}

export default SimpleInput;
