import { Button, Card, Center, Divider, Grid, Group, Loader, Stack, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconFileCheck, IconFileDescription } from '@tabler/icons';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';

// Redux
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';

// Localization
import strings from '../../../localization';

import { passToWhisper, selectTranscribingStatus } from '../../whisper/whisperSlice';
import { getLocalFiles, ReduxEntry } from '../entrySlice';
import { Entry } from '@prisma/client';

function TranscriptionCard({ entry }: { entry: ReduxEntry }) {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  // may not be the same as the entry passed into this component
  const transcribing = useAppSelector(selectTranscribingStatus);

  // Detect mobile view
  const isMobile = useMediaQuery('(max-width: 768px)');

  const buttons =
    entry.transcriptions.length > 0 ? (
      // Has transcriptions
      <>
        <Button
          onClick={() => {
            // Get the latest transcription
            const transcription = entry.transcriptions[entry.transcriptions.length - 1];
            window.Main.exportTranscription(transcription.uuid, entry);
          }}
          color="green.6"
          variant="outline"
        >
          Export to Desktop
          {/* Desktop */}
          {/* {strings.util.buttons?.export} */}
        </Button>
        <Button
          onClick={() => {
            navigate(`/entries/${entry.uuid}`);
          }}
          color="primary"
          variant="outline"
        >
          {strings.util.buttons?.open}
        </Button>

        <Button
          onClick={async () => {
            try {
              const normalizedEntry = (await window.Main.GET_ENTRY({ entryUUID: entry.uuid })) as Entry;
              if (!normalizedEntry) throw new Error('Entry not found');
              await window.Main.deleteEntry(normalizedEntry).then(() => {
                console.log('Deleted: Reloading local files');
                dispatch(getLocalFiles());
              });
            } catch (e) {
              console.log('Error deleting entry', e);
              console.log(e);
            }
          }}
          color="red"
          variant="outline"
          disabled={transcribing.status === 'loading' && transcribing.entry?.uuid === entry.uuid}
        >
          {strings.util.buttons?.delete}
        </Button>
      </>
    ) : (
      // No transcriptions
      <>
        <Button
          onClick={() => {
            dispatch(passToWhisper({ entry }));
          }}
          color="violet"
          variant="outline"
          disabled={transcribing.status === 'loading'}
        >
          {strings.util.buttons?.transcribe}
        </Button>
        {transcribing.status === 'loading' && transcribing.entry?.uuid === entry.uuid ? (
          // Cancel button
          <Button
            onClick={() => {
              console.log('Cancel');
            }}
            color="red"
            variant="outline"
            disabled={transcribing.status === 'loading' && transcribing.entry?.uuid !== entry.uuid}
          >
            {strings.util.buttons?.cancel}
          </Button>
        ) : (
          // Delete button
          <Button
            onClick={async () => {
              try {
                const normalizedEntry = (await window.Main.GET_ENTRY({ entryUUID: entry.uuid })) as Entry;
                if (!normalizedEntry) throw new Error('Entry not found');
                await window.Main.deleteEntry(normalizedEntry).then(() => {
                  console.log('Deleted: Reloading local files');
                  dispatch(getLocalFiles());
                });
              } catch (e) {
                console.log('Error deleting entry', e);
                console.log(e);
              }
            }}
            color="red"
            variant="outline"
            disabled={transcribing.status === 'loading' && transcribing.entry?.uuid === entry.uuid}
          >
            {strings.util.buttons?.delete}
          </Button>
        )}
      </>
    );

  const icon =
    transcribing?.entry?.uuid === entry?.uuid ? (
      <Loader /> // If the entry is currently being transcribed, show a loading icon
    ) : entry.transcriptions.length > 0 ? (
      <IconFileCheck size={40} />
    ) : (
      // If the entry has no transcriptions, show a
      <IconFileDescription size={40} /> // If the entry has transcriptions, show a file description icon
    );

  // Main Card Content
  const content = (
    <Card withBorder>
      <Grid grow align={'center'}>
        <Grid.Col span={isMobile ? 12 : 8} style={{ height: '100%' }}>
          <Stack justify={'center'}>
            <Group noWrap>
              {icon}
              {/* Loader */}

              {/* Title */}
              <Stack>
                <Text size={'lg'} weight={700} style={{ wordBreak: 'break-word', overflow: 'clip' }}>
                  {entry.name}
                </Text>
                {/* Added */}

                <Text span weight={500}>
                  {new Date(entry.created).toDateString()} - {new Date(entry.created).toLocaleTimeString()}
                </Text>
              </Stack>
            </Group>
            <Divider hidden={!isMobile} />
          </Stack>
        </Grid.Col>
        <Divider orientation="vertical" hidden={isMobile} />

        {/* Buttons */}
        <Grid.Col span={isMobile ? 12 : 3}>
          {/* Buttons */}
          <Center style={{ width: '100%' }}>
            {isMobile ? <Group noWrap>{buttons}</Group> : <Stack style={{ width: '90%' }}>{buttons}</Stack>}
          </Center>
        </Grid.Col>
      </Grid>
    </Card>
  );
  return content;
}
export default TranscriptionCard;
