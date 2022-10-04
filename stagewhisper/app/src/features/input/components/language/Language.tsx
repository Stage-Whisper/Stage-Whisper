import { Card, Select, Stack, Text, Title } from '@mantine/core';
import React from 'react';

// Redux
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { selectHighlightInvalid, selectLanguage, setLanguage, setLanguageValid } from '../../inputSlice';

// Localization
import { whisperLanguages } from '../../../../../electron/types/whisperTypes';
import strings from '../../../../localization';

function Language() {
  // Redux
  const dispatch = useAppDispatch();
  const { language, languageValid } = useAppSelector(selectLanguage);
  const highlightInvalid = useAppSelector(selectHighlightInvalid);

  // Get a list of all the app languages that have been translated
  // const transcribedLanguageCodes = strings.getAvailableLanguages();

  // Generate a list of languages to display in the dropdown
  // const languages = generateLanguageList();

  // const languageList = languages.map((language) => {
  //   // Get the language name in the current language
  //   const displayName = language.localized;

  //   // If we have a translation for the language, check to see how it is displayed natively (e.g. English is displayed as English)
  //   if (transcribedLanguageCodes.includes(language.code)) {
  //     // Get the language name in its own language
  //     const nativeName = strings.getString(`languages.${language.code}`, language.code) as string;

  //     // Decide which language name to display and add it to the list
  //     return {
  //       countryCode: language.code,
  //       label: displayName === nativeName ? displayName : `${displayName} (${nativeName})`
  //     };
  //   }
  //   // If we don't have a translation for the language, just display the language name in the current language
  //   // This may be a fallback to English if the current language does not have a word for the language displayed
  //   else {
  //     return {
  //       countryCode: language.code,
  //       label: displayName
  //     };
  //   }
  // });

  const languages = Object.keys(whisperLanguages).map((key) => {
    return {
      value: key,
      label: key
    };
  });

  return (
    <Card shadow="xs" p="md" withBorder title="Language">
      <Stack>
        <Title order={4}>{strings.input?.language.title}</Title>
        <Select
          withinPortal
          label={strings.input?.language.prompt}
          placeholder={strings.input?.language.placeholder}
          searchable
          error={languageValid && highlightInvalid}
          // data={languageList.sort((a, b) => (a.label > b.label ? 1 : -1))}
          data={languages.sort((a, b) => {
            return a.label > b.label ? 1 : -1;
          })}
          onChange={(value: any) => {
            if (value) {
              dispatch(setLanguage(value));
              dispatch(setLanguageValid(true));
            } else {
              dispatch(setLanguageValid(false));
            }
          }}
        />
        {language !== 'English' && (
          <Text color="dimmed" italic size="sm">
            {strings.input?.language.non_english_warning}
          </Text>
        )}
      </Stack>
    </Card>
  );
}

export default Language;
