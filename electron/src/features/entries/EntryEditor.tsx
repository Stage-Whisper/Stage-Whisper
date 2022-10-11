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
  Textarea,
  TextInput,
  Title
} from '@mantine/core';

// import { RichTextEditor } from '@mantine/rte';
import { DataTable } from 'mantine-datatable';
// Types

// Packages
import { IconCheck, IconEdit, IconPlayerPause, IconPlayerPlay, IconPlayerStop, IconTrash, IconX } from '@tabler/icons';

import { Howl } from 'howler';
import { useParams } from 'react-router-dom';
import strings from '../../localization';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { selectAudioPadding } from '../settings/settingsSlice';
import { passToWhisper, selectTranscribingStatus } from '../whisper/whisperSlice';
import { getLocalFiles, selectEntries } from './entrySlice';
import { entry, entryTranscription, transcriptionLine } from '../../../electron/types/types';

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

  // Set the active transcription
  const [activeTranscription, setActiveTranscription] = useState<entryTranscription | undefined>(
    entry?.transcriptions[0]
  );

  // Transcription Text States
  // Empty state to store the formatted VTT lines
  const [formattedLines, setFormattedLines] = useState<Array<transcriptionLine>>([]);
  // Empty state to store the current line

  const [currentLine, setCurrentLine] = useState<transcriptionLine | null>(null);

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
  const [records, setRecords] = useState<transcriptionLine[] | null>(null);

  // Editing States
  const [editingLine, setEditingLine] = useState<transcriptionLine | null>(null);
  const [editText, setEditText] = useState<string>('');
  const [editStart, setEditStart] = useState<number>(0);
  const [editEnd, setEditEnd] = useState<number>(0);
  const [editPending, setEditPending] = useState<boolean>(false); // Whether the submitEdit handler is waiting for a response from the main process

  const submitEdit = async (entry: entry, transcription: entryTranscription, line: transcriptionLine) => {
    if (editingLine) {
      // Set the loading state
      setEditPending(true);
      // Get the index of the line
      window.Main.editTranscription({ entry, transcription, line })
        .then(() => {
          // If the promise resolved then the edit has been applied
          // Update the redux store
          dispatch(getLocalFiles()); // HACK: this is loading the entire store again, which is not ideal
          // Clear the edit state
          setEditingLine(null);
          setEditPending(false);
        })

        .catch((error) => {
          // If the promise rejected then the edit failed
          console.warn(error);
          // Clear the edit state
          setEditingLine(null);
          setEditPending(false);
        });
    }
  };

  useEffect(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    setRecords(formattedLines.slice(from, to));
  }, [page, formattedLines, pageSize]);

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
    setFormattedLines([]);
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
    if (entry && entry.transcriptions[0] && entry.transcriptions[0].data) {
      // Get the transcription data
      const transcriptionData = entry.transcriptions[0].data;
      // log the number of nodes
      console.debug(`EntryEditor: ${transcriptionData.length} Nodes Found`);

      // Generate the formatted lines
      const formattedLines: transcriptionLine[] = transcriptionData.map((line: transcriptionLine) => {
        return {
          id: line.id,
          start: line.edit?.start || line.start,
          end: line.edit?.end || line.end,
          text: line.edit?.text || line.text,
          index: line.index,
          edit: line.edit
        };
      });

      // Set the formatted lines
      setFormattedLines(formattedLines);
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
      // Check what is missing
      if (!entry) console.warn('EntryEditor: Entry is null');
      if (entry && !entry?.transcriptions[0]) console.warn('EntryEditor: Transcription is null');
      if (entry && !entry?.transcriptions[0] && !entry?.transcriptions[0]?.data)
        console.warn('EntryEditor: Transcription Data is null');
    }
  }, [entry]);

  // #region Data Table

  //  Documentation -- remove before prod
  //  https://icflorescu.github.io/mantine-datatable
  const dataTable = (formatted: transcriptionLine[]) => {
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
            records={records} // {}type formattedVTTLine = {key: string;start: number;end: number;duration: number;text: string;};
            columns={[
              // Play button column
              {
                title: 'Play',
                accessor: 'id',
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
              // Text column
              {
                accessor: 'text',
                title: 'Text',
                render: (line) => {
                  if (line === editingLine) {
                    return <Textarea value={editText || ''} onChange={(e) => setEditText(e.target.value)} />;
                  } else {
                    return line.edit?.text || line.text;
                  }
                }
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
              // Action Buttons Column
              {
                accessor: 'actions',
                title: 'Actions',
                textAlignment: 'center',
                width: 80,

                render: (line) => {
                  return (
                    <Group spacing={4} position="right" noWrap>
                      {editingLine === line ? (
                        <>
                          <ActionIcon
                            color="green"
                            onClick={() => {
                              console.log('save edits');
                              if (entry && activeTranscription) {
                                const newline = {
                                  ...line,
                                  edit: {
                                    text: editText
                                  }
                                };
                                console.log('newline', newline);
                                submitEdit(entry, activeTranscription, newline);
                              }
                            }}
                          >
                            <IconCheck size={16} />
                          </ActionIcon>

                          <ActionIcon
                            color="red"
                            onClick={() => {
                              // Cancel editing
                              setEditingLine(null);
                              setEditText('');
                            }}
                          >
                            <IconX size={16} />
                          </ActionIcon>
                        </>
                      ) : (
                        <>
                          <ActionIcon
                            color="blue"
                            onClick={() => {
                              // Set current line

                              // Check if line has an edit
                              if (line.edit) {
                                setEditText(line.edit.text || line.text);
                                setEditingLine(line);
                              } else {
                                setEditText(line.text);
                                setEditingLine(line);
                              }
                            }}
                          >
                            <IconEdit size={16} />
                          </ActionIcon>
                          <ActionIcon color="red" onClick={() => console.log('delete')} disabled>
                            {/* HACK: Delete is disabled until a way to sync changes is complete */}
                            <IconTrash size={16} />
                          </ActionIcon>
                        </>
                      )}
                    </Group>
                  );
                }
              }
            ]}
            idAccessor="id"
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
  if (entry && entry.transcriptions[0] && entry.transcriptions[0].data) {
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

          {formattedLines[formattedLines.length - 1].end && (
            <Text align="center" color="gray">
              {`Length of Audio: `}
              <Text span>
                {String(Math.floor(formattedLines[formattedLines.length - 1].end / 1000 / 60)).padStart(2, '0')}:
                {String(Math.floor(formattedLines[formattedLines.length - 1].end / 1000) % 60).padStart(2, '0')}
              </Text>
            </Text>
          )}
        </Group>
        {records && dataTable(formattedLines)}

        {/* {false && transcriptionTable(formattedVTTLines)} */}
        {audioControls}
      </>
    );
  }

  return <Text>Entry Not Found</Text>;
}

export default EntryEditor;
