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
  NavLink,
  Text,
  Title,
  useMantineTheme
} from '@mantine/core';
import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

import { IconHome, IconLanguage, IconMicrophone2, IconMoonStars, IconSun } from '@tabler/icons';
import strings from './localization';

// React Components

function App() {
  const location = useLocation();
  // eslint-disable-next-line no-console
  console.debug(window.ipcRenderer);

  // Theming
  const theme = useMantineTheme();
  const [colorScheme, setColorScheme] = useState<ColorScheme>('dark');
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
            <Navbar p="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 200, lg: 300 }}>
              <NavLink
                label={strings.dashboard.title}
                icon={<IconHome size={18} />}
                active={location.pathname === '/'}
                component={Link}
                to="/"
              />

              <NavLink
                label={strings.transcribe.title}
                icon={<IconLanguage size={18} />}
                active={location.pathname === '/transcribe'}
                component={Link}
                to="/transcribe"
              />
              <NavLink
                label={strings.interview.title}
                component={Link}
                disabled
                to="/interview"
                icon={<IconMicrophone2 size={18} />}
                active={location.pathname === '/interview'}
              />
            </Navbar>
          }
          aside={
            <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
              <Aside p="md" hiddenBreakpoint="sm" width={{ sm: 200, lg: 300 }}>
                <Text>{strings.sidebar.title}</Text>
              </Aside>
            </MediaQuery>
          }
          footer={
            <Footer height={60} p="md">
              <Group position="apart">
                <Text>{strings.about.title}</Text>
                <ActionIcon
                  variant="outline"
                  color={colorScheme === 'dark' ? 'yellow' : 'blue'}
                  onClick={() => toggleColorScheme()}
                  title={strings.settings.toggle_dark_mode}
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
