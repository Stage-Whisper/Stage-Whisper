import { Button, Card, Stack, Title, Notification } from '@mantine/core';
import { NodeList } from 'subtitle';
import React, { useState } from 'react';
import { useAppDispatch } from '../redux/hooks';
import { createDebugTranscriptions } from '../features/transcriptions/transcriptionsSlice';
import { v4 as uuidv4 } from 'uuid';

function Debug() {
  //#region Testing area

  interface notificationType {
    id: string;
    title: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
  }

  const [notifications, setNotifications] = useState<notificationType[]>([]);
  //#endregion

  const dispatch = useAppDispatch();
  // const notifications = [] as JSX.Element[];

  const addNotification = (title: string, body: string) => {
    setNotifications((prev) => [...prev, { title, message: body, type: 'success', id: uuidv4() }]);
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

          <Button
            onClick={() => {
              if (window.Main) {
                window.Main.loadVttFromFile('dev', true).then((vtt: NodeList) => {
                  if (
                    vtt.some((node) => {
                      return node.type === 'cue';
                    })
                  ) {
                    addNotification('Success!', 'VTT Loaded');
                  } else {
                    addNotification('Error!', 'VTT Not Loaded');
                  }
                });
              }
            }}
            variant="outline"
          >
            Test VTT Loading
          </Button>
          <Button
            onClick={() => {
              dispatch(createDebugTranscriptions());
            }}
            variant="outline"
          >
            Create Debug Transcriptions
          </Button>
        </Stack>
      </Card>
    </Stack>
  );
}

export default Debug;
