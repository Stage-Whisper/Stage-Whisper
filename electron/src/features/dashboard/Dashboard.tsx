import { Card, Center, Divider, Group, Stack, Text, Title } from '@mantine/core';
import * as React from 'react';
import strings from '../../localization';
import { useAppSelector } from '../../redux/hooks';
import { selectEntries } from '../entries/entrySlice';
import { selectTranscribingStatus } from '../whisper/whisperSlice';

function Dashboard() {
  // const dispatch = useAppDispatch();
  const status = useAppSelector(selectTranscribingStatus);

  const entries = useAppSelector(selectEntries);

  let numberOfTranscriptions = 0;

  entries.forEach((entry) => {
    if (entry.transcriptions) {
      numberOfTranscriptions += entry.transcriptions.length;
    }
  });

  return (
    // Dashboard showing interesting stats about the user's entries and transcriptions
    <Center>
      <Stack style={{ maxWidth: 1000 }}>
        <Title order={3}>{strings.dashboard?.title}</Title>

        <Card withBorder>
          <Title order={3}>Explainer</Title>
          <Divider />
          <Text>
            This is where we will describe the application and how to use it. We will talk about the whisper model, give
            attribution, explain that this app works offline and that it is open source.
          </Text>
        </Card>
        <Card withBorder>
          <Title order={3}>Stats</Title>
          <Divider />
          <Title order={4}>Entries</Title>
          <Text>Number of entries :{entries.length}</Text>
          <Title order={4}>Transcriptions</Title>
          <Text>Number of transcriptions :{numberOfTranscriptions}</Text>
        </Card>
        <Card withBorder>
          <Title order={3}>Box Of Links</Title>
          <Divider />
          <Group>
            <Text>Link to github</Text>
            <Text>Link to openAi</Text>
            <Text>Link to discord</Text>
          </Group>
        </Card>
        <Card withBorder>
          <Title order={3}>Status</Title>
          <Divider />
          <Text>Transcribing status: {status.status}</Text>
        </Card>
      </Stack>
    </Center>
  );
}

export default Dashboard;
