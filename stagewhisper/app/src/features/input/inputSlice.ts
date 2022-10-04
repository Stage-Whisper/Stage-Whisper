import { AboutType } from './components/about/About';
import { createSlice } from '@reduxjs/toolkit';
import { AudioType } from './components/audio/Audio';
import { RootState } from '../../redux/store';
import { WhisperArgs } from '../../../electron/types/whisperTypes';

// input Slice
// This slice is used to store the state of the inputs for transcription

export type inputState = {
  // Input States
  // These Description of new entry
  about: AboutType;
  aboutValid: boolean;

  // These are the audio files for the new entry
  audio: AudioType;
  audioValid: boolean;

  // This is the language of the new entry audio file
  language: WhisperArgs['language'];
  languageValid: boolean;

  // This is the model of the new entry audio file
  model: WhisperArgs['model'];
  modelValid: boolean;

  // Page States (Used to highlight errors on the current page)
  highlightInvalid: boolean; // Whether to highlight invalid inputs

  // Submission States (Used to show the user that the app is working)
  submitting: boolean; // Whether the form is currently submitting
  submitted: boolean; // Whether the form has been submitted
  error: string | null; // Error message //TODO: Add error warning
};

const initialState: inputState = {
  // Input States
  about: {
    name: '',
    description: '',
    tags: []
  },
  aboutValid: false,

  audio: {
    name: undefined,
    path: undefined,
    type: undefined
  },
  audioValid: false,

  language: 'English',
  languageValid: false,

  model: 'base',
  modelValid: false,

  // Page States
  highlightInvalid: false,

  // Submission States
  submitting: false,
  submitted: false,
  error: null
};

const inputSlice = createSlice({
  name: 'input',
  initialState,
  reducers: {
    // Whether to highlight invalid inputs, set after user tries to trigger submission
    setHighlightInvalid: (state, action) => {
      state.highlightInvalid = action.payload;
    },
    // Set the about input
    setAbout: (state, action) => {
      state.about = action.payload;
    },
    // Set the about input validity
    setAboutValid: (state, action) => {
      state.aboutValid = action.payload;
    },

    // Set the audio file
    setAudio: (state, action) => {
      state.audio = action.payload;
    },
    // Set the audio file validity
    setAudioValid: (state, action) => {
      state.audioValid = action.payload;
    },

    // Set the language
    setLanguage: (state, action: { payload: WhisperArgs['language'] }) => {
      state.language = action.payload;
    },
    // Set the language validity
    setLanguageValid: (state, action) => {
      state.languageValid = action.payload;
    },

    // Set the description
    setDescription: (state, action) => {
      state.about = action.payload;
    },
    // Set the description validity
    setDescriptionValid: (state, action) => {
      state.aboutValid = action.payload;
    },

    // Submission Reducers
    // Set the whether the form is currently submitting
    setSubmitting: (state, action) => {
      state.submitting = action.payload;
    },
    // Set the whether the form has been submitted (used to show success message)
    setSubmitted: (state, action) => {
      state.submitted = action.payload;
    },
    // Set the error message
    setError: (state, action) => {
      state.error = action.payload;
    },
    resetInput: (state) => {
      state.about = initialState.about;
      state.aboutValid = initialState.aboutValid;
      state.audio = initialState.audio;
      state.audioValid = initialState.audioValid;
      state.language = initialState.language;
      state.languageValid = initialState.languageValid;
      state.model = initialState.model;
      state.modelValid = initialState.modelValid;
      state.highlightInvalid = initialState.highlightInvalid;
      state.submitting = initialState.submitting;
      state.submitted = initialState.submitted;
      state.error = initialState.error;
    }
  }
});

// Export Input States
export const selectAudio = (state: RootState) => ({
  audio: state.input.audio,
  audioValid: state.input.audioValid
});
export const selectLanguage = (
  state: RootState
): {
  language: WhisperArgs['language'];
  languageValid: boolean;
} => ({
  language: state.input.language,
  languageValid: state.input.languageValid
});

export const selectAbout = (state: RootState) => ({
  about: state.input.about,
  aboutValid: state.input.aboutValid
});

export const selectDescription = (state: RootState) => ({
  description: state.input.about,
  descriptionValid: state.input.aboutValid
});

export const selectSubmittingState = (state: RootState) => ({
  submitting: state.input.submitting,
  submitted: state.input.submitted,
  error: state.input.error
});

// Export Page States
export const selectHighlightInvalid = (state: RootState) => state.input.highlightInvalid;

// export const selectBurgerMenuOpen = (state: RootState) => state.input.burgerMenuOpen;

// Export Input Action
export const {
  setAudio,
  setAudioValid,
  setAbout,
  setAboutValid,
  setLanguage,
  setLanguageValid,
  setDescription,
  setDescriptionValid,
  setHighlightInvalid,
  setSubmitting,
  setSubmitted,
  setError,
  resetInput
} = inputSlice.actions;

// Export the reducer
export default inputSlice.reducer;
