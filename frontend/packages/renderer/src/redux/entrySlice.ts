// Api
import * as api from '#preload';

// Redux
import type {RootState} from './store';

// Packages
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

// Types
import type {PayloadAction} from '@reduxjs/toolkit';
import type {Entry, Line, Transcription} from '@prisma/client';
import type {WhisperArgs} from '../../../../types/whisper';

export interface ReduxEntry extends Entry {
  transcriptions: Transcription[];
}

export interface entryState {
  entries: ReduxEntry[];
  activeEntry: string | null;
  get_files_status: 'idle' | 'loading' | 'succeeded' | 'failed' | 'not_found';
  trigger_whisper_status: 'idle' | 'loading' | 'succeeded' | 'failed';
  activeLines: Line[];
}

const initialState: entryState = {
  entries: [],
  activeEntry: null,
  // Thunk State for accessing local files via electron
  get_files_status: 'idle',
  trigger_whisper_status: 'idle',
  activeLines: [],
};

// Thunk for loading the entries from the database
export const getLocalFiles = createAsyncThunk(
  'entries/getLocalFiles',
  async (): Promise<{entries?: ReduxEntry[]; error?: string}> => {
    // Set Input State to loading

    // Get all entries
    const entryResult = await api.getAllEntries();
    // Check if null
    if (!entryResult) {
      return {error: 'Error loading database'};
    } else {
      let reduxEntries: ReduxEntry[] = [];
      // Get all transcriptions
      const transcriptionResult = await api.getAllTranscriptions();
      // Check if null
      if (transcriptionResult) {
        entryResult.entries.forEach(entry => {
          // Get all transcriptions for the entry
          const transcriptions = transcriptionResult.transcriptions.filter(
            transcription => transcription.entryId === entry.uuid,
          );
          // Add the transcriptions to the entry
          reduxEntries.push({...entry, transcriptions});
        });
      } else {
        // Add the entries without transcriptions
        reduxEntries = entryResult.entries.map(entry => ({...entry, transcriptions: []}));
      }
      // Return the entries
      return {entries: reduxEntries};
    }
  },
);

export const fetchLineAsync = createAsyncThunk(
  'entries/fetchLine',
  async (args: {line: Line}): Promise<{line: Line}> => {
    const {line} = args;
    const lineResult = await api.getLine({lineUUID: line.uuid});

    if (!lineResult) {
      throw new Error('Error loading line');
    } else {
      return {line: lineResult.line};
    }
  },
);

export const whisperTranscribe = createAsyncThunk(
  'entries/whisperTranscribe',
  async (entry: ReduxEntry): Promise<{result?: Awaited<api.runWhisperReturn>; error?: string}> => {
    const args: WhisperArgs = {
      inputPath: entry.audio_path,
    };

    const result = await api.runWhisper({
      entryUUID: entry.uuid,
      whisperArgs: args,
    });

    console.log('whisperTranscribe result', result);

    if (!result) {
      throw new Error('Error running whisper');
    } else {
      return {result};
    }
  },
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
      state.activeLines = action.payload;
    },
  },
  extraReducers(builder) {
    // Thunk for loading the transcriptions from the database
    builder.addCase(getLocalFiles.pending, state => {
      state.get_files_status = 'loading';
    });
    builder.addCase(getLocalFiles.fulfilled, (state, action) => {
      if (action.payload.entries) {
        state.entries = action.payload.entries;
      }
      state.get_files_status = 'succeeded';
    });
    builder.addCase(getLocalFiles.rejected, state => {
      state.get_files_status = 'idle';
    });

    // Get Line Cases
    builder.addCase(fetchLineAsync.pending, () => {
      console.log('fetchLine: Pending');
    });
    builder.addCase(fetchLineAsync.fulfilled, (state, action) => {
      console.log('fetchLine: Fulfilled');

      const {line} = action.payload;
      const lineIndex = state.activeLines.findIndex(l => l.index === line.index);
      if (lineIndex !== -1) {
        const arrayIndex = state.activeLines.findIndex(l => l.index === line.index);
        state.activeLines[arrayIndex] = line;
      }
    });
  },
});

export const {setActiveEntry, setLines} = entrySlice.actions;

// Export Entry States
export const selectEntries = (state: RootState) => state.entries.entries;
export const selectActiveEntry = (state: RootState) => state.entries.activeEntry;
export const selectNumberOfEntries = (state: RootState) => state.entries.entries.length;
export const selectActiveLines = (state: RootState) => state.entries.activeLines;

// Export the reducer
export default entrySlice.reducer;
