import { ActionIcon, Box, Group, Text, Textarea } from '@mantine/core';
import { IconArrowBack, IconCheck, IconEdit, IconPlayerPlay, IconPlayerStop, IconTrash, IconX } from '@tabler/icons';
import { Howl } from 'howler';
import { Entry, Line } from 'knex/types/tables';
import { DataTable } from 'mantine-datatable';
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { selectAudioPadding } from '../../settings/settingsSlice';
import { fetchLineAsync, selectActiveLines } from '../entrySlice';

function EntryTable({ audioPlayer, entry }: { audioPlayer: Howl; entry: Entry }) {
  // Data Table States
  // const [pageSize, setPageSize] = useState(20);
  const pageSize = 10;
  const [page, setPage] = useState(1);
  const [records, setRecords] = useState<Line[]>([]);

  // Audio
  const [currentLine, setCurrentLine] = useState<Line | null>(null);
  const [timeOutList, setTimeOutList] = useState<Array<NodeJS.Timeout>>([]);
  // const [lineAudioProgress, setLineAudioProgress] = useState<number>(0);
  const [intervalNode, setIntervalNode] = useState<NodeJS.Timeout | null>(null);
  const audioPadding = useAppSelector(selectAudioPadding);

  // Editing
  const [editingLine, setEditingLine] = useState<Line | null>(null);
  const [editText, setEditText] = useState('');

  // Fetch Lines from redux store
  const dispatch = useAppDispatch();
  const lines = useAppSelector(selectActiveLines);

  const [ready, setReady] = useState(false);

  // Generate a data table using Mantine-DataTable
  useEffect(() => {
    setReady(false);
    setReady(true);
  }, [lines]);

  useEffect(() => {
    // Reset page when entries change
    setPage(1);
  }, [entry]);

  useEffect(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    setRecords(lines.slice(from, to));
  }, [page, lines, pageSize]);

  const tableGen = () => {
    return (
      <Box>
        <DataTable
          withBorder
          withColumnBorders
          striped
          totalRecords={lines.length}
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
                      if (lines) {
                        if (!line) return; // If the line is not null
                        if (!audioPlayer) return; // If the Audio Player is not null
                        // If current line is playing then stop it
                        if (currentLine === line) {
                          audioPlayer.stop();
                          setCurrentLine(null);
                          return;
                        }
                        setCurrentLine(line); // Set the current line
                        const playBackPadding = audioPadding as number; // The amount of padding to add to the start and end of the line
                        const computedLineStart = Math.max(line.start / 1000 - playBackPadding, 0); // The start time of the line after accounting for padding
                        const computedLineEnd = Math.min(line.end / 1000 + playBackPadding, audioPlayer.duration()); // The end time of the line after accounting for padding

                        // Logging for debugging
                        console.log('Computed Line Start: ', computedLineStart);
                        console.log('Computed Line End: ', computedLineEnd);

                        // Cancel timeouts for the current line
                        timeOutList.forEach((timeout) => clearTimeout(timeout));

                        // Cancel intervals
                        if (intervalNode) clearInterval(intervalNode);

                        // setLineAudioProgress(0);
                        audioPlayer.unload();
                        audioPlayer.play();
                        audioPlayer.seek(computedLineStart);

                        //Every time 5% of the line is played update the progress bar setLineAudioProgress
                        const interval = setInterval(() => {
                          // const currentTime = audioPlayer.seek(); //in seconds
                          // const progress = (currentTime - computedLineStart) / (computedLineEnd - computedLineStart);
                          // setLineAudioProgress(progress * 100);
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
                  return <Text>{line.text}</Text>;
                }
              }
            },
            // Time range column
            {
              accessor: 'start',
              title: 'Start',
              width: 80,
              render: ({ start }) => {
                return (
                  <Text align="center">
                    {String(Math.floor(start / 1000 / 60)).padStart(2, '0')}:
                    {String(Math.floor(start / 1000) % 60).padStart(2, '0')}
                  </Text>
                );
              }
            },
            {
              accessor: 'start',
              title: 'End',
              width: 80,
              render: ({ end }) => {
                return (
                  <Text align="center">
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
                            if (editText) {
                              window.Main.UPDATE_LINE({
                                line: {
                                  ...line,
                                  text: editText
                                }
                              }).then(() => {
                                dispatch(fetchLineAsync({ line }));
                                setEditingLine(null);
                                setEditText('');
                              });
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
                        {line.version > 0 ? (
                          // Reset edits
                          <ActionIcon
                            color="red"
                            onClick={() => {
                              setEditingLine(null);
                              setEditText('');
                              console.log('resetting edits...');
                              window.Main.RESTORE_LINE({ line }).then(() => {
                                dispatch(fetchLineAsync({ line }));
                              });
                            }}
                          >
                            <IconArrowBack size={16} />
                          </ActionIcon>
                        ) : (
                          <>
                            <ActionIcon
                              color="blue"
                              onClick={() => {
                                // Edit this line
                                setEditText(line.text);
                                setEditingLine(line);
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
                      </>
                    )}
                  </Group>
                );
              }
            }
          ]}
          idAccessor="uuid"
        />
      </Box>
    );
  };

  if (ready) {
    return <>{tableGen()}</>;
  } else {
    return <Text>Not Ready...</Text>;
  }
}

export default EntryTable;
