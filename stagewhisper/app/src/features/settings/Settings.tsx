import { Text, Card, Center, Divider, Group, HoverCard, Select, Space, Stack, Switch, Title } from '@mantine/core';
import React from 'react';

// Components

// Redux
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { selectDisplayLanguage, selectTheme, setDisplayLanguage } from './settingsSlice';

// Localization
import strings from '../../localization';
import { generateLanguageList } from '../input/components/language/languages';

function Settings() {
  // Redux
  const dispatch = useAppDispatch();
  const displayLanguage = useAppSelector(selectDisplayLanguage);
  const theme = useAppSelector(selectTheme);

  // Get a list of all languages and their codes
  const languages = generateLanguageList(displayLanguage);

  // Get a list of all the languages that the app has been localized into
  const localized = strings.getAvailableLanguages();

  // Generate a list of languages to display in the dropdown
  const languageList = languages.reduce((acc: { label: string; value: string }[], cur) => {
    if (localized.includes(cur.code)) {
      acc.push({
        label: `${cur.localized} (${strings.getString(`languages.${cur.code}`, cur.code)})`,
        value: cur.code
      });
    }
    return acc;
  }, []);

  return (
    <Center my="lg" style={{ maxWidth: '1200px' }}>
      <Stack>
        <Card withBorder>
          <Title order={3}>{strings.settings?.language.title}</Title>
          <Divider my={'sm'} />
          <HoverCard shadow="md" openDelay={200} width={300} withinPortal position="top">
            <HoverCard.Target>
              <Select
                withinPortal
                dropdownPosition="bottom"
                label={strings.settings?.language.prompt}
                placeholder={strings.transcribe?.language.placeholder}
                searchable
                data={languageList.sort((a, b) => (a.label > b.label ? 1 : -1))}
                onChange={(value) => {
                  if (value) {
                    dispatch(setDisplayLanguage(value));
                  }
                }}
              />
            </HoverCard.Target>

            <HoverCard.Dropdown>{strings.settings?.language.subtitle}</HoverCard.Dropdown>
          </HoverCard>
        </Card>
        <Card withBorder>
          <Group position="apart">
            <Title order={3}>{strings.settings?.large_model_support?.title}</Title>

            <Switch
              onLabel={strings.util?.on}
              offLabel={strings.util?.off}
              onChange={(value) => {
                if (value) {
                  dispatch(setDisplayLanguage(value));
                }
              }}
            />
          </Group>
          <Divider my={'sm'} />
          <Text italic> {strings.settings?.large_model_support?.subtitle}</Text>
        </Card>
      </Stack>
    </Center>
  );
}

export default Settings;
