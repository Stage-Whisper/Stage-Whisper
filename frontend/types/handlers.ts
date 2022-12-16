import type {Entry} from '@prisma/client';

// Response from the export transcription handler
export type ExportTranscriptionResponse = {
  outputDir: string;
};

// Response type for the openDirectoryDialog channel
export interface OpenDirectoryDialogResponse {
  path: string | null;
}

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
