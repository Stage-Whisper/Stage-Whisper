// Database
import type {Entry, Line, Transcription} from '@prisma/client';
import {prisma} from '../database';

// Types
import type {IpcMainInvokeEvent as invoke, IpcMainInvokeEvent} from 'electron';
import type {QueryArgs, QueryReturn} from '../../../../types/queries';
import {QUERY} from '../../../../types/queries';

// Packages
import {ipcMain} from 'electron';
import {v4 as uuidv4} from 'uuid';

// README
// This file is very long and has a lot of types. This is to allow for communication via IPC between the main process and the renderer process.
// Inputs, outputs, and types are all defined here. This file is also responsible for the actual querying of the database and handling of the data.

// README 2
// This file has many functions that aren't all used. This is to allow for future expansion of the database and queries.
// Some of the functionality is being handled in dedicated handler files, a decision will be made later on whether to keep this or not.

console.log('queryDatabase.ts: Loading...');

// CRUD Functions
// ---- CREATE ----
// Add Entry

ipcMain.handle(
  QUERY.ADD_ENTRY,
  async (
    _event: IpcMainInvokeEvent,
    args: QueryArgs[QUERY.ADD_ENTRY],
  ): QueryReturn[QUERY.ADD_ENTRY] => {
    const {entry} = args;
    const insertedEntry = (await prisma.entry.create({data: entry})) as Entry;
    return insertedEntry;
  },
);

// Add Line
ipcMain.handle(
  QUERY.ADD_LINE,
  async (_event: invoke, args: QueryArgs[QUERY.ADD_LINE]): QueryReturn[QUERY.ADD_LINE] => {
    const {line} = args;
    const insertedLine = (await prisma.line.create({data: line})) as Line;
    return insertedLine;
  },
);

// Add Lines
ipcMain.handle(
  QUERY.ADD_LINES,
  async (_event: invoke, args: QueryArgs[QUERY.ADD_LINES]): QueryReturn[QUERY.ADD_LINES] => {
    const {lines} = args;
    const insertedLines = (await prisma.$transaction(
      lines.map(line => prisma.line.create({data: line})),
    )) as Line[];

    return insertedLines;
  },
);

// Add Transcription

ipcMain.handle(
  QUERY.ADD_TRANSCRIPTION,
  async (
    _event: invoke,
    args: QueryArgs[QUERY.ADD_TRANSCRIPTION],
  ): QueryReturn[QUERY.ADD_TRANSCRIPTION] => {
    const {transcription} = args;
    const insertedTranscription = (await prisma.transcription.create({
      data: transcription,
    })) as Transcription;
    return insertedTranscription;
  },
);

// ---- READ ----
// Get Entry
ipcMain.handle(
  QUERY.GET_ENTRY,
  async (_event: invoke, args: QueryArgs[QUERY.GET_ENTRY]): QueryReturn[QUERY.GET_ENTRY] => {
    const {entryUUID} = args;
    const entry = (await prisma.entry.findUnique({
      where: {uuid: entryUUID},
    })) as Entry;
    return entry;
  },
);

// Get Entry Count
ipcMain.handle(QUERY.GET_ENTRY_COUNT, async (): QueryReturn[QUERY.GET_ENTRY_COUNT] => {
  const entryCount = await prisma.entry.count();
  return entryCount;
});

// Get Line
ipcMain.handle(
  QUERY.GET_LINE,
  async (_event: invoke, args: QueryArgs[QUERY.GET_LINE]): QueryReturn[QUERY.GET_LINE] => {
    const {index, transcriptionUUID} = args;
    const line = (await prisma.line.findFirst({
      where: {index, transcription: {uuid: transcriptionUUID}},
      orderBy: {version: 'desc'},
    })) as Line;
    return line;
  },
);

// Get Line Count
ipcMain.handle(
  QUERY.GET_LINE_COUNT,
  async (
    _event: invoke,
    args: QueryArgs[QUERY.GET_LINE_COUNT],
  ): QueryReturn[QUERY.GET_LINE_COUNT] => {
    const {transcriptionUUID} = args;
    const lineCount = await prisma.line.count({
      where: {transcription: {uuid: transcriptionUUID}},
    });
    return lineCount;
  },
);

// Get Transcription
ipcMain.handle(
  QUERY.GET_TRANSCRIPTION,
  async (
    _event: invoke,
    args: QueryArgs[QUERY.GET_TRANSCRIPTION],
  ): QueryReturn[QUERY.GET_TRANSCRIPTION] => {
    const {transcriptionUUID} = args;
    const transcription = (await prisma.transcription.findUnique({
      where: {uuid: transcriptionUUID},
    })) as Transcription;
    return transcription;
  },
);

// Get Transcription Count
ipcMain.handle(
  QUERY.GET_TRANSCRIPTION_COUNT,
  async (): QueryReturn[QUERY.GET_TRANSCRIPTION_COUNT] => {
    const transcriptionCount = await prisma.transcription.count();
    return transcriptionCount;
  },
);

