import React from 'react';

// Redux
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { selectDirectory, selectHighlightInvalid, setDirectory } from '../../../features/input/inputSlice';

// Localization
import strings from '../../../localization';

// Types
export interface DescriptionType {
  title: string | undefined;
  description: string | undefined;
  date: string | undefined;
  tags: string[] | undefined;
}

function Description() {
  // Used to input the transcription name, description, tags and notes
  return <div>Description</div>;
}

// TODO: Add Description component with name, description, and tags
export default Description;
