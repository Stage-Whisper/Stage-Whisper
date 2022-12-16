import { showNotification, updateNotification } from '@mantine/notifications';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Entry } from '@prisma/client';
import { RunWhisperResponse } from '../../../electron/handlers/runWhisper/runWhisper';

// import { RunWhisperResponse } from '../../../electron/types/channels';

import { WhisperArgs } from '../../../electron/types/whisperTypes';
import { RootState } from '../../redux/store';

// WhisperSlice
// Slice for managing requests to whisper and the queue of requests

export type WhisperState = {
  // Represents the current whisper that is processing, used for async logic
  transcription_uuid?: string; // Id of the completed transcription
  entry?: Entry; // Entry that requested the transcription
  status: 'idle' | 'loading' | 'succeeded' | 'failed'; // Status of the transcription
};

const initialState: WhisperState = {
  transcription_uuid: undefined,
  entry: undefined,
  status: 'idle'
};

export const passToWhisper = createAsyncThunk(
  // A promise that will be resolved when the transcription is complete
  'whisper/passToWhisper',
  async ({ entry, args }: { entry: Entry; args?: WhisperArgs }): Promise<RunWhisperResponse> => {
    // If no arguments are passed, use the audio path as the input
    // Other arguments will be set to default values in the electron handler
    if (!args) {
      args = {
        inputPath: entry.audio_path
      };
    }

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
      showNotification({
        id: 'transcribing',
        title: `Transcribing`,
        message: `Transcribing audio ${action.meta.arg.entry.audio_name}`,
        disallowClose: true,
        autoClose: false,
        color: 'blue',
        loading: true
      });
      // Set the entry to the current entry
      state.entry = action.meta.arg.entry;
    });

    builder.addCase(passToWhisper.fulfilled, (state) => {
      // Whisper has finished running the transcription for the active entry

      // Clear notification
      updateNotification({
        id: 'transcribing',
        title: `Transcription complete!`,
        message: `Transcription complete for ${state.entry?.audio_name}`,
        disallowClose: false,
        color: 'green',
        loading: false,
        autoClose: 3000
      });
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
