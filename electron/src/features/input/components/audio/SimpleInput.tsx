import { Card, FileInput, Stack, Title } from '@mantine/core';
import { IconUpload } from '@tabler/icons';
import React from 'react';
import strings from '../../../../localization';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { selectAudio, selectHighlightInvalid, setAudioValid, setSimpleAudioInput } from '../../inputSlice';

// Card with file picker that allows user to select a file from their computer
function SimpleInput() {
  // Redux
  const dispatch = useAppDispatch();
  const { audioValid } = useAppSelector(selectAudio);
  const highlightInvalid = useAppSelector(selectHighlightInvalid);

  return (
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