// Get Transcription Count for Entry
ipcMain.handle(
  QUERY.GET_TRANSCRIPTION_COUNT_FOR_ENTRY,
  async (
    _event: invoke,
    args: QueryArgs[QUERY.GET_TRANSCRIPTION_COUNT_FOR_ENTRY],
  ): QueryReturn[QUERY.GET_TRANSCRIPTION_COUNT_FOR_ENTRY] => {
    const {entryUUID} = args;
    const transcriptionCount = await prisma.transcription.count({
      where: {entry: {uuid: entryUUID}},
    });
    return transcriptionCount;
  },
);

// Get All Entries
ipcMain.handle(QUERY.GET_ALL_ENTRIES, async (): QueryReturn[QUERY.GET_ALL_ENTRIES] => {
  const entries = (await prisma.entry.findMany()) as Entry[];
  return entries;
});

// Get All Lines
ipcMain.handle(QUERY.GET_ALL_LINES, async (): QueryReturn[QUERY.GET_ALL_LINES] => {
  const lines = (await prisma.line.findMany()) as Line[];
  return lines;
});

// Get Latest Lines
ipcMain.handle(
  QUERY.GET_LATEST_LINES,
  async (
    _event: invoke,
    args: QueryArgs[QUERY.GET_LATEST_LINES],
  ): QueryReturn[QUERY.GET_LATEST_LINES] => {
    const {transcriptionUUID} = args;

    // // Get the lines for a transcription, ordered by index, with only the highest version of each line
    // const lines = (await db('lines')
    //   .where({transcription: transcriptionUUID})
    //   .orderBy('index', 'asc')
    //   .orderBy('version', 'desc')) as Line[];

    // // Get the line at each index which has the highest version
    // const latestLines = lines.reduce((acc: Line[], line: Line) => {
    //   if (acc.length === 0) {
    //     acc.push(line);
    //   } else {
    //     const lastLine = acc[acc.length - 1];
    //     if (lastLine.index === line.index) {
    //       if (lastLine.version < line.version) {
    //         acc.pop();
    //         acc.push(line);
    //       }
    //     } else {
    //       acc.push(line);
    //     }
    //   }
    //   return acc;
    // }, []);

    // // Remove lines that have been deleted
    // const filteredLinesWithoutDeleted = latestLines.filter(line => {
    //   if (line.deleted) {
    //     return false;
    //   } else {
    //     return true;
    //   }
    // });

    // return filteredLinesWithoutDeleted;

    const lines = (await prisma.line.findMany({
      where: {transcription: {uuid: transcriptionUUID}},
      orderBy: {index: 'asc', version: 'desc'},
    })) as Line[];

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

    const filteredLinesWithoutDeleted = latestLines.filter(line => {
      if (line.deleted) {
        return false;
      } else {
        return true;
      }
    });

    return filteredLinesWithoutDeleted;
  },
);

// Get All Transcriptions
ipcMain.handle(
  QUERY.GET_ALL_TRANSCRIPTIONS,
  async (): QueryReturn[QUERY.GET_ALL_TRANSCRIPTIONS] => {
    const transcriptions = (await prisma.transcription.findMany()) as Transcription[];
    return transcriptions;
  },
);

// Get All Transcriptions for Entry
ipcMain.handle(
  QUERY.GET_ALL_TRANSCRIPTIONS_FOR_ENTRY,
  async (
    _event: invoke,
    args: QueryArgs[QUERY.GET_ALL_TRANSCRIPTIONS_FOR_ENTRY],
  ): QueryReturn[QUERY.GET_ALL_TRANSCRIPTIONS_FOR_ENTRY] => {
    const {entryUUID} = args;
    const transcriptions = (await prisma.transcription.findMany({
      where: {entry: {uuid: entryUUID}},
    })) as Transcription[];
    return transcriptions;
  },
);

// ---- UPDATE ----
// Update Entry
ipcMain.handle(
  QUERY.UPDATE_ENTRY,
  async (_event: invoke, args: QueryArgs[QUERY.UPDATE_ENTRY]): QueryReturn[QUERY.UPDATE_ENTRY] => {
    const {entry} = args;
    // const updatedEntry = (await db('entries')
    //   .where({uuid: entry.uuid})
    //   .update(entry)
    //   .returning('*')
    //   .first()) as Entry;
    // return updatedEntry;

    const updatedEntry = (await prisma.entry.update({
      where: {uuid: entry.uuid},
      data: entry,
    })) as Entry;
    return updatedEntry;
  },
);

