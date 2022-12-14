import type {Transcription, Entry} from 'knex/types/tables';
// Response from the export transcription handler
export type ExportTranscriptionResponse = {
  outputDir: string;
};

// Response from the whisper handler
export type RunWhisperResponse = {
  transcription: Transcription;
  entry: Entry;
};

// Create new entry and add it to the database
export type newEntryArgs = {
  filePath: Entry['audio_path'];
  name: Entry['name'];
  description: Entry['description'];
  audio_type: Entry['audio_type'];
  audio_language: Entry['audio_language'];
  audio_name: Entry['audio_name'];
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
