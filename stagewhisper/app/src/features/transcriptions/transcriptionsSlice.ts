import { RootState } from './../../redux/store';

// Transcription Slice
// This holds the state of the transcriptions and will be updated by electron/node processes

import { createSlice } from '@reduxjs/toolkit';

export interface transcriptionState {
  transcriptions: transcription[];
}

export interface transcription {
  id: number;
  title: string;
  description: string;
  date: string;
  tags: string[];
  audio: string;
  language: string;
  translated: boolean;
  model: string;
  progress: number;
  status: 'pending' | 'in progress' | 'complete';
  directory: string;
  transcript: string;
  opened: boolean;
}

const initialState: transcriptionState = {
  transcriptions: [
    {
      id: 0,
      title: 'Test Title0',
      description: 'Test Description0',
      date: '2020-01-01',
      tags: ['test', 'tags'],
      audio: 'test audio 0',
      language: 'en',
      translated: false,
      model: 'default model test',
      progress: 0,
      status: 'pending',
      directory: 'test',
      transcript:
        'test transcript text that will be replaced with a complicated object with timings and other things, I am filling space so that we can see what it might look like hello there ',
      opened: false
    },
    {
      id: 1,
      title: 'Test Title1',
      description: 'Test Description',
      date: '2020-01-01',
      tags: ['test', 'tags'],
      audio: 'test audio',
      language: 'en',
      translated: false,
      model: 'default model test',
      progress: 0,
      status: 'pending',
      directory: 'test',
      transcript:
        'test transcript text that will be replaced with a complicated object with timings and other things, I am filling space so that we can see what it might look like hello there ',
      opened: false
    },
    {
      id: 2,
      title: 'Test Title2',
      description: 'Test Description',
      date: '2020-01-01',
      tags: ['test', 'tags'],
      audio: 'test audio',
      language: 'en',
      translated: false,
      model: 'default model test',
      progress: 0,
      status: 'pending',
      directory: 'test',
      transcript:
        'test transcript text that will be replaced with a complicated object with timings and other things, I am filling space so that we can see what it might look like hello there ',
      opened: false
    },
    {
      id: 3,
      title: 'Test Title3',
      description: 'Test Description',
      date: '2020-01-01',
      tags: ['test', 'tags'],
      audio: 'test audio',
      language: 'en',
      translated: false,
      model: 'default model test',
      progress: 0,
      status: 'pending',
      directory: 'test',
      transcript:
        'test transcript text that will be replaced with a complicated object with timings and other things, I am filling space so that we can see what it might look like hello there ',
      opened: false
    },
    {
      id: 4,
      title: 'Test Title4',
      description: 'Test Description',
      date: '2020-01-01',
      tags: ['test', 'tags'],
      audio: 'test audio',
      language: 'en',
      translated: false,
      model: 'default model test',
      opened: false,
      progress: 0,
      status: 'pending',
      directory: 'test',
      transcript:
        'test transcript text that will be replaced with a complicated object with timings and other things, I am filling space so that we can see what it might look like hello there '
    }
  ]
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
