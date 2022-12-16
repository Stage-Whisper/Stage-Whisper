import { Card, Stack, TextInput, Title } from '@mantine/core';
import { Entry } from '@prisma/client';
import * as React from 'react';
import strings from '../../../../localization';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { selectAbout, selectHighlightInvalid, setAbout } from '../../inputSlice';

// Localization
// import strings from '../../../../localization';

// Types
export type AboutUtilityType = Pick<Entry, 'name' | 'description'>;

function About() {
  // TODO: #45 Add Description component with fields for name, description, and tags
  // #42, #44
  // Used to input the transcription name, description, tags and notes
  // Redux
  const dispatch = useAppDispatch();
  const { aboutValid, about } = useAppSelector(selectAbout);
  const highlightInvalid = useAppSelector(selectHighlightInvalid);

  const [name, setName] = React.useState(about.name);
  const [description, setDescription] = React.useState(about.description);

  return (
    <Card shadow="xs" p="md" withBorder title="Audio">
      <Stack>
        <Title order={4}>{strings.input?.about?.title}</Title>
        {/* Name of the entry */}
        <TextInput
          error={aboutValid && highlightInvalid && !about?.name}
          placeholder={strings.input?.about?.name.placeholder}
          label={strings.input?.about?.name.prompt}
          value={name}
          onChange={(e) => {
            setName(e.currentTarget.value);
          }}
          onBlur={() => {
            dispatch(setAbout({ ...about, name: name }));
          }}
        />
        {/* Description of the entry */}
        <TextInput
          error={aboutValid && highlightInvalid && !about?.description}
          placeholder={strings.input?.about?.description.placeholder}
          label={strings.input?.about?.description.prompt}
          value={description}
          onChange={(e) => {
            setDescription(e.currentTarget.value);
          }}
          onBlur={() => {
            dispatch(setAbout({ ...about, description: description }));
          }}
        />
        {/* Tags for the entry */}
        {/* <TextInput
          placeholder={strings.input?.about?.tags.placeholder}
          label={strings.input?.about?.tags.prompt}
          value={tags}
          onChange={(e) => {
            setTags(e.currentTarget.value.split(','));
          }}
          onBlur={() => {
            dispatch(setAbout({ ...about, tags: tags }));
          }}
        /> */}
      </Stack>
    </Card>
  );
}

export default About;
