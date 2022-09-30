import {
  Button,
  ButtonVariant,
  Card,
  Divider,
  Grid,
  Group,
  MantineColor,
  Progress,
  Stack,
  Text,
  Title
} from '@mantine/core';
import React from 'react';
import strings from '../../../localization';

// Redux
import { transcription, transcriptionStatus } from '../transcriptionsSlice';

// Localization

//#region Component Helpers
const progressIndicator = (transcript: transcription) => {
  // Import localization strings
  const labels = strings.util.status;

  const states: {
    [key: string]: {
      color: string; // Color of the progress bar
      showFilled: boolean; // Whether the progress bar should be filled or reflect the transcript.progress value
      animated: boolean; // Whether the progress bar should be animated
      striped: boolean; // Whether the progress bar should be striped
      label: string | undefined; // The label to display on the progress bar
    };
  } = {
    idle: {
      color: 'gray',
      showFilled: true,
      animated: false,
      striped: true,
      label: labels?.idle
    },
    queued: {
      color: 'dimmed',
      showFilled: true,
      animated: true,
      striped: true,
      label: labels?.queued
    },
    pending: {
      color: 'violet',
      showFilled: true,
      animated: true,
      striped: true,
      label: labels?.pending
    },
    processing: {
      color: 'blue',
      showFilled: false,
      animated: true,
      striped: true,
      label: labels?.processing
    },
    stalled: {
      color: 'orange',
      showFilled: false,
      animated: true,
      striped: true,
      label: labels?.stalled
    },
    error: {
      color: 'red',
      showFilled: true,
      animated: false,
      striped: true,
      label: labels?.error
    },
    paused: {
      color: 'yellow',
      showFilled: false,
      animated: false,
      striped: true,
      label: labels?.paused
    },
    complete: {
      color: 'green',
      showFilled: true,
      animated: false,
      striped: true,
      label: labels?.complete
    },
    cancelled: {
      color: 'gray',
      showFilled: true,
      animated: false,
      striped: true,
      label: labels?.cancelled
    },
    deleted: {
      color: 'gray',
      showFilled: true,
      animated: false,
      striped: true,
      label: labels?.deleted
    }
  };

  const state = states[transcript.status];

  return (
    <Progress
      color={state.color}
      value={state.showFilled ? 100 : transcript.progress}
      animate={state.animated}
      striped={state.striped}
      label={state.label}
      size="xl"
    />
  );
};

const buttonBlock = (transcript: transcription) => {
  // Import localization strings
  const buttonStrings = strings.util.buttons;

  type buttonTypes =
    | 'edit' // Edit the transcription
    | 'delete' // Delete the transcription
    | 'cancel' // Cancel the transcription (if it is queued or pending)
    | 'pause' // Pause the transcription (if it is processing)
    | 'resume' // Resume the transcription (if it is paused)
    | 'download' // Download the transcription
    | 'retry' // Retry the transcription (if it is in an error state)
    | 'restore' // Restore the transcription (if it is deleted)
    | 'queue' // Queue the transcription (if it is idle)
    | 'open' // Open the transcription detail view (if it is complete)
    | 'close' // Close the transcription in the editor
    | 'play' // Play the transcription original audio
    | 'stop'; // Stop the transcription original audio

  const buttons: {
    [key in buttonTypes]: {
      action: () => void;
      label: string;
      color: MantineColor;
      style: ButtonVariant;
    };
  } = {
    edit: {
      action: () => console.log('Edit'),
      label: buttonStrings?.edit || 'Edit',
      color: 'red',
      style: 'default'
    },
    delete: {
      action: () => console.log('Delete'),
      label: buttonStrings?.delete || 'Delete',
      color: 'red',
      style: 'default'
    },
    cancel: {
      action: () => console.log('Cancel'),
      label: buttonStrings?.cancel || 'Cancel',
      color: 'red',
      style: 'default'
    },
    pause: {
      action: () => console.log('Pause'),
      label: buttonStrings?.pause || 'Pause',
      color: 'red',
      style: 'default'
    },
    resume: {
      action: () => console.log('Resume'),
      label: buttonStrings?.resume || 'Resume',
      color: 'red',
      style: 'default'
    },
    download: {
      action: () => console.log('Download'),
      label: buttonStrings?.download || 'Download',
      color: 'red',
      style: 'default'
    },
    retry: {
      action: () => console.log('Retry'),
      label: buttonStrings?.retry || 'Retry',
      color: 'red',
      style: 'default'
    },
    restore: {
      action: () => console.log('Restore'),
      label: buttonStrings?.restore || 'Restore',
      color: 'red',
      style: 'default'
    },
    queue: {
      action: () => console.log('Queue'),
      label: buttonStrings?.queue || 'Queue',
      color: 'red',
      style: 'default'
    },
    open: {
      action: () => console.log('Open'),
      label: buttonStrings?.open || 'Open',
      color: 'red',
      style: 'default'
    },
    close: {
      action: () => console.log('Close'),
      label: buttonStrings?.close || 'Close',
      color: 'red',
      style: 'default'
    },
    play: {
      action: () => console.log('Play'),
      label: buttonStrings?.play || 'Play',
      color: 'red',
      style: 'default'
    },
    stop: {
      action: () => console.log('Stop'),
      label: buttonStrings?.stop || 'Stop',
      color: 'red',
      style: 'default'
    }
  };

  // Create a list of buttons to display based on the current state of the transcription
  const buttonList: buttonTypes[] = [];

  switch (transcript.status) {
    case 'idle':
      buttonList.push('edit', 'delete', 'queue');
      break;
    case 'queued':
      buttonList.push('edit', 'delete', 'cancel');
      break;
    case 'pending':
      buttonList.push('edit', 'delete', 'cancel');
      break;
    case 'processing':
      buttonList.push('edit', 'delete', 'pause');
      break;
    case 'stalled':
      buttonList.push('edit', 'delete', 'retry');
      break;
    case 'error':
      buttonList.push('edit', 'delete', 'retry');
      break;
    case 'paused':
      buttonList.push('edit', 'delete', 'resume');
      break;
    case 'complete':
      buttonList.push('edit', 'delete', 'download', 'open');
      break;
    case 'cancelled':
      buttonList.push('edit', 'delete', 'restore');
      break;
    case 'deleted':
      buttonList.push('edit', 'restore');
      break;
  }

  // Return a list of buttons
  return (
    <>
      {buttonList.map((buttonType) => (
        <Button
          key={buttonType}
          onClick={() => {
            buttons[buttonType].action;
          }}
          size="sm"
          color={buttons[buttonType].color}
          variant={buttons[buttonType].style}
        >
          {buttons[buttonType].label}
        </Button>
      ))}
    </>
  );
};

// #endregion

function TranscriptionCard({ transcription }: { transcription: transcription }) {
  return (
    <Card withBorder>
      <Group>
        <Title order={2} lineClamp={2}>
          {transcription.title}
        </Title>
      </Group>

      <Title italic order={6} lineClamp={1}>
        {transcription.description}
      </Title>
      <Divider mt="xs" mb="xs" />
      <Group position="center">{buttonBlock(transcription)}</Group>
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
    </Card>
  );
}

export default TranscriptionCard;
