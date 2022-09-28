import {
  ActionIcon,
  AppShell,
  Aside,
  // Aside,
  Burger,
  ColorScheme,
  ColorSchemeProvider,
  Footer,
  Group,
  Header,
  MantineProvider,
  MediaQuery,
  Navbar,
  Text,
  Title,
  useMantineTheme
} from '@mantine/core';
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';

import { IconMoonStars, IconSun } from '@tabler/icons';

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
          <Outlet />
        </AppShell>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default App;
