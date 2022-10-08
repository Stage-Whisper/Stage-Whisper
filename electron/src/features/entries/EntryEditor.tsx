import React, { useEffect } from 'react';

// Components
import {
  Affix,
  Button,
  Card,
  Center,
  Group,
  Loader,
  Progress,
  Stack,
  Table,
  Text,
  Textarea,
  TextInput,
  Title
} from '@mantine/core';
// import { RichTextEditor } from '@mantine/rte';

// Types
import { Node } from 'subtitle';

// Redux

// Packages
import { IconArrowNarrowDown, IconPlayerPause, IconPlayerPlay } from '@tabler/icons';
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

// This is a component that will be used to display the transcription editor when an entry is selected
function EntryEditor() {
  //#region State
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

  //Get audioPadding from redux
  const audioPadding = useAppSelector(selectAudioPadding);

  const transcribingStatus = useAppSelector(selectTranscribingStatus);
  //#endregion

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

  const transcriptionTable = (formatted: formattedVTTLine[]) => {
    if (audioPlayer) {
      const rows = formatted.map((line) => (
        <tr key={line.key}>
          <td>
            <Button
              onClick={() => {
                //Play audio from 1 second
                setCurrentLine(line);
                //The amount of padding to add to the start and end of the line
                const playBackPadding = audioPadding as number;
                //The start time of the line after accounting for padding
                const computedLineStart = Math.max(line.start / 1000 - playBackPadding, 0);
                //The end time of the line after accounting for padding
                const computedLineEnd = Math.min(line.end / 1000 + playBackPadding, audioPlayer.duration());
                console.log('Computed Line Start: ', computedLineStart);
                console.log('Computed Line End: ', computedLineEnd);
                //Cancel timeouts
                timeOutList.forEach((timeout) => {
                  clearTimeout(timeout);
                });
                //Cancel intervals
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
              }}
            >
              <IconPlayerPlay />
            </Button>
          </td>
          <td>
            <Textarea
              value={line.text}
              onChange={(e) => {
                console.log('Text Changed');
                console.log(`Old: ${line.text}, New: ${e.target.value}`);
              }}
            />
          </td>
          <td>
            {/* {line.start} */}
            <Stack align="center" spacing="xs">
              <Text>
                {String(Math.floor(line.start / 1000 / 60)).padStart(2, '0')}:
                {String(Math.floor(line.start / 1000) % 60).padStart(2, '0')}
              </Text>
              <IconArrowNarrowDown />
              <Text>
                {String(Math.floor(line.end / 1000 / 60)).padStart(2, '0')}:
                {String(Math.floor(line.end / 1000) % 60).padStart(2, '0')}
              </Text>
            </Stack>
          </td>
        </tr>
      ));

      return (
        <Table>
          <thead>
            <tr>
              {/* TODO: use localized strings */}
              <th>Preview</th>
              <th
                style={{
                  width: '100%'
                }}
              >
                Text
              </th>
              <th>Time</th>
              {/* <th>Duration</th> */}
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      );
    } else {
      return <Text>Audio Player Not Ready</Text>;
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
        {transcriptionTable(formattedVTTLines)}
        {audioControls}
      </>
    );
  }
}

export default EntryEditor;
