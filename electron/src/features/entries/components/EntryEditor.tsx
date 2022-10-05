import React, { useState } from 'react';

// Components
import { Text, Center, Grid, Stack, Card } from '@mantine/core';
// import { RichTextEditor } from '@mantine/rte';

// Types
import { entry, entryTranscription } from '../../../../electron/types/types';

// Redux
import { useAppDispatch } from '../../../redux/hooks';
import { Node } from 'subtitle';

// Vtt Viewer Component
// Shows a line of dialogue and the corresponding subtitle
const vttLine = (vtt: Node) => {
  // Check if the vtt line is a cue
  if (vtt.type === 'cue') {
    // Get the start and end times
    const start = vtt.data.start;
    const end = vtt.data.end;

    return (
      <Grid style={{ width: '100%' }} key={vtt.data.start}>
        <Card style={{ width: '100%' }} withBorder>
          <Center>
            <Text>{vtt.data.text}</Text>
          </Center>
          <Center>
            <Text>
              {start / 1000}s - {end / 1000}s
            </Text>
          </Center>
        </Card>
      </Grid>
    );
  }
};

// This is a component that will be used to display the transcription editor when an entry is selected
function EntryEditor({ active: entry }: { active: entry }) {
  // Redux
  const dispatch = useAppDispatch();

  // Get transcriptions for the active entry
  const transcriptions = entry.transcriptions;

  // Set local state for the active transcription - ie. Which transcription is currently being edited on the active entry
  const [activeTranscription, setActiveTranscription] = useState<entryTranscription>(transcriptions[0] || { text: '' });

  // Check if an entry is selected
  if (entry) {
    // Check if the active entry has any transcriptions
    if (transcriptions.length > 0) {
      // If there are transcriptions, return the transcription editor

      return (
        <Stack>
          {
            // Map over the vtt lines and display them
            activeTranscription.vtt &&
              activeTranscription.vtt.map((vtt) => {
                return vttLine(vtt);
              })
          }
          {/* Audio player */}

          {console.log(<source media={entry.audio.path} type={entry.audio.type} />)}
          <audio controls>
            <source media={entry.audio.path} type={entry.audio.type} />
          </audio>

          <Center>
            <Grid>{/* <RichTextEditor formats={[]} controls={[]} value={entry.transcriptions[0]} id="rte" /> */}</Grid>
          </Center>
        </Stack>
      );
    } else {
      // If there are no transcriptions, return a message prompting the user to add entry to the queue
      return (
        <Center>
          <h1>No transcriptions</h1>
        </Center>
      );
    }
  } else {
    // If no entry is selected redirect to either the list of entries or the home page (depending on if there are any entries)
    return (
      <Center>
        <Stack>
          <h1> No Entry Selected </h1>
        </Stack>
      </Center>
    );
  }
}
export default EntryEditor;
