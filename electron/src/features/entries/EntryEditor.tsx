import React, { useEffect, useState } from 'react';

// Components

import {
  ActionIcon,
  Affix,
  Box,
  Button,
  Card,
  Group,
  Loader,
  Modal,
  NumberInput,
  Stack,
  Text,
  Title
} from '@mantine/core';

// import { RichTextEditor } from '@mantine/rte';
import { DataTable } from 'mantine-datatable';
// Types
import { Node } from 'subtitle';

// Packages
import { IconEdit, IconPlayerPause, IconPlayerPlay, IconPlayerStop, IconTrash } from '@tabler/icons';

import { Howl } from 'howler';
import { useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import strings from '../../localization';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { selectAudioPadding } from '../settings/settingsSlice';
import { passToWhisper, selectTranscribingStatus } from '../whisper/whisperSlice';
import { selectEntries } from './entrySlice';

// Convert an internal audio path to a url that can be used by howler
const filePathToURL = async (filePath: string): Promise<string> => {
  console.time('AudioPlayer: Fetch Audio');
  const result = await window.Main.fetchAudioFile(filePath);
  console.timeEnd('AudioPlayer: Fetch Audio');

  // Check if the fetch was successful
  if (!result) {
    console.log('No Audio File Found');
    throw new Error('No Audio File Found');
  } else {
    // Convert the Uint8Array to a Blob
    const blob = new Blob([result], { type: 'audio/mp3' });
    // Return the blob
    return URL.createObjectURL(blob);
  }
};

type formattedVTTLine = {
  key: string;
  start: number;
  end: number;
  duration: number;
  text: string;
};

// Construct Audio Player -- Required as will need to refresh with new audio player
function AudioControls(audioPlayer: Howl) {
  let currentPlaying = false;
  audioPlayer.on('play', () => {
    currentPlaying = true;
  });
  audioPlayer.on('pause', () => {
    currentPlaying = false;
  });
  audioPlayer.on('end', () => {
    currentPlaying = false;
  });
  return (
    <>
      {/* Create a button floating on the bottom right  */}

      <Affix position={{ bottom: 20, right: 20 }}>
        <Card shadow="md" p="lg">
          <Group spacing="md">
            <Button
              onClick={() => {
                console.debug('Play');
                if (currentPlaying) {
                  audioPlayer.unload();
                  audioPlayer.play();
                } else {
                  audioPlayer.play();
                }
              }}
            >
              <IconPlayerPlay />
            </Button>
            <Button
              onClick={() => {
                audioPlayer.pause();
              }}
            >
              <IconPlayerPause />
            </Button>
          </Group>
        </Card>
      </Affix>
    </>
  );
}

// Line Handlers
// const handleEditLine = (line: formattedVTTLine) => {
//   console.log('Edit Line');
// };

// const handleDeleteLine = (line: Node) => {
//   console.log('Delete Line');
//   console.log(line);
// };

// const handleAdjustTimestamp = (line: Node, newStart: number, newEnd: number) => {
//   console.log('Adjust Timestamp');
// };

// This is a component that will be used to display the transcription editor when an entry is selected
function EntryEditor() {
  // Redux
  const dispatch = useAppDispatch();
  const transcribing = useAppSelector(selectTranscribingStatus);
  const entries = useAppSelector(selectEntries);
  const transcribingStatus = useAppSelector(selectTranscribingStatus);

  // Params
  const { entryId } = useParams<{ entryId: string }>();

  // Get the active entry
  const entry = entries.find((entry) => entry.config.uuid === entryId);

  // Transcription Text States
  // Empty state to store the formatted VTT lines
  const [formattedVTTLines, setFormattedVTTLines] = useState<Array<formattedVTTLine>>([]);
  // Empty state to store the current line

  const [currentLine, setCurrentLine] = useState<formattedVTTLine | null>(null);

  // Set up the audio player state
  const [audioPlayer, setAudioPlayer] = useState<Howl | null>(null);
  // Audio Controls
  const [audioControls, setAudioControls] = useState<JSX.Element | null>(null);
  //Timeout
  const [timeOutList, setTimeOutList] = useState<Array<NodeJS.Timeout>>([]);
  //Progress bar
  const [
    ,
    // lineAudioProgress
    setLineAudioProgress
  ] = useState<number>(0);
  //Intervals

  const [intervalNode, setIntervalNode] = useState<NodeJS.Timeout | null>(null);

  //Get audioPadding from redux
  const audioPadding = useAppSelector(selectAudioPadding);

  // Data Table States
  const [pageSize, setPageSize] = useState(20);
  const [page, setPage] = useState(1);
  const [records, setRecords] = useState<formattedVTTLine[] | null>(null);

  // Editing States
  // const [editing, setEditing] = useState<boolean>(false);
  const [editingLine, setEditingLine] = useState<formattedVTTLine | null>(null);
  // const [showModal, setShowModal] = useState<boolean>(false);
  // const [editingText, setEditingText] = useState<string>('');
  // const [unsavedChanges, setUnsavedChanges] = useState<boolean>(false);

  useEffect(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    setRecords(formattedVTTLines.slice(from, to));
  }, [page, formattedVTTLines, pageSize]);

  // Audio Control Use Effect
  // Update the audio controls when the audio player changes
  useEffect(() => {
    // If the audio player is not null
    if (audioPlayer) {
      console.debug('AudioControls: Audio Player Changed');
      // Construct the audio controls
      setAudioControls(AudioControls(audioPlayer));
    }
  }, [audioPlayer]);

  useEffect(() => {
    // Reset all the states when the entry changes
    setFormattedVTTLines([]);
    setCurrentLine(null);

    audioPlayer?.unload();
    audioPlayer?.off();
    setAudioPlayer(null);

    if (intervalNode) {
      clearInterval(intervalNode);
    }
    setIntervalNode(null);
    setTimeOutList([]);
    setLineAudioProgress(0);

    // If the entry has a transcription
    if (entry && entry.transcriptions[0] && entry.transcriptions[0].vtt) {
      const vttNodes = entry.transcriptions[0].vtt;
      // log the number of nodes
      console.debug(`EntryEditor: ${vttNodes.length} Nodes Found`);

      // Format the VTT lines
      const formattedLines = [] as Array<formattedVTTLine>;
      vttNodes.forEach((node: Node) => {
        if (node.type === 'cue') {
          const key = uuidv4();
          const start = node.data.start;
          const end = node.data.end;
          const duration = end - start;
          const text = node.data.text;
          formattedLines.push({ start, end, duration, text, key });
        }
      });

      // Set the formatted lines

      setFormattedVTTLines(formattedLines);
      console.log('Got Audio Path: ', entry.audio.path);
      const audioFilePath = entry.audio.path;
      // Convert the audio file path to a URL
      console.log('Converting Audio Path to URL');
      filePathToURL(audioFilePath).then((audioURL) => {
        // Create a new Howl object
        const newAudioPlayer = new Howl({
          src: [audioURL],
          html5: true,
          format: ['mp3'],
          preload: true
        });
        newAudioPlayer.on('load', () => {
          console.log('Audio Player Loaded');
          setAudioPlayer(newAudioPlayer);
        });
        newAudioPlayer.once('loaderror', (_id, error) => {
          console.log('Audio Player Load Error ', error);
        });
      });
    } else {
      console.log('No Transcription Found');
    }
  }, [entry]);

  // #region Data Table

  const editModal = () => {
    if (editingLine) {
      return (
        <Modal
          opened={editingLine !== null}
          onClose={() => {
            console.log('Close');
          }}
        >
          Test
        </Modal>
      );
    }
  };

  //  Documentation -- remove before prod
  //  https://icflorescu.github.io/mantine-datatable
  const dataTable = (formatted: formattedVTTLine[]) => {
    // Generate a data table using Mantine-Datatable
    if (records) {
      return (
        <Box>
          <DataTable
            withBorder
            withColumnBorders
            striped
            totalRecords={formatted.length}
            recordsPerPage={pageSize}
            page={page}
            onPageChange={(p) => setPage(p)}
            fetching={transcribingStatus.status === 'loading'}
            records={records} // {}type formattedVTTLine = {key: string;start: number;end: number;duration: number;text: string;};
            columns={[
              // Play button column
              {
                title: 'Play',
                accessor: 'key',
                width: 50,
                textAlignment: 'center',
                render: (line) => {
                  return (
                    <ActionIcon
                      onClick={() => {
                        if (formatted) {
                          // If the line is not null
                          if (!line) return;

                          // If the Audio Player is not null
                          if (!audioPlayer) return;

                          // If current line is playing then stop it
                          if (currentLine === line) {
                            audioPlayer.stop();
                            setCurrentLine(null);
                            return;
                          }

                          // Set the current line
                          setCurrentLine(line);

                          // The amount of padding to add to the start and end of the line
                          const playBackPadding = audioPadding as number;

                          // The start time of the line after accounting for padding
                          const computedLineStart = Math.max(line.start / 1000 - playBackPadding, 0);

                          // The end time of the line after accounting for padding
                          const computedLineEnd = Math.min(line.end / 1000 + playBackPadding, audioPlayer.duration());

                          // Logging for debugging
                          console.log('Computed Line Start: ', computedLineStart);
                          console.log('Computed Line End: ', computedLineEnd);

                          // Cancel timeouts for the current line
                          timeOutList.forEach((timeout) => {
                            clearTimeout(timeout);
                          });

                          // Cancel intervals
                          if (intervalNode) {
                            clearInterval(intervalNode);
                          }

                          setLineAudioProgress(0);
                          audioPlayer.unload();
                          audioPlayer.play();
                          audioPlayer.seek(computedLineStart);

                          //Every time 5% of the line is played update the progress bar setLineAudioProgress
                          const interval = setInterval(() => {
                            const currentTime = audioPlayer.seek(); //in seconds
                            const progress = (currentTime - computedLineStart) / (computedLineEnd - computedLineStart);
                            setLineAudioProgress(progress * 100);
                          }, 50);
                          setIntervalNode(interval);

                          //stop audio after it finishes
                          const timeout = setTimeout(() => {
                            audioPlayer.stop();
                            setCurrentLine(null);
                            clearInterval(interval);
                          }, (computedLineEnd - computedLineStart) * 1000);
                          setTimeOutList([...timeOutList, timeout]);
                        }
                      }}
                    >
                      {currentLine === line ? <IconPlayerStop /> : <IconPlayerPlay />}
                    </ActionIcon>
                  );
                }
              },
              // Title column
              {
                accessor: 'text',
                title: 'Text'
              },
              // Time range column
              {
                accessor: 'start',
                title: 'Time',
                width: 120,
                render: ({ start, end }) => {
                  return (
                    <Text align="center">
                      {String(Math.floor(start / 1000 / 60)).padStart(2, '0')}:
                      {String(Math.floor(start / 1000) % 60).padStart(2, '0')}-
                      {String(Math.floor(end / 1000 / 60)).padStart(2, '0')}:
                      {String(Math.floor(end / 1000) % 60).padStart(2, '0')}
                    </Text>
                  );
                }
              },
              // Duration Columns
              {
                accessor: 'duration',
                title: 'Length',
                textAlignment: 'center',
                width: 70,

                render: ({ duration }) => {
                  return (
                    <Text>
                      {/* {String(Math.floor(duration / 1000 / 60)).padStart(2, '0')}: */}
                      {String(Math.floor(duration / 1000) % 60)}s
                    </Text>
                  );
                }
              },
              // Action Column
              {
                accessor: 'actions',
                title: 'Actions',
                textAlignment: 'center',
                width: 80,

                render: (line) => {
                  return (
                    <Group spacing={4} position="right" noWrap>
                      <ActionIcon
                        color="blue"
                        onClick={() => {
                          setEditingLine(line);
                          editModal();
                        }}
                      >
                        <IconEdit size={16} />
                      </ActionIcon>
                      <ActionIcon color="red" onClick={() => console.log('delete')} disabled>
                        {/* HACK: Delete is disabled until a way to sync changes is complete */}
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Group>
                  );
                }
              }
            ]}
            idAccessor="key"
          />
        </Box>
      );
    }
  };

  // If an entry has not been passed in
  if (!entry) {
    return <Text>Entry Not Found</Text>;
  }

  // If the entry has been passed in, but its transcription is currently being run
  if (entry && transcribingStatus.entry?.config.uuid === entry.config.uuid && transcribingStatus.status === 'loading') {
    return (
      <Stack align={'center'} justify="center" style={{ height: '80%' }}>
        <Title order={3}>Transcribing</Title>
        <Loader variant="dots" />
      </Stack>
    );
  }

  // If an entry has been passed in but it does not have a transcription
  if (entry && !entry.transcriptions[0]) {
    return (
      <Stack align={'center'} justify="center" style={{ height: '80%' }}>
        <Title order={3}>No Transcription Found</Title>
        <Button
          onClick={() => {
            if (entry) {
              dispatch(passToWhisper({ entry }));
            } else {
              console.warn("No Entry Found, can't pass to whisper");
              // This should eventually be a modal
            }
          }}
          color="violet"
          variant="outline"
          disabled={transcribing.status === 'loading'}
        >
          {strings.util.buttons?.transcribe}
        </Button>
      </Stack>
    );
  }

  // If an entry has been passed in and it has a transcription but the audio player is not ready
  if (!audioPlayer) {
    return (
      <Stack align={'center'} justify="center" style={{ height: '80%' }}>
        <Title order={3}>Loading</Title>
        <Loader />
      </Stack>
    );
  }

  // If an entry has been passed in and it has a transcription and the audio player is ready
  if (entry && entry.transcriptions[0] && entry.transcriptions[0].vtt) {
    return (
      <>
        <Title mt={'md'} align="center">
          {entry.config.name}
        </Title>
        <Group position="apart">
          <NumberInput
            style={{
              minWidth: '200px',
              width: '20%'
            }}
            label="Lines Per Page"
            value={pageSize}
            onChange={(value) => {
              value && setPageSize(value);
            }}
            min={10}
            max={120}
            step={5}
            mb={'md'}
          />

          {formattedVTTLines[formattedVTTLines.length - 1].end && (
            <Text align="center" color="gray">
              {`Length of Audio: `}
              <Text span>
                {String(Math.floor(formattedVTTLines[formattedVTTLines.length - 1].end / 1000 / 60)).padStart(2, '0')}:
                {String(Math.floor(formattedVTTLines[formattedVTTLines.length - 1].end / 1000) % 60).padStart(2, '0')}
              </Text>
            </Text>
          )}
        </Group>
        {records && dataTable(formattedVTTLines)}

        {/* {false && transcriptionTable(formattedVTTLines)} */}
        {audioControls}
      </>
    );
  }
}

export default EntryEditor;
