import { Text, Card, Select, Stack, Title } from '@mantine/core';
import React from 'react';
import { languages } from './languages';

import strings from '../../localization';

interface Props {
  selectedLanguage: string;
  setSelectedLanguage: (value: string) => void;
}

function Language({ selectedLanguage, setSelectedLanguage }: Props) {
  return (
    <Card shadow="xs" p="md" withBorder title="Language">
      <Stack>
        <Title order={4}>{strings.transcribe.language.title}</Title>
        <Select
          withinPortal
          label={strings.transcribe.language.prompt}
          placeholder={strings.transcribe.language.placeholder}
          searchable
          data={languages}
          onChange={(value) => {
            if (value) {
              setSelectedLanguage(value);
            }
          }}
        />
        {selectedLanguage !== 'english' && (
          <Text color="dimmed" italic size="sm">
            {strings.transcribe.language.non_english_warning}
          </Text>
        )}
      </Stack>
    </Card>
  );
}

export default Language;
