import { Button, Chip, Group, Select, TextInput } from '@mantine/core';
import { IconSearch, IconSortAscending, IconSortDescending } from '@tabler/icons';
import React, { useEffect, useState } from 'react';
import { entry } from '../../../../electron/types/types';
function FilterSettings({
  entries,
  setEntries
}: {
  entries: entry[];
  setEntries: React.Dispatch<React.SetStateAction<entry[]>>;
}) {
  //Use state to store the current filter of type sortConfig
  const [filter, setFilter] = useState<sortConfig>({
    query: '',
    showCompleted: true,
    showNotStarted: true,
    hidden: 'none',
    sortBy: 'time',
    asc: true
  });

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter({ ...filter, query: event.target.value });
  };
  const handleShowNotStartedChange = (event: React.MouseEvent<HTMLInputElement>) => {
    setFilter({ ...filter, showNotStarted: event.currentTarget.checked });
  };
  const handleShowCompletedChange = (event: React.MouseEvent<HTMLInputElement>) => {
    setFilter({ ...filter, showCompleted: event.currentTarget.checked });
  };
  const handleSortByChange = (value: string) => {
    setFilter({ ...filter, sortBy: value as sortConfig['sortBy'] });
  };
  const handleSortDirectionChange = () => {
    setFilter({ ...filter, asc: !filter.asc });
  };

  //Filter the entries based on the current filter
  useEffect(() => {
    let filteredEntries = [...entries];
    if (filter.query !== '') {
      filteredEntries = filteredEntries.filter((entry) => {
        return entry.config.name.toLowerCase().includes(filter.query.toLowerCase());
      });
    }
    if (!filter.showCompleted) {
      console.log('hide completed');
      filteredEntries = filteredEntries.filter((entry) => {
        return entry.transcriptions.length === 0;
      });
    }
    if (!filter.showNotStarted) {
      console.log('hide not started');
      filteredEntries = filteredEntries.filter((entry) => {
        return entry.transcriptions.length > 0;
      });
    }
    if (filter.sortBy === 'time') {
      console.log('sort by time');
      filteredEntries = filteredEntries.sort((a, b) => {
        return filter.asc ? a.config.created - b.config.created : b.config.created - a.config.created;
      });
    } else {
      //Sort alphabetically
      filteredEntries = filteredEntries.sort((a, b) => {
        return filter.asc ? b.config.name.localeCompare(a.config.name) : a.config.name.localeCompare(b.config.name);
      });
    }
    setEntries(filteredEntries);
  }, [filter, entries, setEntries]);
  return (
    <>
      {/* <Card shadow="sm"> */}
      <Group
        //Make the columns responsive
        grow={false}
      >
        <TextInput
          icon={<IconSearch size={18} stroke={1.5} />}
          radius="xl"
          size="md"
          onChange={handleQueryChange}
          placeholder="Search Entries"
        />

        <Group grow={false}>
          {/* <Switch label="Show Completed?" onChange={handleShowCompletedChange} defaultChecked></Switch>
          <Switch label="Show in Progress" onChange={handleShowInProgressChange} defaultChecked></Switch>
          <Switch label="Show Not Started" onChange={handleShowNotStartedChange} defaultChecked></Switch> */}
          {/* Use Chips to represent the above  */}
          <Chip.Group position="center" multiple defaultValue={['transcribed', 'notstarted']}>
            <Chip value="transcribed" onClick={handleShowCompletedChange}>
              Transcribed?
            </Chip>
            <Chip value="notstarted" onClick={handleShowNotStartedChange}>
              Not transcribed
            </Chip>
          </Chip.Group>
          <Select
            // label="Sort by"
            defaultValue={filter.sortBy}
            onChange={handleSortByChange}
            data={[
              { value: 'time', label: 'Sort by Creation Date' },
              { value: 'alphabetically', label: 'Sort Alphabetically' }
            ]}
          />
          <Button variant="subtle" onClick={handleSortDirectionChange}>
            {filter.asc ? <IconSortAscending></IconSortAscending> : <IconSortDescending></IconSortDescending>}
          </Button>
        </Group>
      </Group>
      {/* </Card> */}
    </>
  );
}

export default FilterSettings;

//Create a type for the sort
type sortConfig = {
  sortBy: 'name' | 'time';
  asc: boolean;
  hidden: 'untranscribed' | 'transcribed' | 'none';
  query: string;
  showCompleted: boolean;
  showNotStarted: boolean;
};
