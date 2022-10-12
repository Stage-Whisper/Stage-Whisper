import { ipcMain, IpcMainInvokeEvent as invoke } from 'electron';

// DB
import db from '../../database/database';

// Types
import { Entry, Line, Transcription } from 'knex/types/tables';

// README
// This file is very long and has a lot of types. This is to allow for communication via IPC between the main process and the renderer process.
// Inputs, outputs, and types are all defined here. This file is also responsible for the actual querying of the database and handling of the data.

// Query Channel Enums
export enum QUERY {
  ADD_ENTRY = 'addEntry', // Add an entry to the database
  ADD_LINE = 'addLine', // Add a line to a transcription
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
  [QUERY.ADD_TRANSCRIPTION]: { transcription: Transcription };
  [QUERY.REMOVE_ENTRY]: { entryId: string };
  [QUERY.REMOVE_LINE]: { index: number; transcriptionId: string };
  [QUERY.REMOVE_TRANSCRIPTION]: { transcriptionId: string };
  [QUERY.RESTORE_LINE]: { index: number; transcriptionId: string };
  [QUERY.UPDATE_ENTRY]: { entry: Entry };
  [QUERY.UPDATE_LINE]: { lineId: number; transcriptionId: string; line: Line };
  [QUERY.UPDATE_TRANSCRIPTION]: { transcription: Transcription };
  [QUERY.GET_ENTRY]: { entryId: string };
  [QUERY.GET_ENTRY_COUNT]: null;
  [QUERY.GET_LINE]: { lineId: number };
  [QUERY.GET_LINE_COUNT]: { transcriptionId: string };
  [QUERY.GET_TRANSCRIPTION]: { transcriptionId: string };
  [QUERY.GET_TRANSCRIPTION_COUNT]: null;
  [QUERY.GET_TRANSCRIPTION_COUNT_FOR_ENTRY]: { entryId: string };
  [QUERY.GET_ALL_ENTRIES]: null;
  [QUERY.GET_ALL_LINES]: { transcriptionId: string };
  [QUERY.GET_LATEST_LINES]: { transcriptionId: string };
  [QUERY.GET_ALL_TRANSCRIPTIONS]: null;
  [QUERY.GET_ALL_TRANSCRIPTIONS_FOR_ENTRY]: { entryId: string };
  [QUERY.GET_ALL_ENTRIES_WITH_TRANSCRIPTIONS]: null;
  [QUERY.GET_ALL_ENTRIES_WITH_LINES_AND_TRANSCRIPTIONS]: null;
};

