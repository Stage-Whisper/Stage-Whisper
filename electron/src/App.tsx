import {
  AppShell,
  Burger,
  Divider,
  Group,
  Header,
  Loader,
  MantineProvider,
  MediaQuery,
  Navbar,
  NavLink,
  ScrollArea,
  Text,
  Title,
  useMantineTheme
} from '@mantine/core';
import React, { useEffect } from 'react';
import { Link, Outlet, useLocation, useParams } from 'react-router-dom';

import {
  IconFileCheck,
  IconFileDescription,
  IconHome,
  IconInfoCircle,
  IconLanguage,
  IconMicrophone2,
  IconSettings
} from '@tabler/icons';
import strings from './localization';
import { useAppDispatch, useAppSelector } from './redux/hooks';

import { NotificationsProvider } from '@mantine/notifications';

import { selectBurgerOpen, setBurgerOpen } from './appSlice';

import Debug from './debug/Debug';
import {
  getLocalFiles,
  selectActiveEntry,
  selectEntries,
  selectNumberOfEntries,
  setActiveEntry
} from './features/entries/entrySlice';

import { selectDarkMode, selectDisplayLanguage } from './features/settings/settingsSlice';

import { selectTranscribingStatus } from './features/whisper/whisperSlice';

// Entries list - Shows all entries
function EntryList() {
  const entries = useAppSelector(selectEntries);
  const transcribing = useAppSelector(selectTranscribingStatus);
  const dispatch = useAppDispatch();
  const { entryId } = useParams();
  return (
    <>
      <Divider mt={'sm'} />

      {entries.map((entry) => {
        return (
          <NavLink
            key={entry.uuid}
            label={<Text lineClamp={1}>{entry.name}</Text>}
            icon={
              transcribing.entry?.uuid === entry.uuid ? (
                <Loader size={'sm'} />
              ) : entry.transcriptions[0] ? (
                <IconFileCheck color="green" />
              ) : (
                <IconFileDescription />
              )
            }
            component={Link}
            to={`/entries/${entry.uuid}`}
            onClick={() => {
              dispatch(setBurgerOpen(false));
            }}
            active={entry.uuid === entryId}
          />
        );
      })}
    </>
  );
}

// Main App Component
function App() {
  // Redux
  const dispatch = useAppDispatch();
  const darkMode = useAppSelector(selectDarkMode);
  const displayLanguage = useAppSelector(selectDisplayLanguage);
  const activeEntry = useAppSelector(selectActiveEntry);
  const burgerOpen = useAppSelector(selectBurgerOpen);
  const numberOfEntries = useAppSelector(selectNumberOfEntries);

  // Theming
  const theme = useMantineTheme();

  // Monitor the current language and update when it changes
  strings.setLanguage(displayLanguage || 'en');

  const location = useLocation();

  useEffect(() => {
    // Get local files on app load
    dispatch(getLocalFiles());
  }, []);

  const transcription = useAppSelector(selectTranscribingStatus);

  useEffect(() => {
    // UseEffect that watches the status of Whisper and triggers a reload if it changes
    //BUG: This will cause bugs with the state updating while users are interacting with the app.
    // Fix: When a whisper process completes, it should only reload the entry that completed
    if (transcription.status === 'succeeded') {
      console.warn('App: UseEffect Triggered, Transcription Status Changed, Reloading Entries');
      dispatch(getLocalFiles());
    }
  }, [transcription.status]);

  return (
    <MantineProvider theme={{ colorScheme: darkMode ? 'dark' : 'light' }} withGlobalStyles withNormalizeCSS>
      <NotificationsProvider>
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
                  label={<Text>{strings.input?.title}</Text>}
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
                  label={<Text>{strings.entries?.title} </Text>}
                  component={Link}
                  to="/entries"
                  icon={<IconFileDescription size={18} />}
                  onClick={() => dispatch(setActiveEntry(null))}
                  disabled={numberOfEntries === 0}
                  active={location.pathname === '/entries' && activeEntry === null}
                />
              </Navbar.Section>
              {/* Entries List*/}
              <Navbar.Section component={ScrollArea} grow>
                {EntryList()}
              </Navbar.Section>
              <Divider />
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
          {/* Debugging Component */}
          <Debug />
        </AppShell>
      </NotificationsProvider>
    </MantineProvider>
  );
}

export default App;
