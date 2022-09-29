import { Card, Stack, Title, SegmentedControl, Alert } from '@mantine/core';
import React from 'react';

// Redux
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { selectModel, setModel } from '../../../views/input/inputSlice';

// Localization
import strings from '../../../localization';

function model() {
  // Redux
  const dispatch = useAppDispatch();
  const { model } = useAppSelector(selectModel);

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
          value={model}
          onChange={(value) => {
            dispatch(setModel(value as 'tiny' | 'base' | 'small' | 'medium' | 'large'));
          }}
          data={options.map((option) => ({
            label: option.label,
            value: option.value
          }))}
        />

        {/* Show the description of the selected option */}
        <Alert>{options.find((option) => option.value === model)?.description}</Alert>
      </Stack>
    </Card>
  );
}

export default model;
