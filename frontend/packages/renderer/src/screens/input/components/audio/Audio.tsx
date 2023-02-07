import {Card, FileInput, Stack, Title} from '@mantine/core';
import {IconUpload} from '@tabler/icons';
import * as React from 'react';

// Redux
import {useAppDispatch, useAppSelector} from '../../../../redux/hooks';
import {
  selectAudio,
  selectHighlightInvalid,
  setAudio,
  setAudioValid,
} from '../../../../redux/inputSlice';

// Localization
import strings from '../../../../features/localization';
import type {Entry} from '@prisma/client';

// Types

export type AudioUtilityType = Partial<Pick<Entry, 'audio_name' | 'audio_path' | 'audio_type'>>;

function Audio() {
  // Redux
  const dispatch = useAppDispatch();
  const {audioValid} = useAppSelector(selectAudio);
  const highlightInvalid = useAppSelector(selectHighlightInvalid);

  return (
    <Card
      shadow="xs"
      p="md"
      withBorder
      title="Audio"
    >
      <Stack>
        <Title order={4}>{strings.input?.audio.title}</Title>
        <FileInput
          error={!audioValid && highlightInvalid}
          placeholder={strings.input?.audio.placeholder}
          label={strings.input?.audio.prompt}
          accept="audio/*"
          onChange={file => {
            if (file) {
              dispatch(
                setAudio({
                  name: file.name,
                  path: file.path,
                  type: file.type,
                }),
              );
              dispatch(setAudioValid(true));
            } else {
              dispatch(setAudioValid(false));
            }
          }}
          icon={<IconUpload size={14} />}
        />
      </Stack>
    </Card>
  );
}

export default Audio;
