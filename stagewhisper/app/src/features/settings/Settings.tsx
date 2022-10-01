import { Card, Center, Divider, Group, HoverCard, Select, Stack, Switch, Text, Title } from '@mantine/core';
import React from 'react';

// Components

// Redux
import { useAppDispatch } from '../../redux/hooks';
import { setAllowLargeModel, setDisplayLanguage } from './settingsSlice';

// Localization
import strings from '../../localization';

function Settings() {
  // Redux
  const dispatch = useAppDispatch();

  // Get a list of all languages and their codes
  // const languages = generateLanguageList();

  // Get a list of all the languages that the app has been localized into
  // const localized = strings.getAvailableLanguages();

  // // Generate a list of languages to display in the dropdown
  // const languageList = languages.reduce((acc: { label: string; value: string }[], cur) => {
  //   if (localized.includes(cur.languageCode)) {
  //     acc.push({
  //       label: `${cur.label} (${strings.getString(`languages.${cur.languageCode}`, cur.languageCode)})`,
  //       value: cur.languageCode
  //     });
  //   }
  //   return acc;
  // }, []);

  return (
    <Center my="lg">
      <Stack style={{ maxWidth: '700px' }}>
        <Card withBorder>
          <Title order={3}>{strings.settings?.language.title}</Title>
          <Divider my={'sm'} />
          <HoverCard shadow="md" openDelay={200} width={300} withinPortal position="top">
            <HoverCard.Target>
              <Text>{strings.settings?.language.title} (Temporarily Removed)</Text>
              {/* <Select
                withinPortal
                dropdownPosition="bottom"
                label={strings.settings?.language.prompt}
                placeholder={strings.transcribe?.language.placeholder}
                searchable
                // data={languageList.sort((a, b) => (a.label > b.label ? 1 : -1))}
                onChange={(value) => {
                  if (value) {
                    dispatch(setDisplayLanguage(value));
                  }
                }}
              /> */}
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
              onChange={(event) => {
                console.log(event.target.checked);
                dispatch(setAllowLargeModel(event.target.checked));
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
