import { RootState } from '../../redux/store';

// Transcription Slice
// This holds the state of the transcriptions and will be updated by electron/node processes

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { WhisperArgs } from '../../../electron/types/whisperTypes';
import { Entry, Line, Transcription } from 'knex/types/tables';
import { RunWhisperResponse } from '../../../electron/handlers/runWhisper/runWhisper';

export interface ReduxEntry extends Entry {
  transcriptions: Transcription[];
}

export interface entryState {
  entries: ReduxEntry[];
  activeEntry: string | null;
  get_files_status: 'idle' | 'loading' | 'succeeded' | 'failed' | 'not_found';
  trigger_whisper_status: 'idle' | 'loading' | 'succeeded' | 'failed';
  lines: Line[];
}

const initialState: entryState = {
  entries: [],
  activeEntry: null,
  // Thunk State for accessing local files via electron
  get_files_status: 'idle',
  trigger_whisper_status: 'idle',
  lines: []
};

// Thunk for loading the transcriptions from the database
export const getLocalFiles = createAsyncThunk(
  'entries/getLocalFiles',
  async (): Promise<{ entries?: ReduxEntry[]; error?: string }> => {
    // Set Input State to loading
    const entryResult = (await window.Main.GET_ALL_ENTRIES()) as Entry[];
    const transResult = (await window.Main.GET_ALL_TRANSCRIPTIONS()) as Transcription[];

    // Attach transcriptions to entries
    const entries = entryResult.map((entry): ReduxEntry => {
      const transcriptions = transResult.filter((transcription) => transcription.entry === entry.uuid);
      return { ...entry, transcriptions };
    });

    if (entries) {
      return { entries };
    } else {
      return { error: 'Error loading database' };
    }
  }
);

export const whisperTranscribe = createAsyncThunk(
  'entries/whisperTranscribe',
  async (entry: ReduxEntry): Promise<{ result?: RunWhisperResponse; error?: string }> => {
    const args: WhisperArgs = {
      inputPath: entry.audio_path
    };

    const result = await window.Main.runWhisper(args, entry);

    console.log('whisperTranscribe result', result);

    if (result) {
      return { result };
    } else {
      throw { error: 'Error running whisper' };
    }
  }
);

export const entrySlice = createSlice({
  name: 'entries',
  initialState,
  reducers: {
    setActiveEntry: (state, action: PayloadAction<ReduxEntry | null>) => {
      // This action is called when a entry is opened by the user

      if (action.payload) {
        state.activeEntry = action.payload.uuid;
      } else {
        state.activeEntry = null;
      }
    },
    setLines: (state, action: PayloadAction<Line[]>) => {
      state.lines = action.payload;
    }
  },
  extraReducers(builder) {
    // Thunk for loading the transcriptions from the database
    builder.addCase(getLocalFiles.pending, (state) => {
      console.log('Getting Local Files: Pending');
      state.get_files_status = 'loading';
    });
    builder.addCase(getLocalFiles.fulfilled, (state, action) => {
      console.log('Getting Local Files: Fulfilled');
      console.log('action.payload', action.payload);
      if (action.payload.entries) {
        state.entries = action.payload.entries;
        console.log('state.entries', state.entries);
      }
      state.get_files_status = 'succeeded';
    });
    builder.addCase(getLocalFiles.rejected, (state) => {
      console.log('Getting Local Files: Rejected');
      state.get_files_status = 'idle';
    });
  }
});

export const { setActiveEntry, setLines } = entrySlice.actions;

// Export Entry States
export const selectEntries = (state: RootState) => state.entries.entries;
export const selectActiveEntry = (state: RootState) => state.entries.activeEntry;
export const selectNumberOfEntries = (state: RootState) => state.entries.entries.length;
export const selectLines = (state: RootState) => state.entries.lines;

// Export the reducer
export default entrySlice.reducer;
