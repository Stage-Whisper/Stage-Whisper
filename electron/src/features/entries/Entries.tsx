import { Stack } from '@mantine/core';
import React from 'react';

// Redux
import { useAppSelector } from '../../redux/hooks';

// Components
import EntryCard from './components/EntryCard';
import { selectActiveEntry, selectEntries } from './entrySlice';

// Localization
import EntryEditor from './components/EntryEditor';

// Component for displaying entry progress / results
function Entries() {
  // Get All Entries
  const entries = useAppSelector(selectEntries);

  // Get Active Transcription (if it exists)
  const activeId = useAppSelector(selectActiveEntry);

  const transcriptionCards = entries.map((entry) => {
    return <EntryCard key={entry.config.uuid} entry={entry} />;
  });

  console.log('Active Entry ID: ' + activeId);
  if (activeId === null) {
    return (
      <Stack>
        <Stack spacing="md">{transcriptionCards}</Stack>
      </Stack>
    );
  } else {
    return <EntryEditor active={entries.filter((entry) => entry.config.uuid === activeId)[0]} />;
  }
}

export default Entries;
