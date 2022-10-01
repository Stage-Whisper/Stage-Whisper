import { WhisperArgs } from '../../../electron/whisperTypes';
import { RootState } from './../../redux/store';

// Transcription Slice
// This holds the state of the transcriptions and will be updated by electron/node processes

import { createSlice } from '@reduxjs/toolkit';
// import { WhisperLanguages } from '../input/components/language/languages';
import { NodeList } from 'subtitle';
import { LoremIpsum } from 'lorem-ipsum';

export interface transcriptionState {
  transcriptions: transcription[];
  activeTranscription: number | null;
}

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4
  },
  wordsPerSentence: {
    max: 16,
    min: 4
  }
});

export enum transcriptionStatus {
  IDLE = 'idle', // User has added a file to be transcribed but it has not been added to the queue
  QUEUED = 'queued', // User has indicated they want to transcribe this file
  PENDING = 'pending', // Transcription has started but its progress is unknown
  PROCESSING = 'processing', // Transcription is in progress
  STALLED = 'stalled', // Transcription is taking too long (probably due to a large model)
  ERROR = 'error', // Transcription has failed
  PAUSED = 'paused', // Transcription has been paused by the user
  COMPLETE = 'complete', // Transcription has finished
  CANCELLED = 'cancelled', // Transcription has been cancelled by the user
  DELETED = 'deleted', // Transcription has been deleted by the user
  UNKNOWN = 'unknown' // Transcription status is unknown (probably due to an error talking to the transcriber)
}

export interface transcription {
  // File information
  audio: string; // Path to the audio file
  audioTitle: string; // Title of the audio file
  audioAdded: string; // Date of when the audio file was added to the system (YYYY-MM-DD)
  length: number; // Length of the audio file in seconds
  audioFormat: string; // Format of the audio file
  language: WhisperArgs['language']; // Language of the audio file
  date: string; // Date value for interview (YYYY-MM-DD)

  // Transcription information
  title: string; // Title of the transcription
  description: string; // Description of the transcription
  created: string; // Date of when the transcription was completed (YYYY-MM-DD)
  tags: string[]; // Tags for the transcription
  translated: boolean; // Whether the transcription has been translated
  model: 'tiny' | 'base' | 'small' | 'medium' | 'large'; // Model used for the transcription
  progress: number; // Progress of the transcription
  status: transcriptionStatus; // Status of the transcription
  directory: string; // Directory where the transcription is stored
  transcriptText: string | undefined; // Text of the transcription
  transcriptVtt: NodeList | undefined; // VTT of the transcription

  transcriptLength: number; // Length of the transcript file in words

  // Transcription metadata
  opened: boolean; // Whether the transcription has been opened in the editor
  id: number; // Unique internal id
  error: string | undefined; // Error message if the transcription failed
}

const initialState: transcriptionState = {
  transcriptions: [],
  activeTranscription: 0
};

export const transcriptionsSlice = createSlice({
  name: 'transcriptions',
  initialState,
  reducers: {
    setActiveTranscription: (state, action) => {
      // This action is called when a transcription is opened by the user
      state.activeTranscription = action.payload;
    },

    addTranscription: (state, action) => {
      // This action is called when a transcription is added
      state.transcriptions.push(action.payload);
    },

    updateTranscription: (state, action) => {
      // This action is called when a transcription is updated
      const index = state.transcriptions.findIndex((transcription) => transcription.id === action.payload.id);
      if (index !== -1) {
        state.transcriptions[index] = action.payload;
      }
    },

    removeTranscription: (state, action) => {
      // This action is called when a transcription is removed
      const index = state.transcriptions.findIndex((transcription) => transcription.id === action.payload);
      if (index !== -1) {
        state.transcriptions.splice(index, 1);
      }
    },
    createDebugTranscriptions: (state) => {
      // Generate a list of transcriptions for testing
      const states = [
        {
          state: transcriptionStatus.PROCESSING,
          progress: 40
        },
        {
          state: transcriptionStatus.STALLED,
          progress: 75
        },
        {
          state: transcriptionStatus.COMPLETE,
          progress: 100
        },
        {
          state: transcriptionStatus.IDLE,
          progress: 0
        },
        {
          state: transcriptionStatus.QUEUED,
          progress: 0
        },
        {
          state: transcriptionStatus.PENDING,
          progress: 0
        },
        {
          state: transcriptionStatus.PROCESSING,
          progress: 5
        },

        {
          state: transcriptionStatus.PROCESSING,
          progress: 100
        },

        {
          state: transcriptionStatus.UNKNOWN,
          progress: 20
        },
        {
          state: transcriptionStatus.UNKNOWN,
          progress: 0
        },

        {
          state: transcriptionStatus.CANCELLED,
          progress: 40,
          error: 'Cancelled by user'
        },
        {
          state: transcriptionStatus.ERROR,
          progress: 40,
          error: 'Error message'
        },
        {
          state: transcriptionStatus.DELETED,
          progress: 40,
          error: 'Deleted by user'
        }
      ];

      for (const [index, value] of states.entries()) {
        state.transcriptions.push({
          id: index,
          title: lorem.generateSentences(1),
          transcriptLength: 300 * index,
          description: `Test Description ${index}`,
          date: `2020-0${index}-0${index}`,
          created: `2020-0${index}-0${index}`,
          tags: ['test', 'tags', `${index}`],
          audio: 'test',
          audioTitle: lorem.generateSentences(1),
          audioAdded: `2020-0${index}-0${index}`,
          language: 'English',
          model: 'base',
          opened: false,
          length: 100 * index,
          audioFormat: 'mp3',
          transcriptVtt: undefined,
          progress: value.progress,
          status: value.state,
          translated: false,
          directory: `/test/user/desktop/output${index}.txt`,
          transcriptText: undefined,
          error: value.error
        });
      }
    },
    test: (state, action) => {
      // This action is a test action
      console.log('test');
      console.log(action.payload);
    }
  }
});

export const {
  addTranscription,
  updateTranscription,
  removeTranscription,
  test,
  setActiveTranscription,
  createDebugTranscriptions
} = transcriptionsSlice.actions;

// Export Transcription States
export const selectTranscriptions = (state: RootState) => state.transcriptions.transcriptions;
export const selectActiveTranscription = (state: RootState) => state.transcriptions.activeTranscription;
export const selectNumberOfTranscriptions = (state: RootState) => state.transcriptions.transcriptions.length;

// Export the reducer
export default transcriptionsSlice.reducer;
