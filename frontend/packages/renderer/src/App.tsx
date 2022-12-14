// React
import React, {useEffect} from 'react';
import {Link, Outlet, useLocation, useParams} from 'react-router-dom';

// Mantine / Styling
import {
  Affix,
  AppShell,
  Burger,
  Divider,
  Header,
  Loader,
  MantineProvider,
  Navbar,
  NavLink,
  ScrollArea,
  Switch,
  Text,
  useMantineTheme,
} from '@mantine/core';
import {NotificationsProvider} from '@mantine/notifications';
import {
  IconFileCheck,
  IconFileDescription,
  IconHome,
  IconInfoCircle,
  IconLanguage,
  IconMicrophone2,
  IconMoonStars,
  IconSettings,
  IconSun,
} from '@tabler/icons';
import Styling from './features/styling';

// Logos / Icons
// import colorLogo from './assets/logos/color/Logo - Full ColourSVG.svg';
// import reverseColorLogo from './assets/logos/color/reversed/Logo - ReversedSVG.svg';
// import monoLogo from './assets/logos/mono/Logo - MonoSVG.svg';
// import reverseMonoLogo from './assets/logos/mono/reversed/Logo - Reversed MonoSVG.svg';

// Localization
import strings from './features/localization';

// Debug

// Redux
import {useMediaQuery} from '@mantine/hooks';
import {selectBurgerOpen, setBurgerOpen} from './appSlice';
import {
  getLocalFiles,
  selectActiveEntry,
  selectEntries,
  selectNumberOfEntries,
  setActiveEntry,
} from './features/entries/entrySlice';
import {
  selectDarkMode,
  selectDisplayLanguage,
  toggleDarkMode,
} from './features/settings/settingsSlice';
import {selectTranscribingStatus} from './features/whisper/whisperSlice';
import {useAppDispatch, useAppSelector} from './redux/hooks';

