import { Text, Card, Select, Stack, Title } from '@mantine/core';
import React from 'react';
import { languages } from './languages';

interface Props {
  selectedLanguage: string;
  setSelectedLanguage: (value: string) => void;
}

function Language({ selectedLanguage, setSelectedLanguage }: Props) {
  return (
    <Card shadow="xs" p="md" withBorder title="Language">
      <Stack>
        <Title order={4}>Language</Title>
        <Select
          withinPortal
          label="Language spoken in the audio, specify none to perform automatic language detection"
          placeholder="none"
          defaultValue="none"
          searchable
          nothingFound="No options"
          data={languages}
          onChange={(value) => {
            if (value) {
              setSelectedLanguage(value);
            }
          }}
        />
        {selectedLanguage !== 'english' && (
          <Text color="dimmed" italic size="sm">
            Note: Languages other than english may have an increased error rate
          </Text>
        )}
      </Stack>
    </Card>
  );
}

export default Language;
