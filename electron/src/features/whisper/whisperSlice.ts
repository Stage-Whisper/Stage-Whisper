import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RunWhisperResponse } from '../../../electron/types/channels';
// import { RunWhisperResponse } from '../../../electron/types/channels';
import { entry } from '../../../electron/types/types';
import { WhisperArgs } from '../../../electron/types/whisperTypes';
// import { WhisperArgs } from '../../../electron/types/whisperTypes';
// import { RootState } from '../../redux/store';

// WhisperSlice
// Slice for managing requests to whisper and the queue of requests

export type queueEntry = {
  // Represents an entry in the queue
  transcription_id?: string; // Id of the transcription
  entry: entry; // Entry that requested the transcription
  status: 'idle' | 'loading' | 'succeeded' | 'failed'; // Status of the transcription
};

export type whisperState = {
  // Represents the state of the whisper slice
  queue: queueEntry[]; // Queue of transcriptions
  activeEntry: queueEntry | null; // Id of the active entry
  status:
    | 'idle' // idle: no transcriptions are running, will attempt to run the next transcription in the queue
    | 'loading' // loading: a transcription is running
    | 'succeeded' // succeeded: the last transcription was successful
    | 'failed' // failed: the last transcription failed
    | 'disabled'; // disabled: adding new transcriptions to the queue is disabled
};

const initialState: whisperState = {
  queue: [],
  activeEntry: null,
  status: 'disabled'
};

export const passToWhisper = createAsyncThunk(
  // A promise that will be resolved when the transcription is complete
  'whisper/passToWhisper',
  async ({ entry, args }: { entry: entry; args?: WhisperArgs }): Promise<RunWhisperResponse> => {
    if (!args) {
      args = {
        inputPath: entry.audio.path
      };
    }
    const result = await window.Main.runWhisper(args, entry);
    console.log('passToWhisper result', result);
    if (result) {
      return result;
    } else {
      throw { error: 'Error running whisper' };
    }
  }
);

export const whisperSlice = createSlice({
  name: 'whisper',
  initialState,
  reducers: {
    addToQueue: (state, action: PayloadAction<entry>) => {
      // Add an entry to the queue
      state.queue.push({ entry: action.payload, status: 'idle' });
    },
    removeFromQueue: (state, action: PayloadAction<entry>) => {
      // Remove an entry from the queue
      state.queue = state.queue.filter((entry) => entry.entry.config.uuid !== action.payload.config.uuid);
    },
    setStatus: (state, action: PayloadAction<'idle' | 'loading' | 'succeeded' | 'failed' | 'disabled'>) => {
      // Set the status of the queue
      state.status = action.payload;
    },
    setActiveEntry: (state, action: PayloadAction<queueEntry | null>) => {
      // Set the active entry
      state.activeEntry = action.payload;
    },
    setQueue: (state, action: PayloadAction<queueEntry[]>) => {
      // Set the queue
      state.queue = action.payload;
    },
    clearQueue: (state) => {
      // Clear the queue
      state.queue = [];
    },
    clearActiveEntry: (state) => {
      // Clear the active entry
      state.activeEntry = null;
    },
    clearStatus: (state) => {
      // Clear the status
      state.status = 'idle';
    }
  },
  extraReducers: (builder) => {
    // Thunk for running the whisper transcribe
    builder.addCase(passToWhisper.pending, (state) => {
      // Whisper is running the transcription for the active entry
      console.log('Redux: passToWhisper: Pending');
      state.status = 'loading';
    });
    builder.addCase(passToWhisper.fulfilled, (state, action) => {
      // Whisper has finished running the transcription for the active entry
      console.log('Redux: passToWhisper: Fulfilled');
      state.status = 'succeeded';
      if (state.activeEntry) {
        state.activeEntry.status = 'succeeded';
      }
    });
    builder.addCase(passToWhisper.rejected, (state, action) => {
      // Whisper has failed to run the transcription for the active entry
      console.log('Redux: passToWhisper: Rejected');
      state.status = 'failed';
      if (state.activeEntry) {
        state.activeEntry.status = 'failed';
      }
    });
  }
});

export const {
  addToQueue,
  removeFromQueue,
  setStatus,
  setActiveEntry,
  setQueue,
  clearQueue,
  clearActiveEntry,
  clearStatus
} = whisperSlice.actions;

export default whisperSlice.reducer;
