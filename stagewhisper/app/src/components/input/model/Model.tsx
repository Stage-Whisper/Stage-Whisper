import { Card, Stack, Title, SegmentedControl, Alert } from '@mantine/core';
import React from 'react';

import strings from '../../../localization';

interface Props {
  selectedModel: 'tiny' | 'base' | 'small' | 'medium' | 'large';
  setSelectedModel: (value: 'tiny' | 'base' | 'small' | 'medium' | 'large') => void;
}

function model({ selectedModel, setSelectedModel }: Props) {
  const options = [
    {
      label: strings.transcribe.models.options.tiny.title,
      value: 'tiny',
      description: strings.transcribe.models.options.tiny.description
    },
    {
      label: strings.transcribe.models.options.base.title,
      value: 'base',
      description: strings.transcribe.models.options.base.description
    },
    {
      label: strings.transcribe.models.options.small.title,
      value: 'small',
      description: strings.transcribe.models.options.small.description
    },
    {
      label: strings.transcribe.models.options.medium.title,
      value: 'medium',
      description: strings.transcribe.models.options.medium.description
    },
    {
      label: strings.transcribe.models.options.large.title,
      value: 'large',
      description: strings.transcribe.models.options.large.description
    }
  ];

  return (
    <Card shadow="xs" p="md" withBorder title="Model">
      <Stack>
        <Title order={4}>{strings.transcribe.models.title}</Title>
        <SegmentedControl
          value={selectedModel}
          onChange={(value) => {
            setSelectedModel(value as 'tiny' | 'base' | 'small' | 'medium' | 'large');
          }}
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
