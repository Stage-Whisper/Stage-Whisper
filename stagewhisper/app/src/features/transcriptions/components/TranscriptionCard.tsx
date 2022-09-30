import { SimpleGrid, Center, Button, Title, Card, Group, Divider } from '@mantine/core';
import React from 'react';

// Redux
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { transcription } from '../transcriptionsSlice';

// Localization
import strings from '../../../localization';

function TranscriptionCard({ transcription }: { transcription: transcription }) {
  return (
    <Card withBorder>
      <Title order={2}>{transcription.title}</Title>
      <Divider mt="xs" mb="md" />
      <Title order={4}>{transcription.description}</Title>
    </Card>
  );
}

export default TranscriptionCard;
