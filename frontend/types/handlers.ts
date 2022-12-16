import type {Entry} from '@prisma/client';

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
