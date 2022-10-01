import {
  Text,
  ActionIcon,
  AppShell,
  // Aside,
  Burger,
  Group,
  Header,
  MantineProvider,
  MediaQuery,
  Navbar,
  NavLink,
  Title,
  useMantineTheme,
  Affix,
  Divider,
  ScrollArea
} from '@mantine/core';
import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

import {
  IconFileDescription,
  IconHome,
  IconInfoCircle,
  IconLanguage,
  IconMicrophone2,
  IconMoonStars,
  IconSettings,
  IconSun
} from '@tabler/icons';
import strings from './localization';
import { useAppDispatch, useAppSelector } from './redux/hooks';

import { selectBurgerOpen, setBurgerOpen } from './appSlice';
import { selectDarkMode, selectDisplayLanguage, toggleDarkMode } from './features/settings/settingsSlice';
import { selectTranscriptions } from './features/transcriptions/transcriptionsSlice';

// Recent Transcription Constructor
function RecentTranscriptions() {
  const transcriptions = useAppSelector(selectTranscriptions);
  const dispatch = useAppDispatch();

  if (!transcriptions.length) {
    return <></>;
  } else {
    return (
      <>
        <Divider mt={'sm'} />
        <NavLink label={strings.transcriptions?.recent_transcriptions} icon={<IconFileDescription />}>
          {transcriptions.map((transcription) => (
            <NavLink
              key={transcription.id}
              label={transcription.audioTitle}
              component={Link}
              to={`/transcriptions/${transcription.id}`}
              onClick={() => dispatch(setBurgerOpen(false))}
            />
          ))}
        </NavLink>
      </>
    );
  }
}

// Main App Component
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
          // Main navigation sidebar with Dashboard, Transcribe, Interview and Transcription pages
          <Navbar hiddenBreakpoint="sm" hidden={!burgerOpen} width={{ sm: 200, lg: 300 }}>
            <Navbar.Section m={0}>
              <NavLink
                label={<Text>{strings.dashboard?.title}</Text>}
                icon={<IconHome size={18} />}
                active={location.pathname === '/'}
                component={Link}
                to="/"
              />
              <NavLink
                label={<Text>{strings.transcribe?.title}</Text>}
                icon={<IconLanguage size={18} />}
                active={location.pathname === '/transcribe'}
                component={Link}
                to="/transcribe"
              />
              <NavLink
                label={<Text>{strings.interview?.title} </Text>}
                component={Link}
                disabled
                to="/interview"
                icon={<IconMicrophone2 size={18} />}
                active={location.pathname === '/interview'}
              />
              <NavLink
                label={<Text>{strings.transcriptions?.title} </Text>}
                component={Link}
                to="/transcriptions"
                icon={<IconFileDescription size={18} />}
                active={location.pathname === '/transcriptions'}
              />
            </Navbar.Section>

            {/* Recent Transcription Section */}
            <Navbar.Section grow component={ScrollArea}>
              {RecentTranscriptions()}
            </Navbar.Section>

            {/* Settings Section */}
            <Navbar.Section>
              <NavLink
                label={<Text>{strings.settings?.title}</Text>}
                component={Link}
                to="/settings"
                icon={<IconSettings size={18} />}
                active={location.pathname === '/settings'}
              />
              <NavLink
                label={<Text>{strings.about?.title}</Text>}
                component={Link}
                to="/about"
                icon={<IconInfoCircle size={18} />}
                active={location.pathname === '/about'}
              />
            </Navbar.Section>
          </Navbar>
        }
        // aside={
        //   <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
        //     <Aside p="md" hiddenBreakpoint="sm" width={{ sm: 200, lg: 300 }}>
        //       <Text>{strings.sidebar?.title}</Text>
        //     </Aside>
        //   </MediaQuery>
        // }
        // footer={
        //   <Footer height={60} p="md">
        //     <Group position="apart">
        //       <Text>{strings.about?.title}</Text>

        //     </Group>
        //   </Footer>
        // }
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

              <Title variant="gradient" weight={800} gradient={{ from: 'red', to: 'blue', deg: 135 }}>
                {strings.util.app_name}
              </Title>
            </Group>
          </Header>
        }
      >
        <Outlet />
        <Affix position={{ bottom: 20, right: 20 }}>
          <ActionIcon
            variant="gradient"
            gradient={darkMode ? { from: 'red', to: 'yellow', deg: 135 } : { from: 'blue', to: 'violet', deg: 135 }}
            color={darkMode ? 'yellow' : 'dark'}
            onClick={() => dispatch(toggleDarkMode())}
            title={strings.settings?.toggle_dark_mode}
          >
            {darkMode ? <IconSun size={18} /> : <IconMoonStars size={18} />}
          </ActionIcon>
        </Affix>
      </AppShell>
    </MantineProvider>
  );
}

export default App;
