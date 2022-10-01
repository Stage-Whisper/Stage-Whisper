import { Text } from '@mantine/core';
import React from 'react';
import strings from '../../localization';

function Dashboard() {
  return <Text>{strings.dashboard?.title}</Text>; // TODO: Add dashboard content
}

export default Dashboard;
