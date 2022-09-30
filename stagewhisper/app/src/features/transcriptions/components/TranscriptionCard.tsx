import { Text, Card, Divider, Grid, Group, Title, Stack, Progress } from '@mantine/core';
import React from 'react';
import strings from '../../../localization';

// Redux
import { transcription } from '../transcriptionsSlice';

// Localization

function TranscriptionCard({ transcription }: { transcription: transcription }) {
  //'pending' | 'processing' | 'complete' | 'error' | 'cancelled' | 'deleted' | 'paused' | 'queued' | 'stalled';

  const colors = {
    queued: 'dimmed',
    pending: 'violet',
    processing: 'blue',
    stalled: 'orange',
    error: 'red',
    paused: 'yellow',
    complete: 'green',
    cancelled: 'gray',
    deleted: 'red'
  };

  const labels = strings.transcriptions?.status;

  // Constructor
  const progressIndicator = (transcript: transcription) => {
    switch (transcript.status) {
      case 'pending':
        return <Progress size={'xl'} value={100} color={colors.pending} animate striped label={labels?.pending} />;
        break;
      case 'processing':
        return (
          <Progress
            size={'xl'}
            value={transcript.progress}
            color={colors.processing}
            animate
            striped
            label={labels?.processing}
          />
        );
        break;
      case 'error':
        return <Progress size={'xl'} value={100} label={labels?.error} striped color={colors.error} />;
        break;
      case 'paused':
        return (
          <Progress size={'xl'} value={transcript.progress} color={colors.paused} striped label={labels?.paused} />
        );
        break;
      case 'queued':
        return <Progress size={'xl'} value={100} color={colors.queued} striped label={labels?.queued} animate />;
        break;
      case 'stalled':
        return (
          <Progress
            size={'xl'}
            value={transcript.progress}
            color={colors.stalled}
            striped
            label={labels?.stalled}
            animate
          />
        );
        break;
      case 'complete':
        return <Progress size={'xl'} value={100} color={colors.complete} striped label={labels?.complete} />;
        break;
      case 'cancelled':
        return <Progress size={'xl'} value={100} color={colors.cancelled} striped label={labels?.cancelled} />;
        break;
      case 'deleted':
        return <Progress size={'xl'} value={100} color={colors.deleted} striped label={labels?.deleted} />;
        break;
      default:
        return null;
    }
  };

  return (
    <Card withBorder>
      <Title order={2} lineClamp={1}>
        {transcription.title}
      </Title>
      <Title italic order={6} lineClamp={1}>
        {transcription.description}
      </Title>
      <Divider mt="xs" mb="xs" />

      <Grid>
        <Grid.Col md={6} sm={12}>
          {/* Column containing information about the transcription */}
          <Stack spacing={'xs'} justify={'flex-start'}>
            <Text>ID: {transcription.id}</Text>
            <Text>Status: {transcription.status}</Text>
            <Text>Created: {transcription.created}</Text>
          </Stack>
        </Grid.Col>
        <Grid.Col md={6} sm={12}>
          <Text italic color={'dimmed'} lineClamp={10}>
            {transcription.transcript}
          </Text>
          {/* Column containing a preview of the transcription */}
        </Grid.Col>
      </Grid>
      <Divider mt="xs" mb="xs" />
      {progressIndicator(transcription)}
      <Divider mt="xs" mb="xs" />
      <Group position="center">
        {/* Buttons */}
        button
      </Group>
    </Card>
  );
}

export default TranscriptionCard;