// Update Line
ipcMain.handle(
  QUERY.UPDATE_LINE,
  async (_event: invoke, args: QueryArgs[QUERY.UPDATE_LINE]): QueryReturn[QUERY.UPDATE_LINE] => {
    const {line} = args;

    // // Get the line from the database
    // const dbLine = (await db('lines')
    //   .where({transcription: line.transcription})
    //   .where({index: line.index})
    //   .first()) as Line;

    // // Create a new line object with the updated values and a higher version number
    // const updatedLine = {
    //   ...dbLine,
    //   ...line,
    //   uuid: uuidv4(),
    //   version: dbLine.version + 1,
    // };

    // // Add the new line to the database and return it
    // const newLine = (await db('lines').insert(updatedLine).returning('*')) as Line[];
    // return newLine[0];

    const dbLine = (await prisma.line.findFirst({
      where: {transcription: {uuid: line.transcriptionId}, index: line.index},
    })) as Line;

    const updatedLine = {
      ...dbLine,
      ...line,
      uuid: uuidv4(),
      version: dbLine.version + 1,
    };

    const newLine = (await prisma.line.create({data: updatedLine})) as Line;
    return newLine;
  },
);

// Restore line
ipcMain.handle(
  QUERY.RESTORE_LINE,
  async (_event: invoke, args: QueryArgs[QUERY.RESTORE_LINE]): QueryReturn[QUERY.RESTORE_LINE] => {
    const {line} = args;
    // // Get the lines from the database
    // const dbLines = (await db('lines')
    //   .where({transcription: line.transcription})
    //   .where({index: line.index})) as Line[];

    // // Get the line with the lowest version number
    // const lowestVersionLine = dbLines.reduce((acc: Line, line: Line) => {
    //   if (acc.version > line.version) {
    //     return line;
    //   } else {
    //     return acc;
    //   }
    // }, dbLines[0]);

    // // Remove lines with version number higher than the lowest version number
    // const linesToDelete = dbLines.filter(line => {
    //   if (line.version > lowestVersionLine.version) {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // });

    // // Delete the lines
    // await db('lines')
    //   .whereIn(
    //     'uuid',
    //     linesToDelete.map(line => line.uuid),
    //   )
    //   .del();

    // // Set the deleted flag to false
    // const updatedLine = {
    //   ...lowestVersionLine,
    //   deleted: false,
    // };

    // // Update the line in the database and return it
    // const newLine = (await db('lines')
    //   .where({uuid: updatedLine.uuid})
    //   .update(updatedLine)
    //   .returning('*')) as Line[];
    // return newLine[0];

    const dbLines = (await prisma.line.findMany({
      where: {transcription: {uuid: line.transcriptionId}, index: line.index},
    })) as Line[];

    // Get the line with the lowest version number
    const lowestVersionLine = dbLines.reduce((acc: Line, line: Line) => {
      if (acc.version > line.version) {
        return line;
      } else {
        return acc;
      }
    }, dbLines[0]);

    // Remove lines with version number higher than the lowest version number
    const linesToDelete = dbLines.filter(line => {
      if (line.version > lowestVersionLine.version) {
        return true;
      } else {
        return false;
      }
    });

    // Delete the non-original lines
    await prisma.line.deleteMany({
      where: {
        uuid: {
          in: linesToDelete.map(line => line.uuid),
        },
      },
    });

    // Set the deleted flag to false
    const updatedLine = {
      ...lowestVersionLine,
      deleted: false,
    };

    // Update the line in the database and return it
    const newLine = (await prisma.line.update({
      where: {uuid: updatedLine.uuid},
      data: updatedLine,
    })) as Line;
    return newLine;
  },
);

// Update Transcription
ipcMain.handle(
  QUERY.UPDATE_TRANSCRIPTION,
  async (
    _event: invoke,
    args: QueryArgs[QUERY.UPDATE_TRANSCRIPTION],
  ): QueryReturn[QUERY.UPDATE_TRANSCRIPTION] => {
    const {transcription} = args;
    const updatedTranscription = (await prisma.transcription.update({
      where: {uuid: transcription.uuid},
      data: transcription,
    })) as Transcription;
    return updatedTranscription;
  },
);

// ---- DELETE ----
// Delete Entry
ipcMain.handle(
  QUERY.REMOVE_ENTRY,
  async (_event: invoke, args: QueryArgs[QUERY.REMOVE_ENTRY]): QueryReturn[QUERY.REMOVE_ENTRY] => {
    const {entryUUID} = args;
    await prisma.entry.delete({where: {uuid: entryUUID}});
    return true;
  },
);

// Delete Line
ipcMain.handle(
  QUERY.REMOVE_LINE,
  async (_event: invoke, args: QueryArgs[QUERY.REMOVE_LINE]): QueryReturn[QUERY.REMOVE_LINE] => {
    const {index, transcriptionUUID} = args;

    // Set deleted flag on all lines with the given index in the given transcription
    await prisma.line.updateMany({
      where: {index, transcription: {uuid: transcriptionUUID}},
      data: {deleted: true},
    });
    return true;
  },
);

console.log('QueryDatabase.ts: loaded');

export default ipcMain;
