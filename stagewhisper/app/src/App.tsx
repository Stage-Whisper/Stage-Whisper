import {
  ActionIcon,
  AppShell,
  Aside,
  // Aside,
  Burger,
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
import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

import { IconHome, IconLanguage, IconMicrophone2, IconMoonStars, IconSettings, IconSun } from '@tabler/icons';
import strings from './localization';
import { useAppDispatch, useAppSelector } from './redux/hooks';

import { selectDarkMode, selectDisplayLanguage, toggleDarkMode } from './features/settings/settingsSlice';
import { selectBurgerOpen, setBurgerOpen } from './appSlice';

// React Components

function App() {
  // Redux
  const dispatch = useAppDispatch();
  const darkMode = useAppSelector(selectDarkMode);
  const displayLanguage = useAppSelector(selectDisplayLanguage);
  // Theming
  const theme = useMantineTheme();

  // Monitor the current language and update when it changes
  strings.setLanguage(displayLanguage);

  const location = useLocation();

  // States
  const burgerOpen = useAppSelector(selectBurgerOpen);

  return (
    <MantineProvider theme={{ colorScheme: darkMode ? 'dark' : 'light' }} withGlobalStyles withNormalizeCSS>
      <AppShell
        navbarOffsetBreakpoint="sm"
        asideOffsetBreakpoint="sm"
        navbar={
          <Navbar hiddenBreakpoint="sm" hidden={!burgerOpen} width={{ sm: 200, lg: 300 }}>
            <Navbar.Section grow m={0}>
              <NavLink
                label={strings.dashboard?.title}
                icon={<IconHome size={18} />}
                active={location.pathname === '/'}
                component={Link}
                to="/"
              />
              <NavLink
                label={strings.transcribe?.title}
                icon={<IconLanguage size={18} />}
                active={location.pathname === '/transcribe'}
                component={Link}
                to="/transcribe"
              />
              <NavLink
                label={strings.interview?.title}
                component={Link}
                disabled
                to="/interview"
                icon={<IconMicrophone2 size={18} />}
                active={location.pathname === '/interview'}
              />
            </Navbar.Section>

            <Navbar.Section>
              <NavLink
                label={strings.settings?.title}
                component={Link}
                to="/settings"
                icon={<IconSettings size={18} />}
                active={location.pathname === '/settings'}
              />
            </Navbar.Section>
          </Navbar>
        }
        aside={
          <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
            <Aside p="md" hiddenBreakpoint="sm" width={{ sm: 200, lg: 300 }}>
              <Text>{strings.sidebar?.title}</Text>
            </Aside>
          </MediaQuery>
        }
        footer={
          <Footer height={60} p="md">
            <Group position="apart">
              <Text>{strings.about?.title}</Text>
              <ActionIcon
                variant="outline"
                color={darkMode ? 'yellow' : 'blue'}
                onClick={() => dispatch(toggleDarkMode())}
                title={strings.settings?.toggle_dark_mode}
              >
                {darkMode ? <IconSun size={18} /> : <IconMoonStars size={18} />}
              </ActionIcon>
            </Group>
          </Footer>
        }
        header={
          <Header height={70} p="md">
            <Group style={{ display: 'flex', height: '100%' }}>
              <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                <Burger
                  opened={burgerOpen}
                  onClick={() => dispatch(setBurgerOpen(!burgerOpen))}
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
  );
}

export default App;
