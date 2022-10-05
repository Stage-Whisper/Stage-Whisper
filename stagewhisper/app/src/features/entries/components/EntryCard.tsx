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

import { entry, transcriptionStatus } from '../../../../electron/types/types';

// Localization

import strings from '../../../localization';
import { useAppDispatch } from '../../../redux/hooks';
import { passToWhisper } from '../../whisper/whisperSlice';

//#region Component Helpers
const progressIndicator = (active_transcript: entry['transcriptions'][0]) => {
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

  const state = states[active_transcript.status];

  return (
    <Progress
      color={state.color}
      value={state.showFilled ? 100 : active_transcript.progress}
      animate={state.animated}
      striped={state.striped}
      label={state.label}
      size="xl"
    />
  );
};
type buttonTypes =
  | 'edit' // Edit the entry
  | 'delete' // Delete the entry
  | 'cancel' // Cancel the entry (if it is queued or pending)
  | 'pause' // Pause the entry (if it is processing)
  | 'resume' // Resume the entry (if it is paused)
  | 'download' // Download the entry
  | 'retry' // Retry the entry (if it is in an error state)
  | 'restore' // Restore the entry (if it is deleted)
  | 'queue' // Queue the entry (if it is idle)
  | 'open' // Open the entry detail view (if it is complete)
  | 'close' // Close the entry in the editor
  | 'play' // Play the entry original audio
  | 'stop'; // Stop the entry original audio

const buttonConstructor = (buttonType: buttonTypes, buttonId: string) => {
  const dispatch = useAppDispatch();

  const buttonStrings = strings.util.buttons;

  const buttons: {
    // TODO: None of these buttons do anything as I need to build out the redux actions and decide on a naming convention
    [key in buttonTypes]: {
      dispatchAction: string;
      label: string;
      color: MantineColor;
      style: ButtonVariant;
    };
  } = {
    edit: {
      dispatchAction: '', // TODO: Add an action for this
      label: buttonStrings?.edit || 'Edit',
      color: 'red',
      style: 'default'
    },
    delete: {
      dispatchAction: '', // TODO: Add an action for this in the style reduxstore/dispatchAction
      label: buttonStrings?.delete || 'Delete',
      color: 'red',
      style: 'default'
    },
    cancel: {
      dispatchAction: '', // TODO: Add an action for this in the style reduxstore/dispatchAction
      label: buttonStrings?.cancel || 'Cancel',
      color: 'red',
      style: 'default'
    },
    pause: {
      dispatchAction: '', // TODO: Add an action for this in the style reduxstore/dispatchAction
      label: buttonStrings?.pause || 'Pause',
      color: 'red',
      style: 'default'
    },
    resume: {
      dispatchAction: '', // TODO: Add an action for this in the style reduxstore/dispatchAction
      label: buttonStrings?.resume || 'Resume',
      color: 'red',
      style: 'default'
    },
    download: {
      dispatchAction: '', // TODO: Add an action for this in the style reduxstore/dispatchAction
      label: buttonStrings?.download || 'Download',
      color: 'red',
      style: 'default'
    },
    retry: {
      dispatchAction: '', // TODO: Add an action for this in the style reduxstore/dispatchAction
      label: buttonStrings?.retry || 'Retry',
      color: 'red',
      style: 'default'
    },
    restore: {
      dispatchAction: '', // TODO: Add an action for this in the style reduxstore/dispatchAction
      label: buttonStrings?.restore || 'Restore',
      color: 'red',
      style: 'default'
    },
    queue: {
      dispatchAction: '', // TODO: Add an action for this in the style reduxstore/dispatchAction
      label: buttonStrings?.queue || 'Queue',
      color: 'red',
      style: 'default'
    },
    open: {
      dispatchAction: '', // TODO: Add an action for this in the style reduxstore/dispatchAction
      label: buttonStrings?.open || 'Open',
      color: 'red',
      style: 'default'
    },
    close: {
      dispatchAction: '', // TODO: Add an action for this in the style reduxstore/dispatchAction
      label: buttonStrings?.close || 'Close',
      color: 'red',
      style: 'default'
    },
    play: {
      dispatchAction: '', // TODO: Add an action for this in the style reduxstore/dispatchAction
      label: buttonStrings?.play || 'Play',
      color: 'red',
      style: 'default'
    },
    stop: {
      dispatchAction: '', // TODO: Add an action for this in the style reduxstore/dispatchAction
      label: buttonStrings?.stop || 'Stop',
      color: 'red',
      style: 'default'
    }
  };

  return (
    <Button
      key={buttonType}
      onClick={() => {
        if (buttons[buttonType].dispatchAction) {
          dispatch({ type: buttons[buttonType].dispatchAction, payload: { id: buttonId } });
        } else {
          console.log('No dispatch action for this button: ', buttonType);
        }
      }}
      size="sm"
      color={buttons[buttonType].color}
      variant={buttons[buttonType].style}
      // disabled // TODO: Add logic to these buttons, then remove this
    >
      {buttons[buttonType].label}
    </Button>
  );
};

const buttonBlock = (active_transcript: entry['transcriptions'][0]) => {
  // Create a group of buttons to display based on the current state of the entry
  const buttonList: buttonTypes[] = [];

  switch (active_transcript.status) {
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
    <Group position={'left'}>
      {buttonList.map((buttonType) => buttonConstructor(buttonType, active_transcript.uuid))}
    </Group>
  );
};

// #endregion

