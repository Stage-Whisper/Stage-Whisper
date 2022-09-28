import { Card, FileInput, Stack, Title } from '@mantine/core';
import React, { Dispatch, SetStateAction } from 'react';
import { IconUpload } from '@tabler/icons';

import strings from '../../localization';

export interface AudioFile {
  name: string | undefined;
  type: string | undefined;
  path: string | undefined;
  file: File | undefined;
}

interface Props {
  setSelectedAudio: Dispatch<SetStateAction<AudioFile>>;

  showWarning: {
    audio: boolean;
    directory: boolean;
  };
}

function Audio({ setSelectedAudio, showWarning }: Props) {
  return (
    <Card shadow="xs" p="md" withBorder title="Audio">
      <Stack>
        <Title order={4}>{strings.transcribe?.audio.title}</Title>
        <FileInput
          error={showWarning.audio}
          placeholder={strings.transcribe?.audio.placeholder}
          label={strings.transcribe?.audio.prompt}
          accept="audio/*"
          onChange={(file) => {
            if (file) {
              setSelectedAudio({
                name: file.name,
                path: file.path,
                type: file.type,
                file
              });
            }
          }}
          icon={<IconUpload size={14} />}
        />
      </Stack>
    </Card>
  );
}

export default Audio;
