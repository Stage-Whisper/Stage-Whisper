import { Card, Select, Stack, Text, Title } from '@mantine/core';
import React from 'react';

// Redux
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { selectLanguage, setLanguage, setLanguageValid, selectHighlightInvalid } from '../../../views/input/inputSlice';

// Localization
import strings from '../../../localization';
import { generateLanguageList } from './languages';

function Language() {
  // Redux
  const dispatch = useAppDispatch();
  const { language, languageValid } = useAppSelector(selectLanguage);
  const highlightInvalid = useAppSelector(selectHighlightInvalid);

  // Get a list of all the app languages that have been translated
  const transcribedLanguages = strings.getAvailableLanguages();

  // Generate a list of languages to display in the dropdown
  const languages = generateLanguageList();

  const languageList = languages.map((language) => {
    // Get the language name in the current language
    const displayName = language.localized;

    // If we have a translation for the language, check to see how it is displayed natively (e.g. English is displayed as English)
    if (transcribedLanguages.includes(language.code)) {
      // Get the language name in its own language
      const nativeName = strings.getString(`languages.${language.code}`, language.code) as string;
      console.warn(nativeName, displayName);
      // Decide which language name to display and add it to the list
      return {
        value: language.code,
        label: displayName === nativeName ? displayName : `${displayName} (${nativeName})`
      };
    }
    // If we don't have a translation for the language, just display the language name in the current language
    // This may be a fallback to English if the current language does not have a word for the language displayed
    else {
      return {
        value: language.code,
        label: displayName
      };
    }
    // Cast to enum
    // const languageEnum: WhisperLanguages = language.code as WhisperLanguages;
    // const languageEnum = language.code as WhisperLanguages;
    // return { value: language.code, label: strings.languages?.[language.code] };
  });

  return (
    <Card shadow="xs" p="md" withBorder title="Language">
      <Stack>
        <Title order={4}>{strings.transcribe?.language.title}</Title>
        <Select
          withinPortal
          label={strings.transcribe?.language.prompt}
          placeholder={strings.transcribe?.language.placeholder}
          searchable
          error={languageValid && highlightInvalid}
          data={languageList.sort((a, b) => (a.label > b.label ? 1 : -1))}
          onChange={(value) => {
            if (value) {
              dispatch(setLanguage(value));
              dispatch(setLanguageValid(true));
            } else {
              dispatch(setLanguageValid(false));
            }
          }}
        />
        {language !== 'en' && (
          <Text color="dimmed" italic size="sm">
            {strings.transcribe?.language.non_english_warning}
          </Text>
        )}
      </Stack>
    </Card>
  );
}

export default Language;
