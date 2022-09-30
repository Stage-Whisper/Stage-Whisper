import { RootState } from './../../redux/store';

// Transcription Slice
// This holds the state of the transcriptions and will be updated by electron/node processes

import { createSlice } from '@reduxjs/toolkit';

export interface transcriptionState {
  transcriptions: transcription[];
}

export interface transcription {
  id: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  audio: string;
  language: string;
  model: string;
  progress: number;
  status: string;
  directory: string;
  transcript: string;
}

const initialState: transcriptionState = {
  transcriptions: []
};

export const transcriptionsSlice = createSlice({
  name: 'transcriptions',
  initialState,
  reducers: {
    addTranscription: (state, action) => {
      state.transcriptions.push(action.payload);
    },
    updateTranscription: (state, action) => {
      const index = state.transcriptions.findIndex((transcription) => transcription.id === action.payload.id);
      if (index !== -1) {
        state.transcriptions[index] = action.payload;
      }
    },
    removeTranscription: (state, action) => {
      const index = state.transcriptions.findIndex((transcription) => transcription.id === action.payload);
      if (index !== -1) {
        state.transcriptions.splice(index, 1);
      }
    }
  }
});

export const { addTranscription, updateTranscription, removeTranscription } = transcriptionsSlice.actions;

// Export Transcription States
export const selectTranscriptions = (state: RootState) => state.transcriptions.transcriptions;

// Export the reducer
export default transcriptionsSlice.reducer;
