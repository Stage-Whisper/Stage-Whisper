import { Stack } from '@mantine/core';
import React, { useState } from 'react';

// Redux
import { useAppSelector } from '../../redux/hooks';

// Components
import EntryCard from './card/EntryCard';
import FilterSettings from './card/FilterSettings';
import { selectEntries } from './entrySlice';

// Component for displaying entry progress / results
function Entries() {
  // Get All Entries
  const entries = useAppSelector(selectEntries);
  const [sortedEntries, setSortedEntries] = useState([...entries]);

  return (
    <Stack>
      {/* Add filtering options */}
      <FilterSettings entries={entries} setEntries={setSortedEntries}></FilterSettings>

      {sortedEntries.map((entry) => {
        return <EntryCard key={entry.uuid} entry={entry} />;
      })}
    </Stack>
  );
}

export default Entries;
