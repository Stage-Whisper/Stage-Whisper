import {
  ActionIcon,
  Card,
  Center,
  Divider,
  Group,
  HoverCard,
  NumberInput,
  Stack,
  Switch,
  Text,
  Title
} from '@mantine/core';
import React from 'react';

// Components

// Redux
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { selectAllowLargeModels, selectAudioPadding, setAllowLargeModel, setAudioPadding } from './settingsSlice';

// Localization
import strings from '../../localization';

function Settings() {
  // Redux
  const dispatch = useAppDispatch();
  // const handlers = useRef<NumberInputHandlers>();
  const audioPadding = useAppSelector(selectAudioPadding);
  const largeModels = useAppSelector(selectAllowLargeModels);

  const handleAudioPaddingChange = (changeValue: number) => {
    // Check if the value is valid
    const newValue = audioPadding + changeValue;

    if (newValue >= 0 && newValue <= 10) {
      dispatch(setAudioPadding(newValue));
    } else if (newValue < 0) {
      dispatch(setAudioPadding(0));
    }
  };

  const handleAudioPaddingSet = (value: number) => {
    if (value >= 0 && value <= 10) {
      dispatch(setAudioPadding(value));
    }
  };

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
              checked={largeModels}
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
        <Card withBorder>
          <Group position="apart">
            <Title order={3}>{strings.settings?.audio_padding_amount?.title}</Title>
            <Group spacing={5}>
              <ActionIcon size={42} variant="default" onClick={() => handleAudioPaddingChange(-0.25)}>
                –
              </ActionIcon>

              <NumberInput
                hideControls
                value={audioPadding}
                onChange={(val) => val && handleAudioPaddingSet(val)}
                onInput={(event) => {
                  const val = parseInt(event.currentTarget.value);
                  handleAudioPaddingSet(val);
                }}
                max={10.0}
                precision={2}
                min={0.0}
                step={0.25}
                styles={{ input: { width: 54, textAlign: 'center' } }}
              />

              <ActionIcon size={42} variant="default" onClick={() => handleAudioPaddingChange(0.25)}>
                +
              </ActionIcon>
            </Group>
          </Group>
          <Divider my={'sm'} />
          <Text italic> {strings.settings?.audio_padding_amount?.subtitle}</Text>
        </Card>
      </Stack>
    </Center>
  );
}

export default Settings;