function TranscriptionCard({ entry }: { entry: entry }) {
  // Local state for the entry card - used to show/hide the file/entry details
  const [expanded, setExpanded] = useState<string[]>([]);
  const dispatch = useAppDispatch();
  const activeTranscription = entry.transcriptions.find(
    (transcription) => transcription.uuid === entry.config.activeTranscription // TODO: Implement a way to view all transcriptions not just active
  );

  const CardWithTranscription = (
    <Card withBorder>
      <Group>
        <Title order={2} lineClamp={2}>
          {entry.config.name}
        </Title>
      </Group>

      <Title italic order={6} lineClamp={1}>
        {entry.config.description}
      </Title>
      <Divider mt="xs" mb="xs" />

      <Grid align={'flex-start'}>
        <Grid.Col md={6} sm={12}>
          {/* Column containing information about the entry */}
          <Stack spacing="xs" justify={'space-between'} style={{ minHeight: '900' }}>
            <Accordion multiple variant="contained" value={expanded} onChange={setExpanded}>
              {/* StageWhisper information */}
              <Accordion.Item value="entry">
                <Accordion.Control>
                  <Title order={3}>{strings.entries?.card.transcription_section_title}</Title>
                </Accordion.Control>
                <Accordion.Panel>
                  {/* Transcription Completed Date  */}
                  <Text weight={700}>
                    {strings.entries?.card.completed_on}:{' '}
                    {activeTranscription?.status === 'complete' ? (
                      <Text weight={500} span>
                        {activeTranscription.completedOn}
                      </Text>
                    ) : (
                      <Text weight={500} span transform="capitalize">
                        {strings.entries?.card.never_completed}
                      </Text>
                    )}
                  </Text>
                  {/* Transcription Model Used  */}
                  <Text weight={700}>
                    {strings.entries?.card.model_used}:{' '}
                    <Text weight={500} transform="capitalize" span>
                      {activeTranscription?.model}
                    </Text>
                  </Text>
                  {/* Transcription File Length */}
                  <Text weight={700}>
                    Model:{' '}
                    <Text weight={500} transform="capitalize" span>
                      {/* {activeTranscription.} */}
                      Disabled
                    </Text>
                  </Text>
                  {/* Transcription File Location  */}
                  <Text weight={700}>
                    {strings.entries?.card.output_directory}:{' '}
                    <Text weight={500} transform="capitalize" italic span>
                      Disabled
                    </Text>
                  </Text>
                </Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item value="audio">
                {/* Audio File Information */}
                <Accordion.Control>
                  <Title order={3}>{strings.entries?.card.audio_section_title}</Title>
                </Accordion.Control>
                <Accordion.Panel>
                  {/* Audio File Name  */}
                  <Text weight={700}>
                    {strings.entries?.card.file_name}:{' '}
                    <Text weight={500} transform="capitalize" span>
                      {entry.audio.name}
                    </Text>
                  </Text>
                  {/* Audio File Type  */}
                  <Text weight={700}>
                    {strings.entries?.card.file_type}:{' '}
                    <Text weight={500} transform="capitalize" span>
                      {entry.audio.type}
                    </Text>
                  </Text>
                  {/* Audio File Size  */}
                  <Text weight={700}>
                    {strings.entries?.card.file_length}:{' '}
                    <Text weight={500} transform="capitalize" span>
                      {entry.audio.fileLength
                        ? entry.audio.fileLength < 60
                          ? `${entry.audio.fileLength} ${strings.util.time?.seconds}`
                          : `${Math.floor(entry.audio.fileLength / 60)} ${strings.util.time?.minutes} ${
                              entry.audio.fileLength % 60
                            } ${strings.util.time?.seconds}`
                        : strings.util.status?.unknown}
                    </Text>
                  </Text>
                  {/* Audio File Language  */}
                  <Text weight={700}>
                    {strings.entries?.card.file_language}:{' '}
                    <Text weight={500} transform="capitalize" span>
                      {strings.getString(`languages.${entry.audio.language}`) || entry.audio.language}
                    </Text>
                  </Text>
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
          </Stack>
        </Grid.Col>
        <Grid.Col md={6} sm={12}>
          {/* Column containing a preview of the entry */}
          <Text italic color={'dimmed'} lineClamp={15}>
            {activeTranscription?.vtt}
            {/* TODO: Add a file preview generated from VTT */}
          </Text>
        </Grid.Col>
      </Grid>
      <Divider mt="xs" mb="xs" />

      {activeTranscription && buttonBlock(activeTranscription)}
      {activeTranscription && progressIndicator(activeTranscription)}

      <Text weight={700}>{strings.entries?.card.no_transcription}</Text>

      <Divider mt="xs" mb="xs" />
    </Card>
  );

  const CardWithoutTranscription = (
    <Card withBorder>
      <Group>
        <Title order={2} lineClamp={2}>
          {entry.config.name}
        </Title>
      </Group>

      <Title italic order={6} lineClamp={1}>
        {entry.config.description}
      </Title>
      <Divider mt="xs" mb="xs" />
      <Group>
        <Button
          variant="default"
          onClick={() => {
            dispatch(passToWhisper({ entry })); // TODO: Replace with add to queue
            //TODO: Add a way to select a model to use / other options
          }}
        >
          {strings.entries?.buttons.add_to_queue}
        </Button>

        {buttonConstructor('delete', entry.config.uuid)}
      </Group>
    </Card>
  );

  if (entry.transcriptions.length > 0) {
    return CardWithTranscription;
  } else {
    return CardWithoutTranscription;
  }
}
export default TranscriptionCard;