// Query Return Types for each query
export type QueryReturn = {
  [QUERY.ADD_ENTRY]: Promise<Entry>;
  [QUERY.ADD_LINE]: Promise<Line>;
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
// CRUD Functions
// ---- CREATE ----
// Add Entry
ipcMain.handle(
  QUERY.ADD_ENTRY,
  async (_event: invoke, args: QueryArgs[QUERY.ADD_ENTRY]): QueryReturn[QUERY.ADD_ENTRY] => {
    const { entry } = args;
    const insertedEntry = (await db('entries').insert(entry).returning('*').first()) as Entry;
    return insertedEntry;
  }
);

// Add Line
ipcMain.handle(QUERY.ADD_LINE, async (_event: invoke, args: QueryArgs[QUERY.ADD_LINE]): QueryReturn[QUERY.ADD_LINE] => {
  const { line } = args;
  const insertedLine = (await db('lines').insert(line).returning('*').first()) as Line;
  return insertedLine;
});

// Add Transcription
ipcMain.handle(
  QUERY.ADD_TRANSCRIPTION,
  async (_event: invoke, args: QueryArgs[QUERY.ADD_TRANSCRIPTION]): QueryReturn[QUERY.ADD_TRANSCRIPTION] => {
    const { transcription } = args;
    const insertedTranscription = (await db('transcriptions')
      .insert(transcription)
      .returning('*')
      .first()) as Transcription;
    return insertedTranscription;
  }
);

// ---- READ ----
// Get Entry
ipcMain.handle(
  QUERY.GET_ENTRY,
  async (_event: invoke, args: QueryArgs[QUERY.GET_ENTRY]): QueryReturn[QUERY.GET_ENTRY] => {
    const { entryId } = args;
    const entry = (await db('entries').where({ uuid: entryId }).first()) as Entry;
    return entry;
  }
);

// Get Entry Count
ipcMain.handle(QUERY.GET_ENTRY_COUNT, async (): QueryReturn[QUERY.GET_ENTRY_COUNT] => {
  const entryCount = await db('entries').count('*');
  if (typeof entryCount[0].count === 'string') {
    return parseInt(entryCount[0].count, 10);
  }
  return entryCount[0].count;
});

// Get Line
ipcMain.handle(QUERY.GET_LINE, async (_event: invoke, args: QueryArgs[QUERY.GET_LINE]): QueryReturn[QUERY.GET_LINE] => {
  const { lineId } = args;
  const line = (await db('lines').where({ uuid: lineId }).first()) as Line;
  return line;
});

// Get Line Count
ipcMain.handle(
  QUERY.GET_LINE_COUNT,
  async (_event: invoke, args: QueryArgs[QUERY.GET_LINE_COUNT]): QueryReturn[QUERY.GET_LINE_COUNT] => {
    const { transcriptionId } = args;
    const lineCount = await db('lines').where({ transcription: transcriptionId }).count('*');
    if (typeof lineCount[0].count === 'string') {
      return parseInt(lineCount[0].count, 10);
    }
    return lineCount[0].count;
  }
);

// Get Transcription
ipcMain.handle(
  QUERY.GET_TRANSCRIPTION,
  async (_event: invoke, args: QueryArgs[QUERY.GET_TRANSCRIPTION]): QueryReturn[QUERY.GET_TRANSCRIPTION] => {
    const { transcriptionId } = args;
    const transcription = (await db('transcriptions').where({ uuid: transcriptionId }).first()) as Transcription;
    return transcription;
  }
);

// Get Transcription Count
ipcMain.handle(QUERY.GET_TRANSCRIPTION_COUNT, async (): QueryReturn[QUERY.GET_TRANSCRIPTION_COUNT] => {
  const transcription = await db('transcriptions').count('*');
  if (typeof transcription[0].count === 'string') {
    return parseInt(transcription[0].count, 10);
  }
  return transcription[0].count;
});

// Get Transcription Count for Entry
ipcMain.handle(
  QUERY.GET_TRANSCRIPTION_COUNT_FOR_ENTRY,
  async (
    _event: invoke,
    args: QueryArgs[QUERY.GET_TRANSCRIPTION_COUNT_FOR_ENTRY]
  ): QueryReturn[QUERY.GET_TRANSCRIPTION_COUNT_FOR_ENTRY] => {
    const { entryId } = args;
    const transcription = await db('transcriptions').where({ entry_id: entryId }).count('*');
    if (typeof transcription[0].count === 'string') {
      return parseInt(transcription[0].count, 10);
    }
    return transcription[0].count;
  }
);

// Get All Entries
ipcMain.handle(QUERY.GET_ALL_ENTRIES, async (): QueryReturn[QUERY.GET_ALL_ENTRIES] => {
  const entries = (await db('entries')) as Entry[];
  return entries;
});

// Get All Lines
ipcMain.handle(QUERY.GET_ALL_LINES, async (): QueryReturn[QUERY.GET_ALL_LINES] => {
  const lines = (await db('lines')) as Line[];
  return lines;
});

// Get Latest Lines
ipcMain.handle(
  QUERY.GET_LATEST_LINES,
  async (_event: invoke, args: QueryArgs[QUERY.GET_LATEST_LINES]): QueryReturn[QUERY.GET_LATEST_LINES] => {
    const { transcriptionId } = args;
    // Get all lines for a transcription ordered by line index, returning the one with the highest version number
    const lines = (await db('lines')
      .where({ transcription: transcriptionId })
      .orderBy('index', 'asc')
      .orderBy('version', 'desc')
      .select('*')) as Line[];
    return lines;
  }
);

// Get All Transcriptions
ipcMain.handle(QUERY.GET_ALL_TRANSCRIPTIONS, async (): QueryReturn[QUERY.GET_ALL_TRANSCRIPTIONS] => {
  const transcriptions = (await db('transcriptions')) as Transcription[];
  return transcriptions;
});

// Get All Transcriptions for Entry
ipcMain.handle(
  QUERY.GET_ALL_TRANSCRIPTIONS_FOR_ENTRY,
  async (
    _event: invoke,
    args: QueryArgs[QUERY.GET_ALL_TRANSCRIPTIONS_FOR_ENTRY]
  ): QueryReturn[QUERY.GET_ALL_TRANSCRIPTIONS_FOR_ENTRY] => {
    const { entryId } = args;
    const transcriptions = (await db('transcriptions').where({ entry: entryId })) as Transcription[];
    return transcriptions;
  }
);

// ---- UPDATE ----
// Update Entry
ipcMain.handle(
  QUERY.UPDATE_ENTRY,
  async (_event: invoke, args: QueryArgs[QUERY.UPDATE_ENTRY]): QueryReturn[QUERY.UPDATE_ENTRY] => {
    const { entry } = args;
    const updatedEntry = (await db('entries')
      .where({ uuid: entry.uuid })
      .update(entry)
      .returning('*')
      .first()) as Entry;
    return updatedEntry;
  }
);

// Update Line
ipcMain.handle(
  QUERY.UPDATE_LINE,
  async (_event: invoke, args: QueryArgs[QUERY.UPDATE_LINE]): QueryReturn[QUERY.UPDATE_LINE] => {
    const { line, transcriptionId, lineId } = args;

    // Get the line from the database
    const dbLine = (await db('lines')
      .where({ uuid: lineId })
      .where({ transcription: transcriptionId })
      .first()) as Line;

    // Create a new line object with the updated values and a higher version number
    const updatedLine = {
      ...dbLine,
      ...line,
      version: dbLine.version + 1
    };

    // Add the new line to the database and return it
    const newLine = (await db('lines').insert(updatedLine).returning('*').first()) as Line;
    return newLine;
  }
);

// Update Transcription
ipcMain.handle(
  QUERY.UPDATE_TRANSCRIPTION,
  async (_event: invoke, args: QueryArgs[QUERY.UPDATE_TRANSCRIPTION]): QueryReturn[QUERY.UPDATE_TRANSCRIPTION] => {
    const { transcription } = args;
    const updatedTranscription = (await db('transcriptions')
      .where({ uuid: transcription.uuid })
      .update(transcription)
      .returning('*')
      .first()) as Transcription;
    return updatedTranscription;
  }
);

// ---- DELETE ----
// Delete Entry
ipcMain.handle(
  QUERY.REMOVE_ENTRY,
  async (_event: invoke, args: QueryArgs[QUERY.REMOVE_ENTRY]): QueryReturn[QUERY.REMOVE_ENTRY] => {
    const { entryId } = args;
    await db('entries').where({ uuid: entryId }).del();
    return true;
  }
);

// Delete Line
ipcMain.handle(
  QUERY.REMOVE_LINE,
  async (_event: invoke, args: QueryArgs[QUERY.REMOVE_LINE]): QueryReturn[QUERY.REMOVE_LINE] => {
    const { index, transcriptionId } = args;

    // Set deleted flag on all lines with the given index in the given transcription
    await db('lines').where({ index }).where({ transcription: transcriptionId }).update({ deleted: true });

    return true;
  }
);

export default ipcMain;
