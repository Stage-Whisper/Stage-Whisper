import { Entry, Line, Transcription } from 'knex/types/tables';

// Query Channel Enums
export enum QUERY {
  ADD_ENTRY = 'addEntry', // Add an entry to the database
  ADD_LINE = 'addLine', // Add a line to a transcription
  ADD_LINES = 'addLines', // Add multiple lines to a transcription
  ADD_TRANSCRIPTION = 'addTranscription', // Add a transcription to an entry
  REMOVE_ENTRY = 'removeEntry', // Remove an entry from the database and all associated lines and transcriptions
  REMOVE_LINE = 'removeLine', // Remove a line from a transcription (just marks it as deleted)
  REMOVE_TRANSCRIPTION = 'removeTranscription', // Remove a transcription from an entry and all lines associated with it
  RESTORE_LINE = 'restoreLine', // Restore a line from the trash
  UPDATE_ENTRY = 'updateEntry', // Update an entry in the database
  UPDATE_LINE = 'updateLine', // Update a line in a transcription
  UPDATE_TRANSCRIPTION = 'updateTranscription', // Update a transcription in an entry
  GET_ENTRY = 'getEntry', // Get an entry from the database
  GET_ENTRY_COUNT = 'getEntryCount', // Get the number of entries in the database
  GET_LINE = 'getLine', // Get a line from a transcription
  GET_LINE_COUNT = 'getLineCount', // Get the number of lines in a transcription
  GET_TRANSCRIPTION = 'getTranscription', // Get a transcription from an entry
  GET_TRANSCRIPTION_COUNT = 'getTranscriptionCount', // Get the total number of transcriptions
  GET_TRANSCRIPTION_COUNT_FOR_ENTRY = 'getTranscriptionCountForEntry', // Get the number of transcriptions in an entry
  GET_ALL_ENTRIES = 'getAllEntries', // Get all entries from the database
  GET_ALL_LINES = 'getAllLines', // Get all lines for a transcription
  GET_LATEST_LINES = 'getLatestLines', // Get the latest lines for a transcription
  GET_ALL_TRANSCRIPTIONS = 'getAllTranscriptions', // Get all transcriptions
  GET_ALL_TRANSCRIPTIONS_FOR_ENTRY = 'getAllTranscriptionsForEntry', // Get all transcriptions for an entry
  GET_ALL_ENTRIES_WITH_TRANSCRIPTIONS = 'getAllEntriesWithTranscriptions', // Get all entries with transcriptions
  GET_ALL_ENTRIES_WITH_LINES_AND_TRANSCRIPTIONS = 'getAllEntriesWithLinesAndTranscriptions' // Get all entries with lines and transcriptions
}
// Query Arguments for each query
export type QueryArgs = {
  [QUERY.ADD_ENTRY]: { entry: Entry };
  [QUERY.ADD_LINE]: { line: Line };
  [QUERY.ADD_LINES]: { lines: Line[] };
  [QUERY.ADD_TRANSCRIPTION]: { transcription: Transcription };
  [QUERY.REMOVE_ENTRY]: { entryUUID: string };
  [QUERY.REMOVE_LINE]: { index: number; transcriptionUUID: string };
  [QUERY.REMOVE_TRANSCRIPTION]: { transcriptionUUID: string };
  [QUERY.RESTORE_LINE]: { line: Line };
  [QUERY.UPDATE_ENTRY]: { entry: Entry };
  [QUERY.UPDATE_LINE]: { line: Line };
  [QUERY.UPDATE_TRANSCRIPTION]: { transcription: Transcription };
  [QUERY.GET_ENTRY]: { entryUUID: string };
  [QUERY.GET_ENTRY_COUNT]: null;
  [QUERY.GET_LINE]: { lineUUID: number };
  [QUERY.GET_LINE_COUNT]: { transcriptionUUID: string };
  [QUERY.GET_TRANSCRIPTION]: { transcriptionUUID: string };
  [QUERY.GET_TRANSCRIPTION_COUNT]: null;
  [QUERY.GET_TRANSCRIPTION_COUNT_FOR_ENTRY]: { entryUUID: string };
  [QUERY.GET_ALL_ENTRIES]: null;
  [QUERY.GET_ALL_LINES]: { transcriptionUUID: string };
  [QUERY.GET_LATEST_LINES]: { transcriptionUUID: string };
  [QUERY.GET_ALL_TRANSCRIPTIONS]: null;
  [QUERY.GET_ALL_TRANSCRIPTIONS_FOR_ENTRY]: { entryUUID: string };
  [QUERY.GET_ALL_ENTRIES_WITH_TRANSCRIPTIONS]: null;
  [QUERY.GET_ALL_ENTRIES_WITH_LINES_AND_TRANSCRIPTIONS]: null;
};

// Query Return Types for each query
export type QueryReturn = {
  [QUERY.ADD_ENTRY]: Promise<Entry>;
  [QUERY.ADD_LINE]: Promise<Line>;
  [QUERY.ADD_LINES]: Promise<Line[]>;
  [QUERY.ADD_TRANSCRIPTION]: Promise<Transcription>;
  [QUERY.REMOVE_ENTRY]: Promise<boolean>;
  [QUERY.REMOVE_LINE]: Promise<boolean>;
  [QUERY.REMOVE_TRANSCRIPTION]: Promise<boolean>;
  [QUERY.RESTORE_LINE]: Promise<Line>;
  [QUERY.UPDATE_ENTRY]: Promise<Entry>;
  [QUERY.UPDATE_LINE]: Promise<Line>;
  [QUERY.UPDATE_TRANSCRIPTION]: Promise<Transcription>;
  [QUERY.GET_ENTRY]: Promise<Entry>;
  [QUERY.GET_ENTRY_COUNT]: Promise<number>;
  [QUERY.GET_LINE]: Promise<Line>;
  [QUERY.GET_LINE_COUNT]: Promise<number>;
  [QUERY.GET_TRANSCRIPTION]: Promise<Transcription>;
  [QUERY.GET_TRANSCRIPTION_COUNT]: Promise<number>;
  [QUERY.GET_TRANSCRIPTION_COUNT_FOR_ENTRY]: Promise<number>;
  [QUERY.GET_ALL_ENTRIES]: Promise<Entry[]>;
  [QUERY.GET_ALL_LINES]: Promise<Line[]>;
  [QUERY.GET_LATEST_LINES]: Promise<Line[]>;
  [QUERY.GET_ALL_TRANSCRIPTIONS]: Promise<Transcription[]>;
  [QUERY.GET_ALL_TRANSCRIPTIONS_FOR_ENTRY]: Promise<Transcription[]>;
  [QUERY.GET_ALL_ENTRIES_WITH_TRANSCRIPTIONS]: Promise<Entry[]>;
  [QUERY.GET_ALL_ENTRIES_WITH_LINES_AND_TRANSCRIPTIONS]: Promise<Entry[]>;
};
