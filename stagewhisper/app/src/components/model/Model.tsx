import { Card, Stack, Title, SegmentedControl, Alert } from '@mantine/core';
import React from 'react';

interface Props {
  selectedModel: string;
  setSelectedModel: (value: string) => void;
}

function model({ selectedModel, setSelectedModel }: Props) {
  const options = [
    {
      label: 'Tiny',
      value: 'Tiny',
      description: 'This is the smallest model, it is the fastest but struggles with non english languages'
    },
    {
      label: 'Base',
      value: 'Base',
      description: 'This is the default model, it is a good balance of speed and accuracy'
    },
    {
      label: 'Small',
      value: 'Small',
      description: 'This is a larger model that is suitable for non-english language transcription and translation'
    },
    {
      label: 'Medium',
      value: 'Medium',
      description:
        'This is a large model that can be used with any language, if using english this will likely be the best model for most people'
    },
    {
      label: 'Large',
      value: 'Large',
      description:
        'This is the largest model, it is the most accurate but also the slowest. It requires a lot of memory to run'
    }
  ];

  return (
    <Card shadow="xs" p="md" withBorder title="Model">
      <Stack>
        <Title order={4}>AI Model</Title>
        <SegmentedControl
          placeholder="Pick one"
          value={selectedModel}
          onChange={(value) => setSelectedModel(value)}
          data={options.map((option) => ({
            label: option.label,
            value: option.value
          }))}
        />

        {/* Show the description of the selected option */}
        <Alert>{options.find((option) => option.value === selectedModel)?.description}</Alert>
      </Stack>
    </Card>
  );
}

export default model;
