import { entry } from './types';
// List of all channels used by electron IPC

export enum Channels {
  // Utility channels
  deleteStore = 'delete-store',
  openDirectoryDialog = 'open-directory-dialog', // Trigger a directory picker
  audioPlayback = 'audio-playback', // Control audio playback

  // Database channels
  loadDatabase = 'load-database', // Loads all entries from the database and returns them
  newEntry = 'new-entry', // Creates a new entry in the database and returns it

  // Whisper channels
  runWhisper = 'run-whisper', // Runs the whisper model with given arguments and returns the entry
  whisperComplete = 'whisper-complete', // Returns the entry and path to the transcription
  transcriptionComplete = 'transcription-complete', // Transcription complete event - Triggers WebContents.send
  whisperError = 'whisper-error' // Returns the error message
}

// Channel Response Types
// Audio Playback Response
export type audioPlaybackResponse = {
  success: boolean;
  state: 'playing' | 'paused' | 'stopped';
};

// Delete Store Response
export interface DeleteStoreResponse {
  success?: boolean;
  message?: string;
}

// Response type for the openDirectoryDialog channel
export interface OpenDirectoryDialogResponse {
  path: string | null;
}

// Response type for the load-database channel
export type LoadDatabaseResponse = {
  entries: entry[];
  error?: string;
};

// Response type for the new-entry channel
export type NewEntryResponse = {
  entry: entry;
};

// Response type for the run-whisper channel
export type RunWhisperResponse = {
  transcription_uuid: string;
  outputDir: string;
  entry: entry;
  transcribedOn: string;
};

// Response type for the whisper-complete channel
export type WhisperCompleteResponse = {
  outputDir: string;
  code: number;
  entry: entry;
  uuid: string;
};

// Response type for the whisper-error channel
export type WhisperErrorResponse = {
  transcription_uuid: string;
  error: string;
  entry: entry;
};
