import { Card, Select, Stack, Text, Title } from '@mantine/core';
import React from 'react';

// Redux
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { selectLanguage, setLanguage, setLanguageValid, selectHighlightInvalid } from '../../../views/input/inputSlice';

// Localization
import strings from '../../../localization';

// Types
import { languages } from './languages';

function Language() {
  // Redux
  const dispatch = useAppDispatch();
  const { language, languageValid } = useAppSelector(selectLanguage);
  const highlightInvalid = useAppSelector(selectHighlightInvalid);

  return (
    <Card shadow="xs" p="md" withBorder title="Language">
      <Stack>
        <Title order={4}>{strings.transcribe.language.title}</Title>
        <Select
          withinPortal
          label={strings.transcribe.language.prompt}
          placeholder={strings.transcribe.language.placeholder}
          searchable
          error={languageValid && highlightInvalid}
          data={Object.values(languages)}
          value={language}
          onChange={(value) => {
            if (value) {
              dispatch(setLanguage(value));
              dispatch(setLanguageValid(true));
            } else {
              dispatch(setLanguageValid(false));
            }
          }}
        />
        {language !== 'english' && (
          <Text color="dimmed" italic size="sm">
            {strings.transcribe.language.non_english_warning}
          </Text>
        )}
      </Stack>
    </Card>
  );
}

export default Language;
