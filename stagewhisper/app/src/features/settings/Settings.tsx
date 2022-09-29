import { Card, Center, Stack } from '@mantine/core';
import React from 'react';

// Components

// Redux
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { selectDisplayLanguage, selectTheme } from './settingsSlice';

function Settings() {
  // Redux
  const dispatch = useAppDispatch();
  const displayLanguage = useAppSelector(selectDisplayLanguage);
  const theme = useAppSelector(selectTheme);

  return (
    <Center my="lg">
      <Stack>
        <Card>Setting</Card>
      </Stack>
    </Center>
  );
}

export default Settings;
