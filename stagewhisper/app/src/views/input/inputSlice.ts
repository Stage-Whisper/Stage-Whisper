import { DescriptionType } from './../../components/input/description/Description';
import { createSlice } from '@reduxjs/toolkit';
import { AudioType } from '../../components/input/audio/Audio';
import { RootState } from '../../redux/store';
import { WhisperLanguages } from '../../components/input/language/languages';

// input Slice
// This slice is used to store the state of the inputs for transcription

export interface inputState {
  // Input States
  description: DescriptionType;
  descriptionValid: boolean;

  audio: AudioType;
  audioValid: boolean;

  language: keyof typeof WhisperLanguages;
  languageValid: boolean;

  directory: string | undefined;
  directoryValid: boolean;

  model: 'tiny' | 'base' | 'small' | 'medium' | 'large';
  modelValid: boolean;

  // Page States
  highlightInvalid: boolean; // Whether to highlight invalid inputs
}

const initialState: inputState = {
  // Input States
  description: {
    title: undefined,
    description: undefined,
    date: undefined,
    tags: []
  },
  descriptionValid: false,

  audio: {
    name: undefined,
    path: undefined,
    type: undefined
  },
  audioValid: false,

  language: 'en',
  languageValid: false,

  directory: undefined,
  directoryValid: false,

  model: 'base',
  modelValid: false,

  // Page States
  highlightInvalid: false
};

const inputSlice = createSlice({
  name: 'input',
  initialState,
  reducers: {
    setHighlightInvalid: (state, action) => {
      state.highlightInvalid = action.payload;
    },
    setAudio: (state, action) => {
      state.audio = action.payload;
    },
    setAudioValid: (state, action) => {
      state.audioValid = action.payload;
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
    setLanguageValid: (state, action) => {
      state.languageValid = action.payload;
    },
    setDirectory: (state, action) => {
      state.directory = action.payload;
    },
    setDirectoryValid: (state, action) => {
      state.directoryValid = action.payload;
    },
    setModel: (state, action) => {
      state.model = action.payload;
    },
    setModelValid: (state, action) => {
      state.modelValid = action.payload;
    },
    setDescription: (state, action) => {
      state.description = action.payload;
    },
    setDescriptionValid: (state, action) => {
      state.descriptionValid = action.payload;
    }
  }
});

// Export Input States
export const selectAudio = (state: RootState) => ({
  audio: state.input.audio,
  audioValid: state.input.audioValid
});
export const selectLanguage = (state: RootState) => ({
  language: state.input.language,
  languageValid: state.input.languageValid
});
export const selectDirectory = (state: RootState) => ({
  directory: state.input.directory,
  directoryValid: state.input.directoryValid
});
export const selectModel = (state: RootState) => ({
  model: state.input.model,
  modelValid: state.input.modelValid
});
export const selectDescription = (state: RootState) => ({
  description: state.input.description,
  descriptionValid: state.input.descriptionValid
});

// Export Page States
export const selectHighlightInvalid = (state: RootState) => state.input.highlightInvalid;

// export const selectBurgerMenuOpen = (state: RootState) => state.input.burgerMenuOpen;

// Export Input Action
export const {
  setAudio,
  setAudioValid,
  setLanguage,
  setLanguageValid,
  setDirectory,
  setDirectoryValid,
  setModel,
  setModelValid,
  setDescription,
  setDescriptionValid,
  setHighlightInvalid
} = inputSlice.actions;

// Export the reducer
export default inputSlice.reducer;
