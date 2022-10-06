import React, { useEffect } from 'react';

// Components
import { Button, Card, Loader, Stack, Text } from '@mantine/core';
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
import { useAppSelector } from '../../redux/hooks';
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
  start: number;
  end: number;
  duration: number;
  text: string;
};

// Construct Audio Player -- Required as will need to refresh with new audio player
function AudioControls(audioPlayer: Howl) {
  console.log('AudioControls: Constructing New Audio Controls');

  return (
    <Card shadow="md" p="lg">
      {/* <Text>{currentLine?.text}</Text> */}
      <Stack spacing="md">
        {/* Button Section */}
        <Button
          onClick={() => {
            console.log('Play');
            // console.log('Current Line: ', currentLine);
            console.log('State about to trigger: ', audioPlayer.state());
            // console.log(audioPlayer.play());
            console.log('About to trigger', audioPlayer);
            audioPlayer.play();
          }}
        >
          Play
        </Button>
        <Button onClick={() => console.log(audioPlayer)}>Log Audio Player</Button>

        <Button
          onClick={() => {
            audioPlayer.pause();
          }}
        >
          Pause
        </Button>
      </Stack>
    </Card>
  );
}

// This is a component that will be used to display the transcription editor when an entry is selected
function EntryEditor() {
  // Get the active entry id
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

  // Audio Controls
  const [audioControls, setAudioControls] = React.useState<JSX.Element | null>(null);

  let content = <Loader />;

  // Audio Control Use Effect
  // Update the audio controls when the audio player changes

  useEffect(() => {
    console.log('AudioControls: Audio Player Changed');
    // If the audio player is not null
    if (audioPlayer) {
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
    setAudioPlayer(null);
    console.log(' ---- Reset State ---- ');

    const loadPage = async () => {
      // If the entry has a transcription
      if (entry && entry.transcriptions[0] && entry.transcriptions[0].vtt) {
        const vttNodes = entry.transcriptions[0].vtt;
        console.log('Got VTT Nodes: ', vttNodes);

        // Format the VTT lines
        const formattedLines = [] as Array<formattedVTTLine>;
        vttNodes.forEach((node: Node) => {
          if (node.type === 'cue') {
            const start = node.data.start;
            const end = node.data.end;
            const duration = end - start;
            const text = node.data.text;
            formattedLines.push({ start, end, duration, text });
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
            preload: true,

            sprite: {
              // Create a sprite for each line
              ...formattedVTTLines.reduce((acc, line) => {
                const start = line.start;
                const duration = line.duration;
                const name = uuidv4();
                return { ...acc, [name]: [start, duration] };
              }, {})
            }
          });

          new Promise((resolve, reject) => {
            newAudioPlayer.on('load', () => {
              console.log('Audio Player Loaded');
              setAudioPlayer(newAudioPlayer);
              resolve(newAudioPlayer);
            });
            newAudioPlayer.once('loaderror', (id, error) => {
              console.log('Audio Player Load Error');
              reject(error);
            });
          });
        });
      } else {
        console.log('No Transcription Found');
      }
    };

    loadPage();
  }, [entry]);

  // If the page is ready
  if (ready) {
    // If the entry has a transcription
    if (entry && entry.transcriptions[0] && entry.transcriptions[0].vtt) {
      // If the audio player is ready
      if (audioPlayer) {
        content = (
          <>
            <Text italic align="center">
              Known Bug: If you refresh this page the audio element loses track of files and refuses to play. To get it
              to work use CMD-R or F5 to refresh this page in the meantime
            </Text>
            {audioControls}
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
  }

  return content;
}

export default EntryEditor;
