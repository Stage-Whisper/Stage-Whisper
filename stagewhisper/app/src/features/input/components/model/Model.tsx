import { Card, Stack, Title, SegmentedControl, Alert } from '@mantine/core';
import React from 'react';

// Redux
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { selectModel, setModel } from '../../inputSlice';

// Localization
import strings from '../../../../localization';
import { selectAllowLargeModels } from '../../../settings/settingsSlice';

function model() {
  // Redux
  const dispatch = useAppDispatch();
  const { model } = useAppSelector(selectModel);
  const allowLargeModels = useAppSelector(selectAllowLargeModels);

  const options = [
    {
      label: strings.input?.models.options.tiny.title,
      value: 'tiny',
      description: strings.input?.models.options.tiny.description
    },
    {
      label: strings.input?.models.options.base.title,
      value: 'base',
      description: strings.input?.models.options.base.description
    },
    {
      label: strings.input?.models.options.small.title,
      value: 'small',
      description: strings.input?.models.options.small.description
    },
    {
      label: strings.input?.models.options.medium.title,
      value: 'medium',
      description: strings.input?.models.options.medium.description
    },
    {
      label: strings.input?.models.options.large.title,
      value: 'large',
      description: strings.input?.models.options.large.description,
      disabled: !allowLargeModels // FIXME: This is not working
    }
  ];

  return (
    <Card shadow="xs" p="md" withBorder title="Model">
      <Stack>
        <Title order={4}>{strings.input?.models.title}</Title>
        <SegmentedControl
          value={model}
          fullWidth
          onChange={(value) => {
            if (value && (allowLargeModels || value !== 'large')) {
              console.log(value);
              dispatch(setModel(value));
            } else {
              dispatch(setModel(value === 'large' ? 'medium' : value));
            }
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
