import { Card, FileInput, Stack, Title } from '@mantine/core';
import React, { Dispatch, SetStateAction } from 'react';
import { IconUpload } from '@tabler/icons';

import strings from '../../localization';

export interface AudioFile {
  name: string;
  type: string;
  file?: File;
}

interface Props {
  setSelectedAudio: Dispatch<SetStateAction<AudioFile[]>>;
  // selectedAudio: AudioFile[];
}

function Audio({ setSelectedAudio }: Props) {
  return (
    <Card shadow="xs" p="md" withBorder title="Audio">
      <Stack>
        <Title order={4}>{strings.transcribe?.audio.title}</Title>
        <FileInput
          placeholder={strings.transcribe?.audio.placeholder}
          label={strings.transcribe?.audio.prompt}
          accept="audio/*"
          multiple
          onChange={(files) => {
            if (files) {
              setSelectedAudio(
                files.map((file) => ({
                  name: file.name,
                  type: file.type
                }))
              );
            }
          }}
          icon={<IconUpload size={14} />}
        />
      </Stack>
    </Card>
  );
}

export default Audio;
