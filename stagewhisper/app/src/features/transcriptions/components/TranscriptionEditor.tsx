import { Center, Grid, Stack } from '@mantine/core';
import { RichTextEditor } from '@mantine/rte';
import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';

import { transcription } from '../transcriptionsSlice';

// This is a component that will be used to display the transcription editor when a transcription is selected
function TranscriptionEditor({ active: transcription }: { active: transcription }) {
  // Get the dispatch function

  // Page with a card containing the transcription metadata

  // Transcription Editor which shows the raw output of the model which is in VTT format
  // This will be used to edit the transcription and save it to the database

  // This is the value of the transcription editor

  if (!transcription) {
    return (
      <Center>
        <Stack>
          <h1> No transcription selected </h1>
        </Stack>
      </Center>
    );
  } else {
    return (
      <Stack>
        <Grid>
          <Grid.Col md={4} sm={12}>
            {/* Metadata 1 */}
          </Grid.Col>
          <Grid.Col md={8} sm={12}>
            {/* Metadata 2 */}
          </Grid.Col>
        </Grid>
        <Center>
          <Grid>
            <RichTextEditor formats={[]} controls={[]} value={transcription.transcriptText} id="rte" />
          </Grid>
        </Center>
      </Stack>
    );
  }
}
export default TranscriptionEditor;
