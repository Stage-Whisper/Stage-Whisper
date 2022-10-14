import { ipcMain, IpcMainInvokeEvent as invoke, IpcMainInvokeEvent } from 'electron';
import { v4 as uuidv4 } from 'uuid';
// DB
import db from '../../database/database';

// Types
import { Entry, Line, Transcription } from 'knex/types/tables';
import { QUERY, QueryArgs, QueryReturn } from '../../types/queries';

// README
// This file is very long and has a lot of types. This is to allow for communication via IPC between the main process and the renderer process.
// Inputs, outputs, and types are all defined here. This file is also responsible for the actual querying of the database and handling of the data.

console.log('queryDatabase.ts: Loading...');

// CRUD Functions
// ---- CREATE ----
// Add Entry

ipcMain.handle(
  QUERY.ADD_ENTRY,
  async (_event: IpcMainInvokeEvent, args: QueryArgs[QUERY.ADD_ENTRY]): QueryReturn[QUERY.ADD_ENTRY] => {
    const { entry } = args;
    const insertedEntry = (await db('entries').insert(entry).returning('*')) as Entry[];
    return insertedEntry[0];
  }
);

// Add Line
ipcMain.handle(QUERY.ADD_LINE, async (_event: invoke, args: QueryArgs[QUERY.ADD_LINE]): QueryReturn[QUERY.ADD_LINE] => {
  const { line } = args;
  const insertedLine = (await db('lines').insert(line).returning('*')) as Line[];
  return insertedLine[0];
});

// Add Lines
ipcMain.handle(
  QUERY.ADD_LINES,
  async (_event: invoke, args: QueryArgs[QUERY.ADD_LINES]): QueryReturn[QUERY.ADD_LINES] => {
    const { lines } = args;
    const insertedLines = (await db('lines').insert(lines).returning('*')) as Line[];
    return insertedLines;
  }
);

// Add Transcription

ipcMain.handle(
  QUERY.ADD_TRANSCRIPTION,
  async (_event: invoke, args: QueryArgs[QUERY.ADD_TRANSCRIPTION]): QueryReturn[QUERY.ADD_TRANSCRIPTION] => {
    const { transcription } = args;
    const insertedTranscription = (await db('transcriptions').insert(transcription).returning('*')) as Transcription[];
    return insertedTranscription[0];
  }
);

// ---- READ ----
// Get Entry
ipcMain.handle(
  QUERY.GET_ENTRY,
  async (_event: invoke, args: QueryArgs[QUERY.GET_ENTRY]): QueryReturn[QUERY.GET_ENTRY] => {
    const { entryUUID } = args;
    const entry = (await db('entries').where({ uuid: entryUUID }).first()) as Entry;
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
  const { lineUUID } = args;
  const line = (await db('lines').where({ uuid: lineUUID }).first()) as Line;
  return line;
});

// Get Line Count
ipcMain.handle(
  QUERY.GET_LINE_COUNT,
  async (_event: invoke, args: QueryArgs[QUERY.GET_LINE_COUNT]): QueryReturn[QUERY.GET_LINE_COUNT] => {
    const { transcriptionUUID } = args;
    const lineCount = await db('lines').where({ transcription: transcriptionUUID }).count('*');
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
    const { transcriptionUUID } = args;
    const transcription = (await db('transcriptions').where({ uuid: transcriptionUUID }).first()) as Transcription;
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
    const { entryUUID } = args;
    const transcription = await db('transcriptions').where({ entry_id: entryUUID }).count('*');
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
    const { transcriptionUUID } = args;

    // Get the lines for a transcription, ordered by index, with only the highest version of each line
    const lines = (await db('lines')
      .where({ transcription: transcriptionUUID })
      .orderBy('index', 'asc')
      .orderBy('version', 'desc')) as Line[];

    console.log('line length:' + lines.length);

    // Get the line at each index which has the highest version
    const latestLines = lines.reduce((acc: Line[], line: Line) => {
      if (acc.length === 0) {
        acc.push(line);
      } else {
        const lastLine = acc[acc.length - 1];
        if (lastLine.index === line.index) {
          if (lastLine.version < line.version) {
            acc.pop();
            acc.push(line);
          }
        } else {
          acc.push(line);
        }
      }
      return acc;
    }, []);

    console.log('latest line length:' + latestLines.length);

    // Remove lines that have been deleted
    const filteredLinesWithoutDeleted = latestLines.filter((line) => {
      if (line.deleted) {
        return false;
      } else {
        return true;
      }
    });

    console.log('filtered line length:' + filteredLinesWithoutDeleted.length);
    return filteredLinesWithoutDeleted;
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
    const { entryUUID } = args;
    const transcriptions = (await db('transcriptions').where({ entry: entryUUID })) as Transcription[];
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
    const { line } = args;

    // Get the line from the database
    const dbLine = (await db('lines')
      .where({ transcription: line.transcription })
      .where({ index: line.index })
      .first()) as Line;

    // Create a new line object with the updated values and a higher version number
    const updatedLine = {
      ...dbLine,
      ...line,
      uuid: uuidv4(),
      version: dbLine.version + 1
    };

    // Add the new line to the database and return it
    const newLine = (await db('lines').insert(updatedLine).returning('*')) as Line[];
    return newLine[0];
  }
);

// Restore line
ipcMain.handle(
  QUERY.RESTORE_LINE,
  async (_event: invoke, args: QueryArgs[QUERY.RESTORE_LINE]): QueryReturn[QUERY.RESTORE_LINE] => {
    const { line } = args;
    // Get the lines from the database
    const dbLines = (await db('lines')
      .where({ transcription: line.transcription })
      .where({ index: line.index })) as Line[];

    // Get the line with the lowest version number
    const lowestVersionLine = dbLines.reduce((acc: Line, line: Line) => {
      if (acc.version > line.version) {
        return line;
      } else {
        return acc;
      }
    }, dbLines[0]);

    // Set the deleted flag to false
    const updatedLine = {
      ...lowestVersionLine,
      deleted: false
    };

    // Update the line in the database and return it
    const newLine = (await db('lines').where({ uuid: updatedLine.uuid }).update(updatedLine).returning('*')) as Line[];
    return newLine[0];
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
    const { entryUUID } = args;
    await db('entries').where({ uuid: entryUUID }).del();
    return true;
  }
);

// Delete Line
ipcMain.handle(
  QUERY.REMOVE_LINE,
  async (_event: invoke, args: QueryArgs[QUERY.REMOVE_LINE]): QueryReturn[QUERY.REMOVE_LINE] => {
    const { index, transcriptionUUID } = args;

    // Set deleted flag on all lines with the given index in the given transcription
    await db('lines').where({ index }).where({ transcription: transcriptionUUID }).update({ deleted: true });

    return true;
  }
);

console.log('QueryDatabase.ts: loaded');

export default ipcMain;
