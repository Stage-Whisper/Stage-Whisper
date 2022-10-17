import { Button, Card, Notification, Stack, Title } from '@mantine/core';

import React, { useState } from 'react';
import { useAppDispatch } from '../redux/hooks';
// import { createDebugEntries } from '../features/entries/entrySlice';
import { v4 as uuidv4 } from 'uuid';
import { getLocalFiles } from '../features/entries/entrySlice';

function Debug() {
  interface notificationType {
    id: string;
    title: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
  }

  const [notifications, setNotifications] = useState<notificationType[]>([]);

  const dispatch = useAppDispatch();

  const handleDeleteStore = async () => {
    window.Main.deleteStore();
  };

  return (
    <Stack>
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
    </Stack>
  );
}

export default Debug;
