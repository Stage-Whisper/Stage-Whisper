import {
  Accordion,
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
import React, { useState } from 'react';

// Redux
import { transcription, transcriptionStatus } from '../transcriptionsSlice';

// Localization
import { useDispatch } from 'react-redux';
import strings from '../../../localization';

//#region Component Helpers
const progressIndicator = (transcript: transcription) => {
  // Import localization strings
  const labels = strings.util.status;

  const states: {
    [key in transcriptionStatus]: {
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
    },
    unknown: {
      color: 'gray',
      showFilled: true,
      animated: false,
      striped: true,
      label: labels?.unknown
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

const buttonConstructor = (buttonType: buttonTypes, buttonId: number) => {
  const dispatch = useDispatch();

  const buttonStrings = strings.util.buttons;

  const buttons: {
    [key in buttonTypes]: {
      dispatchAction: string;
      label: string;
      color: MantineColor;
      style: ButtonVariant;
    };
  } = {
    edit: {
      dispatchAction: 'transcriptions/editTranscription',
      label: buttonStrings?.edit || 'Edit',
      color: 'red',
      style: 'default'
    },
    delete: {
      dispatchAction: 'transcriptions/deleteTranscription',
      label: buttonStrings?.delete || 'Delete',
      color: 'red',
      style: 'default'
    },
    cancel: {
      dispatchAction: 'transcriptions/cancelTranscription',
      label: buttonStrings?.cancel || 'Cancel',
      color: 'red',
      style: 'default'
    },
    pause: {
      dispatchAction: 'transcriptions/pauseTranscription',
      label: buttonStrings?.pause || 'Pause',
      color: 'red',
      style: 'default'
    },
    resume: {
      dispatchAction: 'transcriptions/resumeTranscription',
      label: buttonStrings?.resume || 'Resume',
      color: 'red',
      style: 'default'
    },
    download: {
      dispatchAction: 'transcriptions/downloadTranscription',
      label: buttonStrings?.download || 'Download',
      color: 'red',
      style: 'default'
    },
    retry: {
      dispatchAction: 'transcriptions/retryTranscription',
      label: buttonStrings?.retry || 'Retry',
      color: 'red',
      style: 'default'
    },
    restore: {
      dispatchAction: 'transcriptions/restoreTranscription',
      label: buttonStrings?.restore || 'Restore',
      color: 'red',
      style: 'default'
    },
    queue: {
      dispatchAction: 'transcriptions/queueTranscription',
      label: buttonStrings?.queue || 'Queue',
      color: 'red',
      style: 'default'
    },
    open: {
      dispatchAction: 'transcriptions/openTranscription',
      label: buttonStrings?.open || 'Open',
      color: 'red',
      style: 'default'
    },
    close: {
      dispatchAction: 'transcriptions/closeTranscription',
      label: buttonStrings?.close || 'Close',
      color: 'red',
      style: 'default'
    },
    play: {
      dispatchAction: 'transcriptions/playTranscription',
      label: buttonStrings?.play || 'Play',
      color: 'red',
      style: 'default'
    },
    stop: {
      dispatchAction: 'transcriptions/stopTranscription',
      label: buttonStrings?.stop || 'Stop',
      color: 'red',
      style: 'default'
    }
  };

  return (
    <Button
      key={buttonType}
      onClick={() => {
        dispatch({ type: buttons[buttonType].dispatchAction, payload: { id: buttonId } });
      }}
      size="sm"
      color={buttons[buttonType].color}
      variant={buttons[buttonType].style}
    >
      {buttons[buttonType].label}
    </Button>
  );
};

const buttonBlock = (transcript: transcription) => {
  // Create a group of buttons to display based on the current state of the transcription
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
    <Group position={'left'}>{buttonList.map((buttonType) => buttonConstructor(buttonType, transcript.id))}</Group>
  );
};

// #endregion

function TranscriptionCard({ transcription }: { transcription: transcription }) {
  // Local state for the transcription card - used to show/hide the file/transcription details
  const [expanded, setExpanded] = useState<string[]>([]);

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

      <Grid align={'flex-start'}>
        <Grid.Col md={6} sm={12}>
          {/* Column containing information about the transcription */}
          <Stack spacing="xs" justify={'space-between'} style={{ minHeight: '900' }}>
            <Accordion multiple variant="contained" value={expanded} onChange={setExpanded}>
              {/* StageWhisper information */}
              <Accordion.Item value="transcription">
                <Accordion.Control>
                  <Title order={3}>{strings.transcriptions?.card.transcription_section_title}</Title>
                </Accordion.Control>
                <Accordion.Panel>
                  {/* Transcription Completed Date  */}
                  <Text weight={700}>
                    {strings.transcriptions?.card.completed_on}:{' '}
                    {transcription.status === 'complete' ? (
                      <Text weight={500} span>
                        {transcription.created}
                      </Text>
                    ) : (
                      <Text weight={500} span transform="capitalize">
                        {strings.transcriptions?.card.never_completed}
                      </Text>
                    )}
                  </Text>
                  {/* Transcription Model Used  */}
                  <Text weight={700}>
                    {strings.transcriptions?.card.model_used}:{' '}
                    <Text weight={500} transform="capitalize" span>
                      {transcription.model}
                    </Text>
                  </Text>
                  {/* Transcription File Length */}
                  <Text weight={700}>
                    Model:{' '}
                    <Text weight={500} transform="capitalize" span>
                      {transcription.model}
                    </Text>
                  </Text>
                  {/* Transcription File Location  */}
                  <Text weight={700}>
                    {strings.transcriptions?.card.output_directory}:{' '}
                    <Text weight={500} transform="capitalize" italic span>
                      {transcription.directory}
                    </Text>
                  </Text>
                </Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item value="audio">
                {/* Audio File Information */}
                <Accordion.Control>
                  <Title order={3}>{strings.transcriptions?.card.audio_section_title}</Title>
                </Accordion.Control>
                <Accordion.Panel>
                  {/* Audio File Name  */}
                  <Text weight={700}>
                    {strings.transcriptions?.card.file_name}:{' '}
                    <Text weight={500} transform="capitalize" span>
                      {transcription.audioName}
                    </Text>
                  </Text>
                  {/* Audio File Type  */}
                  <Text weight={700}>
                    {strings.transcriptions?.card.file_type}:{' '}
                    <Text weight={500} transform="capitalize" span>
                      {transcription.audioFormat}
                    </Text>
                  </Text>
                  {/* Audio File Size  */}
                  <Text weight={700}>
                    {strings.transcriptions?.card.file_length}:{' '}
                    <Text weight={500} transform="capitalize" span>
                      {transcription.length
                        ? transcription.length < 60
                          ? `${transcription.length} ${strings.util.time?.seconds}`
                          : `${Math.floor(transcription.length / 60)} ${strings.util.time?.minutes} ${
                              transcription.length % 60
                            } ${strings.util.time?.seconds}`
                        : strings.util.status?.unknown}
                    </Text>
                  </Text>
                  {/* Audio File Language  */}
                  <Text weight={700}>
                    {strings.transcriptions?.card.file_language}:{' '}
                    <Text weight={500} transform="capitalize" span>
                      {strings.getString(`languages.${transcription.language}`) || transcription.language}
                    </Text>
                  </Text>
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
          </Stack>
        </Grid.Col>
        <Grid.Col md={6} sm={12}>
          {/* Column containing a preview of the transcription */}
          <Text italic color={'dimmed'} lineClamp={15}>
            {transcription.transcriptText}
          </Text>
        </Grid.Col>
      </Grid>
      <Divider mt="xs" mb="xs" />
      {buttonBlock(transcription)}
      <Divider mt="xs" mb="xs" />
      {progressIndicator(transcription)}
    </Card>
  );
}

export default TranscriptionCard;
