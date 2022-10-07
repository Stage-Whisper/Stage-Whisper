import React, { useEffect } from 'react';

// Components
import { Button, Card, Center, Code, Divider, Group, Loader, Progress, Stack, Text, Title } from '@mantine/core';
// import { RichTextEditor } from '@mantine/rte';

// Types
import { Node } from 'subtitle';
import { entry } from '../../../electron/types/types';

// Redux
// import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
// import { selectTranscribingStatus } from '../../whisper/whisperSlice';
// import { selectActiveEntry, selectEntries } from '../entrySlice';

// Packages
import { Howl } from 'howler';
import { v4 as uuidv4 } from 'uuid';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { selectEntries } from './entrySlice';
import { IconPlayerPause, IconPlayerPlay } from '@tabler/icons';
import { passToWhisper, selectTranscribingStatus } from '../whisper/whisperSlice';
import strings from '../../localization';

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
  console.log('AudioControls: Constructing New Audio Controls');
  //Get currentplaying state from redux
  //
  // Audio Player\

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
      <Card style={{ position: 'absolute', right: '20px', bottom: '70px', zIndex: 99999 }} shadow="md" p="lg">
        {/* <Text>{currentLine?.text}</Text> */}
        <Group spacing="md">
          {/* Button Section */}
          {/* Check if the audio is playing in which case render. Make sure to rerender the app every time the audio finishes*/}

          <Button
            onClick={() => {
              console.log('Play');
              // console.log('Current Line: ', currentLine);
              console.log('State about to trigger: ', audioPlayer.state());
              // console.log(audioPlayer.play());
              console.log('About to trigger', audioPlayer);
              if (currentPlaying) {
                audioPlayer.unload();
                audioPlayer.play();
              } else {
                audioPlayer.play();
              }
            }}
          >
            <IconPlayerPlay></IconPlayerPlay>
          </Button>
          <Button
            onClick={() => {
              audioPlayer.pause();
            }}
          >
            <IconPlayerPause></IconPlayerPause>
          </Button>
          <Button onClick={() => console.log(audioPlayer)}>Log Audio Player</Button>
        </Group>
      </Card>
    </>
  );
}

