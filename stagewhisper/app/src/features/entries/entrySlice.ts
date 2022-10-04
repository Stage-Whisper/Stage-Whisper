import { RootState } from '../../redux/store';
// Transcription Slice
// This holds the state of the transcriptions and will be updated by electron/node processes

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { entry } from '../../../electron/types';

export interface entryState {
  entries: entry[];
  activeEntry: string | null;
  thunk_status: 'idle' | 'loading' | 'succeeded' | 'failed' | 'not_found';
}

const initialState: entryState = {
  entries: [],
  activeEntry: null,
  // Thunk State for accessing local files via electron
  thunk_status: 'idle'
};

// Thunk for loading the transcriptions from the database
export const getLocalFiles = createAsyncThunk(
  'entries/getLocalFiles',
  async (): Promise<{ entries?: entry[]; error?: string }> => {
    // Set Input State to loading
    const result = await window.Main.loadDatabase();
    console.log('getLocalFiles result', result);

    if (result) {
      return { entries: result.entries };
    } else {
      return { error: 'Error loading database' };
    }
  }
);

export const entrySlice = createSlice({
  name: 'entries',
  initialState,
  reducers: {
    setActiveEntry: (state, action) => {
      // This action is called when a transcription is opened by the user
      state.activeEntry = action.payload;
    },

    addEntry: (state, action) => {
      // This action is called when a transcription is added
      state.entries.push(action.payload);
    },

    updateEntry: (state, action) => {
      // FIXME: Convert to use electron
      // This action is called when a transcription is updated
      const index = state.entries.findIndex((entry) => entry.config.uuid === action.payload.id);
      if (index !== -1) {
        state.entries[index] = action.payload;
      }
    },

    removeEntry: (state, action) => {
      // FIXME: Convert to use electron to remove from database
      // This action is called when a transcription is removed
      const index = state.entries.findIndex((entry) => entry.config.uuid === action.payload);
      if (index !== -1) {
        state.entries.splice(index, 1);
      }
    },
    test: (state, action) => {
      // This action is a test action
      console.log('test');
      console.log(action.payload);
    }
  },
  extraReducers(builder) {
    // Update the transcription thunk_status when a thunk is called
    builder.addCase(getLocalFiles.pending, (state) => {
      console.log('Getting Local Files: Pending');
      state.thunk_status = 'loading';
    });
    builder.addCase(getLocalFiles.fulfilled, (state, action) => {
      console.log('Getting Local Files: Fulfilled');
      console.log('action.payload', action.payload);
      if (action.payload.entries) {
        state.entries = action.payload.entries;
        console.log('state.entries', state.entries);
      }
      state.thunk_status = 'succeeded';
    });
    builder.addCase(getLocalFiles.rejected, (state) => {
      console.log('Getting Local Files: Rejected');
      state.thunk_status = 'idle';
    });
  }
});

export const { addEntry, updateEntry, removeEntry, test, setActiveEntry } = entrySlice.actions;

// Export Transcription States
export const selectEntries = (state: RootState) => state.entries.entries;
export const selectActiveEntry = (state: RootState) => state.entries.activeEntry;
export const selectNumberOfEntries = (state: RootState) => state.entries.entries.length;

// Export the reducer
export default entrySlice.reducer;
