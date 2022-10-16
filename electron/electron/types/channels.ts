import { Entry } from 'knex/types/tables';

// List of all channels used by electron IPC

export enum Channels {
  // Utility channels
  DELETE_STORE = 'delete-store',
  OPEN_DIR_DIALOG = 'open-directory-dialog', // Trigger a directory picker
  FETCH_AUDIO_FILE = 'fetch-audio-file', // Convert an audio file to a Uint8Array and send it back to the renderer

  // Database channels
  QUERY_DATABASE = 'query-database', // Loads all entries from the database and returns them
  newEntry = 'new-entry', // Creates a new entry in the database and returns it
  exportTranscription = 'export-transcription', // Exports a transcription to a file

  // Whisper channels
  runWhisper = 'run-whisper', // Runs the whisper model with given arguments and returns the entry
  whisperComplete = 'whisper-complete', // Returns the entry and path to the transcription
  transcriptionComplete = 'transcription-complete', // Transcription complete event - Triggers WebContents.send
  whisperError = 'whisper-error' // Returns the error message
}

// Channel Response Types\
// Delete Store Response
export interface DeleteStoreResponse {
  success?: boolean;
  message?: string;
}

// Response type for the openDirectoryDialog channel
export interface OpenDirectoryDialogResponse {
  path: string | null;
}

// Response type for the new-entry channel
export type NewEntryResponse = {
  entry: Entry;
};

// Response type for the whisper-complete channel
export type WhisperCompleteResponse = {
  outputDir: string;
  code: number;
  entry: Entry;
  uuid: string;
};

// Response type for the whisper-error channel
export type WhisperErrorResponse = {
  transcription_uuid: string;
  error: string;
  entry: Entry;
};
