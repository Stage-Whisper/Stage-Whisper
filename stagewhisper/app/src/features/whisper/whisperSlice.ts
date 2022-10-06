import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RunWhisperResponse } from '../../../electron/types/channels';
// import { RunWhisperResponse } from '../../../electron/types/channels';
import { entry } from '../../../electron/types/types';
import { WhisperArgs } from '../../../electron/types/whisperTypes';
import { RootState } from '../../redux/store';

// WhisperSlice
// Slice for managing requests to whisper and the queue of requests

export type WhisperState = {
  // Represents the current whisper that is processing, used for async logic
  transcription_uuid?: string; // Id of the completed transcription
  entry?: entry; // Entry that requested the transcription
  status: 'idle' | 'loading' | 'succeeded' | 'failed'; // Status of the transcription
};

const initialState: WhisperState = {
  transcription_uuid: undefined,
  entry: undefined,
  status: 'idle'
};

/* 
  Note! 
  Due to limitations in the ability for thunks to call other thunks, logic for the handling of queueing will probably have to be in react components
  This is because the thunk cannot call itself, and the thunk cannot call another thunk. I have removed the queueing logic from this file for now.
  @oenu
*/

export const passToWhisper = createAsyncThunk(
  // A promise that will be resolved when the transcription is complete
  'whisper/passToWhisper',
  async ({ entry, args }: { entry: entry; args?: WhisperArgs }): Promise<RunWhisperResponse> => {
    // If no arguments are passed, use the audio path as the input
    // Other arguments will be set to default values in the electron handler
    if (!args) {
      args = {
        inputPath: entry.audio.path
      };
    }
    // Update the status with the entry that is being processed

    // Send the request to the electron handler
    const result = await window.Main.runWhisper(args, entry); // Resolves when the transcription is complete
    // Result of the transcription

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
    resetWhisper: (state) => {
      // Reset the state of the whisper
      state.transcription_uuid = undefined;
      state.entry = undefined;
      state.status = 'idle';
    }
  },
  extraReducers: (builder) => {
    // Thunk for running the whisper transcribe
    builder.addCase(passToWhisper.pending, (state, action) => {
      // Set the status to loading
      state.status = 'loading';

      // Set the entry to the current entry
      state.entry = action.meta.arg.entry;
    });

    builder.addCase(passToWhisper.fulfilled, (state) => {
      // Whisper has finished running the transcription for the active entry

      // Reset the entry
      state.entry = undefined;

      // Set the status to succeeded
      state.status = 'succeeded';
    });
  }
});
export const selectTranscribingStatus = (state: RootState) => {
  return {
    status: state.whisper.status,
    entry: state.whisper.entry
  };
};

export const { resetWhisper } = whisperSlice.actions;

export default whisperSlice.reducer;
