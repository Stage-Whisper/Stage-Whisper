import {
  ActionIcon,
  Affix,
  AppShell,
  // Aside,
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
  IconAlertTriangle,
  IconBug,
  IconBugOff,
  IconCaretRight,
  IconFileAlert,
  IconFileCheck,
  IconFileDescription,
  IconHome,
  IconInfoCircle,
  IconLanguage,
  IconMicrophone2,
  IconMoonStars,
  IconPlayerPause,
  IconQuestionMark,
  IconRefreshAlert,
  IconSettings,
  IconSun,
  IconTrash
} from '@tabler/icons';
import strings from './localization';
import { useAppDispatch, useAppSelector } from './redux/hooks';

import { selectBurgerOpen, selectDebugMenu, setBurgerOpen, toggleDebugMenu } from './appSlice';
import { selectDarkMode, selectDisplayLanguage, toggleDarkMode } from './features/settings/settingsSlice';
import {
  selectActiveEntry,
  selectNumberOfEntries,
  selectEntries,
  setActiveEntry,
  getLocalFiles
} from './features/entries/entrySlice';
import Debug from './debug/Debug';
import { selectTranscribingStatus } from './features/whisper/whisperSlice';
// import { ipcRenderer } from 'electron';
// import { Channels } from '../electron/types/channels';

// Recent Transcription Constructor - Shows jobs that are in progress or queued
function RecentTranscriptions() {
  const entries = useAppSelector(selectEntries);
  const activeEntry = useAppSelector(selectActiveEntry);
  const dispatch = useAppDispatch();

  if (!entries.length) {
    return <></>;
  } else {
    return (
      <>
        <Divider mt={'sm'} />
        {/* <Title order={6}>{strings.entries?.recent_transcriptions}</Title> */}

        {entries.map((entry) => {
          let icon: JSX.Element;

          return entry.transcriptions.map((transcription) => {
            switch (transcription.status) {
              case 'idle' || 'paused':
                icon = <IconPlayerPause />;
                break;
              case 'processing':
                icon = <Loader size={'xs'} variant="oval" />;
                break;
              case 'error':
                icon = <IconFileAlert />;
                break;
              case 'complete':
                icon = <IconFileCheck />;
                break;
              case 'queued':
                icon = <IconCaretRight />;
                break;
              case 'deleted':
                icon = <IconTrash />;
                break;
              case 'unknown':
                icon = <IconQuestionMark />;
                break;
              case 'stalled':
                icon = <IconRefreshAlert />;
                break;
              case 'cancelled':
                icon = <IconFileAlert />;
                break;

              default:
                icon = <IconAlertTriangle />;
                break;
            }

            return (
              <NavLink
                key={transcription.uuid}
                label={<Text lineClamp={1}>{entry.config.name}</Text>}
                component={Link}
                to={`/entries`}
                onClick={() => {
                  dispatch(setActiveEntry(entry));
                  dispatch(setBurgerOpen(false));
                }}
                active={entry.config.uuid === activeEntry}
                icon={
                  icon
                  // transcription.status === 'error' || transcription.status === 'unknown' ? ( // If transcription is error or unknown show error icon
                  //   <IconBugOff />
                  // ) : transcription.status === '' ? ( // If transcription is in progress show loading icon
                  //   <Loader size={'xs'} variant="oval" />
                  // ) : (
                  //   // Else show nothing
                  //   <></>
                  // )
                }
              />
            );
          });
        })}
      </>
    );
  }
}

// Entries list - Shows all entries
function EntryList() {
  const entries = useAppSelector(selectEntries);
  const activeEntry = useAppSelector(selectActiveEntry);
  const dispatch = useAppDispatch();
  const { entryId } = useParams();
  return (
    <>
      <Divider mt={'sm'} />

      {entries.map((entry) => {
        return (
          <NavLink
            key={entry.config.uuid}
            label={<Text lineClamp={1}>{entry.config.name}</Text>}
            component={Link}
            to={`/entries/${entry.config.uuid}`}
            onClick={() => {
              dispatch(setBurgerOpen(false));
            }}
            active={entry.config.uuid === entryId}
            icon={<IconFileDescription />}
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
            <Navbar.Section>{EntryList()}</Navbar.Section>

            {/* Recent Transcription Section */}
            <Navbar.Section grow component={ScrollArea}>
              {/* FIXME: Disabled pending possible removal */}
              {false && RecentTranscriptions()}
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
        {/* Debugging Component */}
        {useAppSelector(selectDebugMenu) ? <Affix position={{ bottom: 60, right: 20 }}>{<Debug />}</Affix> : <></>}

        <Affix position={{ bottom: 20, right: 20 }}>
          <Group>
            <ActionIcon
              variant="gradient"
              gradient={darkMode ? { from: 'red', to: 'yellow', deg: 135 } : { from: 'blue', to: 'violet', deg: 135 }}
              onClick={() => dispatch(toggleDarkMode())}
              title={strings.settings?.dark_mode}
            >
              {darkMode ? <IconSun size={18} /> : <IconMoonStars size={18} />}
            </ActionIcon>
            <ActionIcon
              variant="filled"
              onClick={() => dispatch(toggleDebugMenu())}
              title={strings.settings?.debug_menu}
            >
              {useAppSelector(selectDebugMenu) ? <IconBugOff size={18} /> : <IconBug size={18} />}
            </ActionIcon>
          </Group>
        </Affix>
      </AppShell>
    </MantineProvider>
  );
}

export default App;
