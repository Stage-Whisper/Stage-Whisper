import { Center, Stack } from '@mantine/core';
import React from 'react';

// Redux
import { useAppSelector } from '../../redux/hooks';

// Components
import EntryCard from './components/EntryCard';
import { selectActiveEntry, selectEntries } from './entrySlice';
import EntryEditor from './EntryEditor';

// Localization

// Component for displaying entry progress / results
function Entries() {
  // Get All Entries
  const entries = useAppSelector(selectEntries);

  return (
    <Stack>
      {entries.map((entry) => {
        return <EntryCard key={entry.config.uuid} entry={entry} />;
      })}
    </Stack>
  );
}

export default Entries;
