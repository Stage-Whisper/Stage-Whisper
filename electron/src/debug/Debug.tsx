
import { ActionIcon, Affix, Button, Card, Group, Notification, Stack, Title } from '@mantine/core';


import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
// import { createDebugEntries } from '../features/entries/entrySlice';
import { IconBug, IconBugOff, IconMoonStars, IconSun } from '@tabler/icons';
import { v4 as uuidv4 } from 'uuid';
import { selectDebugMenu, toggleDebugMenu } from '../appSlice';
import { getLocalFiles } from '../features/entries/entrySlice';
import { toggleDarkMode } from '../features/settings/settingsSlice';
import strings from '../localization';
import { selectDarkMode } from '../features/settings/settingsSlice';
function Debug() {
  interface notificationType {
    id: string;
    title: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
  }

  const [notifications, setNotifications] = useState<notificationType[]>([]);

  const dispatch = useAppDispatch();

  const darkMode = useAppSelector(selectDarkMode);


  const handleDeleteStore = async () => {
    window.Main.deleteStore();
  };
  const showMenu = useAppSelector(selectDebugMenu);

  return (
    <>
      <Affix position={{ top: 20, right: 20 }}>
        <Group>
          <ActionIcon
            variant="gradient"
            gradient={darkMode ? { from: 'red', to: 'yellow', deg: 135 } : { from: 'blue', to: 'violet', deg: 135 }}
            onClick={() => dispatch(toggleDarkMode())}
            title={strings.settings?.dark_mode}
          >
            {darkMode ? <IconSun size={18} /> : <IconMoonStars size={18} />}
          </ActionIcon>
          <ActionIcon variant="filled" onClick={() => dispatch(toggleDebugMenu())} title={strings.settings?.debug_menu}>
            {useAppSelector(selectDebugMenu) ? <IconBugOff size={18} /> : <IconBug size={18} />}
          </ActionIcon>
        </Group>
      </Affix>
      {showMenu && (
        <Affix position={{ top: 60, right: 20 }}>
          {/* <Stack> */}
          {notifications.map((notification) => (
            <Notification
              key={uuidv4()}
              title={notification.title}
              color={notification.type === 'success' ? 'teal' : 'red'}
              // type={notification.type}
              onClose={() => {
                console.log();
                setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
              }}
            >
              {notification.message}
            </Notification>
          ))}
          <Card withBorder>
            <Stack>
              <Title order={5} mb={'sm'}>
                Debug Menu
              </Title>

              {/* Load Data Into Redux */}
              <Button
                onClick={() => {
                  if (window.Main) {
                    // window.Main.loadDatabase().then((entries) => {
                    //   console.log(entries);
                    // });
                    dispatch(getLocalFiles());
                  } else {
                    console.log('no window.Main');
                  }
                }}
                variant="outline"
              >
                Load Data Into Redux
              </Button>

              {/* Reset App */}
              <Button
                variant="outline"
                disabled={true}
                onClick={() => {
                  if (window.Main) {
                    handleDeleteStore(); // To delete store go to /Users/{username}/Library/Application Support/stagewhisper/store on mac or %appdata%/stagewhisper/store on windows
                    // The Store directory should also be logged to the console when the app starts
                  } else {
                    console.log('no window.Main');
                  }
                }}
              >
                Reset App
              </Button>
            </Stack>
          </Card>
          {/* </Stack> */}
        </Affix>
      )}
    </>
  );
}

export default Debug;
