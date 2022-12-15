import {Card, Group, Stack, Text} from '@mantine/core';
import {Dropzone} from '@mantine/dropzone';
import {IconCheckbox, IconUpload, IconX} from '@tabler/icons';
import type {Entry} from 'knex/types/tables';
import React from 'react';
import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import {selectAudio, setAudioValid, setSimpleAudioInput} from '../../redux/inputSlice';
// Card with file picker that allows user to select a file from their computer
function SimpleInput() {
  // Redux
  const dispatch = useAppDispatch();
  //Theming
  const {audioValid} = useAppSelector(selectAudio);
  // const highlightInvalid = useAppSelector(selectHighlightInvalid);
  // const [audioValid, setAudioValid] = React.useState(false);

  return (
    <Card
      shadow="xs"
      p="md"
    >
      <Stack>{/* <Title order={4}>{strings.input?.audio.title}</Title> */}</Stack>
      <div
        onClick={() => {
          //Create a filepicker
          const filePicker = document.createElement('input');
          filePicker.setAttribute('type', 'file');
          filePicker.setAttribute('accept', 'audio/*');
          filePicker.click();
          //Get the path of the file selected
          filePicker.onchange = event => {
            // FIXME: No idea why i have to do this, but it works
            // @ts-expect-error FIXME: No idea why i have to do this, but it works
            const file = event.target.files[0];
            if (file) {
              dispatch(
                setSimpleAudioInput({
                  audio_name: file.name,
                  audio_path: file.path,
                  audio_type: file.type,
                }),
              );
              dispatch(setAudioValid(true));
            } else {
              dispatch(setAudioValid(false));
            }
          };
        }}
      >
        <Dropzone
          onClick={() => {
            console.log('click');
          }}
          useFsAccessApi={false}
          onDrop={files => {
            const file = files[0];
            console.log(file);
            if (file) {
              if (file.name && file.path && file.type) {
                console.log(audioValid);
                dispatch(
                  setSimpleAudioInput({
                    audio_name: file.name,
                    audio_path: file.path,
                    audio_type: file.type as Entry['audio_type'],
                  }),
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
          onReject={files => console.log('rejected files', files)}
          // maxSize={3 * 1024 ** 2}
          // disabled={audioValid}
          disabled={audioValid}
          accept={['audio/*']}
          activateOnClick={false}
          // {...props}
        >
          <Group
            position="center"
            spacing="xl"
            style={{minHeight: 220, pointerEvents: 'none'}}
          >
            <Dropzone.Accept>
              <IconCheckbox
                size={50}
                stroke={1.5}
                color="green"
              />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX
                size={50}
                stroke={1.5}
                color="red"
              />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <IconUpload
                size={50}
                stroke={1.5}
                color="gray"
              />
            </Dropzone.Idle>
            {!audioValid ? (
              <div>
                <Text
                  size="xl"
                  inline
                >
                  Drag and drop your audio file here, or click to select a file from your computer
                </Text>
                <Text
                  size="sm"
                  color="dimmed"
                  inline
                  mt={7}
                >
                  MP3, WAV, FLAC, OGG, AAC, M4A, WMA, and OPUS files are recommended
                </Text>
              </div>
            ) : (
              <div>
                <Text
                  size="xl"
                  inline
                >
                  The audio file has been selected
                </Text>
              </div>
            )}
          </Group>
        </Dropzone>
      </div>
    </Card>
    // </Card>
  );
}

export default SimpleInput;
