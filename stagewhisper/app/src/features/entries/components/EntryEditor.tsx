import React, { useEffect } from 'react';

// Components
import { Text, Center, Grid, Stack, Card, Button } from '@mantine/core';
// import { RichTextEditor } from '@mantine/rte';

// Types
import { entry, entryTranscription } from '../../../../electron/types/types';
import { Node, NodeList } from 'subtitle';

// Redux
// import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
// import { selectTranscribingStatus } from '../../whisper/whisperSlice';
// import { selectActiveEntry, selectEntries } from '../entrySlice';

// Packages
import { Howl, Howler } from 'howler';
import { v4 as uuidv4 } from 'uuid';

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

// This is a component that will be used to display the transcription editor when an entry is selected
function EntryEditor({ entry }: { entry: entry }) {
  // If the entry has a transcription

  // Empty state to store the formatted VTT lines
  const [formattedVTTLines, setFormattedVTTLines] = React.useState<Array<formattedVTTLine>>([]);

  // Empty state to store the current line
  const [currentLine, setCurrentLine] = React.useState<formattedVTTLine | null>(null);

  // Whether the page is ready to be displayed
  const [ready, setReady] = React.useState<boolean>(false);

  // Whether the audio is playing
  const [playing, setPlaying] = React.useState<boolean>(false);

  // Whether the audio is paused
  const [paused, setPaused] = React.useState<boolean>(false);

  // Whether the audio is muted
  const [muted, setMuted] = React.useState<boolean>(false);

  // The duration of the audio
  const [duration, setDuration] = React.useState<number>(0);

  // The limits of the current line (in milliseconds)
  const [lineLimits, setLineLimits] = React.useState<[number, number]>([0, 0]);

  // Set up the audio player state
  const [audioPlayer, setAudioPlayer] = React.useState<Howl | null>(null);

  useEffect(() => {
    // If the entry has a transcription
    if (entry && entry.transcriptions[0] && entry.transcriptions[0].vtt) {
      // TODO: Change this to select the correct transcription
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
    }
    // Set the page as ready
    console.log('Setting Ready');
    setReady(true);
  }, [entry]);

  // Set up the audio player
  useEffect(() => {
    // If the entry has a transcription
    if (ready && entry && entry.transcriptions[0] && entry.audio.path) {
      // Get the audio file path

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
        // Set the audio player
        console.log('Setting Audio Player', newAudioPlayer);
        setAudioPlayer(newAudioPlayer);
      });
    }
  }, [entry]);

  let content = null;

  // If the page is ready
  if (ready) {
    // If the entry has a transcription
    if (entry && entry.transcriptions[0] && entry.transcriptions[0].vtt) {
      // If the audio player is ready
      if (audioPlayer) {
        // If the current line is set
        content = (
          <Card shadow="md" p="lg">
            <Text>{currentLine?.text}</Text>

            <Stack spacing="md">
              {/* Button Section */}
              <Button
                onClick={() => {
                  console.log('Play');
                  console.log('Current Line: ', currentLine);
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
