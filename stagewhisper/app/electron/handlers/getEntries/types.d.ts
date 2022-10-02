import { WhisperArgs } from '../../whisperTypes';
// Response to a request for the app data from "get-entries"

// Entry Config Object
export interface entryConfig {
  title: string; // Title of the entry
  created: Date; // Date the entry was created
  inQueue: boolean; // If the entry is in the queue
  queueWeight: number; // Absolute value of the queue weight, 0 is the highest priority
  // ie, when we add a new job to the queue we set that job's priority to the highest queue weight value for an entry with inQueue === true,
  // when the job is done we set inQueue to false and set the queue weight to 0
  //  - this way the queue is always sorted by the queue weight and we don't have to update the queue every time a new job is added
}

// Entry Audio Object
// Represents the information about the audio file for an entry
export interface AudioParameters {
  type: string; // TODO: Change to enum with whisper accepted types
  path: string; // Path to the audio file
  language: WhisperArgs['language']; // Language of the audio file
  addedOn: Date; // Date the audio file was added
}

// Entry Transcription Object
// Represents a completed transcription for an entry
export interface entryTranscription {
  uuid: string; // UUID of the transcription
  transcribedOn: Date; // Date the transcription was completed
  path: string; // Path to the transcription folder
  model: WhisperArgs['model']; // Model used to transcribe the audio
  language: WhisperArgs['language']; // Language of the audio file
  vtt: string; // The transcript in vtt format
}

// An entry object - represents
export interface entry {
  uuid: string; // UUID of the entry
  config: entryConfig; // Entry Config Object
  audio: AudioParameters; // Entry Audio Object
  path: string; // Path to the entry folder
  transcriptions: entryTranscription[] | []; // Array of Entry Transcription Objects
}