// This is a component that will be used to display the transcription editor when an entry is selected
function EntryEditor() {
  // Get the active entry id
  const dispatch = useAppDispatch();

  const transcribing = useAppSelector(selectTranscribingStatus);
  const { entryId } = useParams<{ entryId: string }>();

  // Get all entries
  const entries = useAppSelector(selectEntries);

  // Get the active entry
  const entry = entries.find((entry) => entry.config.uuid === entryId);

  // Empty state to store the formatted VTT lines
  const [formattedVTTLines, setFormattedVTTLines] = React.useState<Array<formattedVTTLine>>([]);

  // Empty state to store the current line
  const [currentLine, setCurrentLine] = React.useState<formattedVTTLine | null>(null);

  // Whether the page is ready to be displayed
  const [ready, setReady] = React.useState<boolean>(false);

  // The limits of the current line (in milliseconds)
  const [lineLimits, setLineLimits] = React.useState<[number, number]>([0, 0]);

  // Set up the audio player state
  const [audioPlayer, setAudioPlayer] = React.useState<Howl | null>(null);
  // const [audioPlayerArray, setAudioPlayerArray] = React.useState<Array<Howl>>([]);

  // Audio Controls
  const [audioControls, setAudioControls] = React.useState<JSX.Element | null>(null);
  //Timeout
  const [timeOutList, setTimeOutList] = React.useState<Array<NodeJS.Timeout>>([]);
  //Progress bar
  const [lineAudioProgress, setLineAudioProgress] = React.useState<number>(0);
  //Intervals
  const [intervalNode, setIntervalNode] = React.useState<NodeJS.Timeout | null>(null);
  //Create a boolean
  const [toBeCleared, setToBeCleared] = React.useState<boolean>(false);

  let content = (
    <Center>
      <Loader />
    </Center>
  );

  // Audio Control Use Effect
  // Update the audio controls when the audio player changes

  useEffect(() => {
    // If the audio player is not null
    if (audioPlayer) {
      console.log('AudioControls: Audio Player Changed');
      // Construct the audio controls
      setAudioControls(AudioControls(audioPlayer));
      setReady(true);
    }
  }, [audioPlayer]);

  useEffect(() => {
    console.log(' ---- Page Refresh ---- ');

    // Reset all the states when the entry changes
    setFormattedVTTLines([]);
    setCurrentLine(null);
    setReady(false);
    setLineLimits([0, 0]);
    audioPlayer?.unload();
    audioPlayer?.off();
    setAudioPlayer(null);
    setToBeCleared(true);
    if (intervalNode) {
      clearInterval(intervalNode);
    }
    setIntervalNode(null);
    setTimeOutList([]);
    setLineAudioProgress(0);
    console.log(' ---- Reset State ---- ');

    // const loadPage = async () => {
    // If the entry has a transcription
    if (entry && entry.transcriptions[0] && entry.transcriptions[0].vtt) {
      const vttNodes = entry.transcriptions[0].vtt;
      console.log('Got VTT Nodes: ', vttNodes);

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
      console.log('Setting Formatted Lines: ', formattedLines);
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
        newAudioPlayer.once('loaderror', (id, error) => {
          console.log('Audio Player Load Error');
          // reject(error);
        });
        // });
      });
    } else {
      console.log('No Transcription Found');
    }
    // };

    // loadPage();
  }, [entry]);

  // If the page is ready
  if (ready) {
    // If the entry has a transcription
    if (entry && entry.transcriptions[0] && entry.transcriptions[0].vtt) {
      // If the audio player is ready
      if (audioPlayer) {
        // Generate Quick Transcription Preview for all lines
        const tempDisplay = formattedVTTLines.map((line) => {
          return (
            <Card withBorder key={line.key} my="sm">
              <Stack spacing="md">
                <Card withBorder>
                  <Text italic align="center" size="lg" weight={700} style={{ fontFamily: 'Greycliff CF, sans-serif' }}>
                    {line.text}
                  </Text>
                </Card>
                <Card withBorder>
                  <Group position="apart">
                    <Text>
                      {/* {line.start / 1000}s - {line.end / 1000}s */}
                      {/* Line showing time in seconds formatted to mins */}
                      {String(Math.floor(line.start / 1000 / 60)).padStart(2, '0')}:
                      {String(Math.floor(line.start / 1000) % 60).padStart(2, '0')}
                    </Text>

                    <Button
                      onClick={() => {
                        //Play audio from 1 second
                        setCurrentLine(line);
                        // setToBeCleared(false);
                        //Cancel timeouts
                        timeOutList.forEach((timeout) => {
                          clearTimeout(timeout);
                        });
                        //Cancel intervals
                        if (intervalNode) {
                          if (intervalNode) {
                            clearInterval(intervalNode);
                          }
                        }
                        setLineAudioProgress(0);
                        audioPlayer.unload();
                        audioPlayer.play();
                        audioPlayer.seek(line.start / 1000);
                        //stop audio after 5 seconds\\
                        const timeout = setTimeout(() => {
                          audioPlayer.stop();
                          setCurrentLine(null);
                        }, line.duration);
                        setTimeOutList([...timeOutList, timeout]);

                        //Every time 5% of the line is played update the progress bar setLineAudioProgressx
                        const interval = setInterval(() => {
                          const currentTime = audioPlayer.seek(); //in seconds
                          const progress = (100 * (currentTime - line.start / 1000)) / (line.duration / 1000);
                          setLineAudioProgress(progress);
                        }, line.duration / 200);
                        setIntervalNode(interval);
                      }}
                      // disabled
                    >
                      Play Line
                    </Button>
                    <Text>
                      {' '}
                      {String(Math.floor(line.end / 1000 / 60)).padStart(2, '0')}:
                      {String(Math.floor(line.end / 1000) % 60).padStart(2, '0')}
                    </Text>
                  </Group>
                </Card>
                <Progress value={currentLine == line ? lineAudioProgress : 0}></Progress>
              </Stack>
            </Card>
          );
        });

        content = (
          <>
            <Text italic align="center">
              Known Bug: If you refresh this page the audio element loses track of files and refuses to play. To get it
              to work use CMD-R or F5 to refresh this page in the meantime
            </Text>
            {audioControls}

            <Title mt={'md'} align="center">
              {entry.config.name}
            </Title>
            {tempDisplay}
          </>
        );
      } else {
        content = (
          <Card shadow="md" p="lg">
            <Text>Audio Loading...</Text>
          </Card>
        );
      }
    } else {
      content = (
        <Card shadow="md" p="lg">
          <Text>No Transcription Found</Text>
        </Card>
      );
    }
  } else {
    if (!entry?.transcriptions[0]) {
      content = (
        <Center>
          <Stack>
            <Title order={3}>No Transcription Found</Title>
            <Button
              onClick={() => {
                //@ts-expect-error entry is always going to be defined here
                dispatch(passToWhisper({ entry }));
              }}
              color="violet"
              variant="outline"
              disabled={transcribing.status === 'loading'}
            >
              {strings.util.buttons?.transcribe}
            </Button>{' '}
          </Stack>
        </Center>
      );
    }
  }
  return content;
}

export default EntryEditor;
