import { Text } from '@mantine/core';
import React from 'react';
import strings from '../../localization';

function Dashboard() {
  return <Text>{strings.dashboard?.title}</Text>;
}

export default Dashboard;
