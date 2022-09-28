import {
  ActionIcon,
  AppShell,
  Aside,
  // Aside,
  Burger,
  Button,
  Center,
  ColorScheme,
  ColorSchemeProvider,
  Footer,
  Group,
  Header,
  MantineProvider,
  MediaQuery,
  Navbar,
  SimpleGrid,
  Text,
  Title,
  useMantineTheme
} from '@mantine/core';
import React, { useState } from 'react';

import { IconMoonStars, IconSun } from '@tabler/icons';
import Audio, { AudioFile } from './components/audio/Audio';
import Language from './components/language/Language';
import Model from './components/model/Model';
import Directory from './components/directory/Directory';

// React Components

function App() {
  // eslint-disable-next-line no-console
  console.debug(window.ipcRenderer);

  // const sendMessageToElectron = () => {
  //   if (window.Main) {
  //     window.Main.sendMessage("Hello I'm from React World");
  //   } else {
  //     setFromMain(
  //       "You are in a Browser, so no Electron functions are available"
  //     );
  //   }
  //   setSent(true);
  // };

  // Theming
  const theme = useMantineTheme();
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light');
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  // States
  const [opened, setOpened] = useState(false);

  // Selections for the user
  const [selectedModel, setSelectedModel] = useState<string>('Base');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('english');
  const [selectedAudio, setSelectedAudio] = useState<AudioFile[]>([
    {
      name: '',
      type: ''
    }
  ]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const [selectedDirectory, setSelectedDirectory] = useState<string>('');

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
        <AppShell
          navbarOffsetBreakpoint="sm"
          asideOffsetBreakpoint="sm"
          navbar={
            <Navbar p="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 150, lg: 300 }}>
              <Text>Application </Text>
            </Navbar>
          }
          aside={
            <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
              <Aside p="md" hiddenBreakpoint="sm" width={{ sm: 200, lg: 300 }}>
                <Text>Processing jobs</Text>
              </Aside>
            </MediaQuery>
          }
          footer={
            <Footer height={60} p="md">
              <Group position="apart">
                <Text>About</Text>
                <ActionIcon
                  variant="outline"
                  color={colorScheme === 'dark' ? 'yellow' : 'blue'}
                  onClick={() => toggleColorScheme()}
                  title="Toggle color scheme"
                >
                  {colorScheme === 'dark' ? <IconSun size={18} /> : <IconMoonStars size={18} />}
                </ActionIcon>
              </Group>
            </Footer>
          }
          header={
            <Header height={70} p="md">
              <Group style={{ display: 'flex', height: '100%' }}>
                <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                  <Burger
                    opened={opened}
                    onClick={() => setOpened((o) => !o)}
                    size="sm"
                    color={theme.colors.gray[6]}
                    mr="xl"
                  />
                </MediaQuery>

                <Title>Stage Whisper</Title>
              </Group>
            </Header>
          }
        >
          <SimpleGrid cols={2} breakpoints={[{ maxWidth: 900, cols: 1, spacing: 'sm' }]}>
            <Audio setSelectedAudio={setSelectedAudio} />
            <Language selectedLanguage={selectedLanguage} setSelectedLanguage={setSelectedLanguage} />
            <Model selectedModel={selectedModel} setSelectedModel={setSelectedModel} />
            <Directory setSelectedDirectory={setSelectedDirectory} />
          </SimpleGrid>

          <Center my="lg">
            <Button
              onClick={() => {
                window.ipcRenderer.send('start', {
                  model: selectedModel,
                  language: selectedLanguage,
                  audio: selectedAudio
                });
              }}
            >
              Start
            </Button>
          </Center>
        </AppShell>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default App;