// Entries list - Shows all entries
function EntryList({darkMode}: {darkMode: boolean}) {
  const entries = useAppSelector(selectEntries);
  const transcribing = useAppSelector(selectTranscribingStatus);
  const dispatch = useAppDispatch();
  const {entryUUID} = useParams();

  return (
    <>
      <Divider mt={'sm'} />

      {entries.map(entry => {
        return (
          <NavLink
            key={entry.uuid}
            variant={darkMode ? 'filled' : 'filled'}
            label={<Text lineClamp={1}>{entry.name}</Text>}
            icon={
              transcribing.entry?.uuid === entry.uuid ? (
                <Loader size={'sm'} />
              ) : entry.transcriptions[0] ? (
                <IconFileCheck />
              ) : (
                <IconFileDescription />
              )
            }
            component={Link}
            to={`/entries/${entry.uuid}`}
            onClick={() => {
              dispatch(setBurgerOpen(false));
            }}
            active={entry.uuid === entryUUID}
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

  const isMobile = useMediaQuery('(max-width: 768px)');

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
    <MantineProvider
      theme={{
        defaultGradient: {
          from: '#F6663A',
          to: '#F6853A',
          deg: 45,
        },
        colorScheme: darkMode ? 'dark' : 'light',
        components: {
          Button: {
            defaultProps: {
              color: 'brand',
            },
          },
          NavLink: {
            defaultProps: {},
          },
        },
        // fontFamily: 'Asap, sans-serif',
        //Heading One, bold 44px w/ 56px line space
        // Heading Two, bold at 32px / 36px
        // Heading Three, bold at 24px / 28px
        // Paragraph type, 17px / 22px
        // Small type, 14px / 18px
        //  Tiny type, all caps at 9px / 9px
        headings: {
          // fontFamily: 'Asap, sans-serif',
          h1: {fontSize: 44, lineHeight: 56, fontWeight: 700},
          h2: {fontSize: 32, lineHeight: 36, fontWeight: 700},
          h3: {fontSize: 24, lineHeight: 28, fontWeight: 700},
          h4: {fontSize: 17, lineHeight: 22, fontWeight: 700},
        },
        activeStyles: {
          transform: 'scale(0.95)',
        },
        colors: {
          brand: [
            // '#FDDBCC',
            // '#FBC7AF',
            '#FAB594',
            '#F9A37B',
            '#F89364',
            '#F7844E',
            '#F6763A', // - Brand Primary
            '#F56826',
            '#F45B13',
            '#EA520B',
            '#D94C0A',
            '#CA4709',
            // '#BC4209' // '#ffebdf', // 1 // '#ffcbb2', // 2 // '#fba983', // 3 // '#f88853', // 4 // '#f56624', // 5 // '#db4d0a', // 6 -- Default For Dark Mode // '#ac3b06', // 7 -- Default for light mode // '#7b2a04', // 8 // '#4b1800', // 9 // '#1f0600' // 10
          ],
          brandDarkGrey: [
            '#5A5A5A', // 1
            '#525252', // 2
            '#4B4B4B', // 3
            '#444444', // 4
            '#3E3E3E', // 5
            '#383838', // 6 -- Default For Dark Mode
            '#333333', // 7 -- Default for light mode
            '#2E2E2E', // 8
            '#292929', // 9
            '#252525', // 10
          ],
          brandLightGrey: [
            '#F9F9F9', // 1
            '#E2E2E2', // 2
            '#CECECE', // 3
            '#BBBBBB', // 4
            '#A8A8A8', // 5
            '#979797', // 6 -- Default For Dark Mode
            '#888888', // 7 -- Default for light mode
            '#7B7B7B', // 8
            '#6E6E6E', // 9
            '#636363', // 10
          ],
        },
        primaryColor: 'brand',
      }}
      withGlobalStyles
      withNormalizeCSS
    >
      <Styling />
      <NotificationsProvider>
        <AppShell
          navbarOffsetBreakpoint="sm"
          asideOffsetBreakpoint="sm"
          navbar={
            // Main navigation sidebar with Dashboard, Transcribe, Interview and Transcription pages
            <Navbar
              hiddenBreakpoint="sm"
              hidden={!burgerOpen}
              width={{sm: 200, lg: 300}}
            >
              <Navbar.Section m={0}>
                <NavLink
                  variant={darkMode ? 'filled' : 'filled'}
                  onClick={() => {
                    dispatch(setBurgerOpen(false));
                  }}
                  label={<Text>{strings.dashboard?.title}</Text>}
                  icon={<IconHome size={18} />}
                  active={location.pathname === '/'}
                  component={Link}
                  to="/"
                />
                <NavLink
                  label={<Text>{strings.input?.title}</Text>}
                  variant={darkMode ? 'filled' : 'filled'}
                  onClick={() => {
                    dispatch(setBurgerOpen(false));
                  }}
                  icon={<IconLanguage size={18} />}
                  active={location.pathname === '/transcribe'}
                  component={Link}
                  to="/transcribe"
                />
                <NavLink
                  label={<Text>{strings.interview?.title} </Text>}
                  variant={darkMode ? 'filled' : 'filled'}
                  onClick={() => {
                    dispatch(setBurgerOpen(false));
                  }}
                  component={Link}
                  disabled
                  to="/interview"
                  icon={<IconMicrophone2 size={18} />}
                  active={location.pathname === '/interview'}
                />
                <NavLink
                  label={<Text>{strings.entries?.title} </Text>}
                  variant={darkMode ? 'filled' : 'filled'}
                  component={Link}
                  to="/entries"
                  icon={<IconFileDescription size={18} />}
                  onClick={() => {
                    dispatch(setActiveEntry(null));
                    dispatch(setBurgerOpen(false));
                  }}
                  disabled={numberOfEntries === 0}
                  active={location.pathname === '/entries' && activeEntry === null}
                />
              </Navbar.Section>
              {/* Entries List*/}
              <Navbar.Section
                component={ScrollArea}
                grow
              >
                {EntryList({darkMode})}
              </Navbar.Section>
              <Divider />
              {/* Settings Section */}
              <Navbar.Section>
                <NavLink
                  label={<Text>{strings.settings?.title}</Text>}
                  variant={darkMode ? 'filled' : 'filled'}
                  onClick={() => {
                    dispatch(setBurgerOpen(false));
                  }}
                  component={Link}
                  to="/settings"
                  icon={<IconSettings size={18} />}
                  active={location.pathname === '/settings'}
                />
                <NavLink
                  label={<Text>{strings.about?.title}</Text>}
                  variant={darkMode ? 'filled' : 'filled'}
                  onClick={() => {
                    dispatch(setBurgerOpen(false));
                  }}
                  component={Link}
                  to="/about"
                  icon={<IconInfoCircle size={18} />}
                  active={location.pathname === '/about'}
                />
              </Navbar.Section>
            </Navbar>
          }
        >
          {isMobile && (
            <Header
              height={70}
              p="md"
            >
              <Burger
                opened={burgerOpen}
                onClick={() => dispatch(setBurgerOpen(!burgerOpen))}
                size="sm"
                color={theme.colors.gray[6]}
                mr="xl"
              />
            </Header>
          )}

          <Affix position={{bottom: 20, right: 20}}>
            <Switch
              radius={'md'}
              size={'md'}
              color={theme.colorScheme === 'dark' ? 'gray' : 'dark'}
              onLabel={
                <IconMoonStars
                  size={18}
                  color={'#F6763A'}
                />
              }
              offLabel={
                <IconSun
                  size={18}
                  color={'#F56826'}
                />
              }
              checked={darkMode}
              onChange={() => {
                dispatch(toggleDarkMode());
              }}
            />
          </Affix>
          <Outlet />
        </AppShell>
      </NotificationsProvider>
    </MantineProvider>
  );
}

export default App;
