// Database
import type {Line} from '@prisma/client';
import {prisma} from '../database';

// Types
import type {IpcMainInvokeEvent as invoke, IpcMainInvokeEvent} from 'electron';
import {QUERY} from '../../../../types/queries';
import type {
  addEntryParams,
  addEntryReturn,
  addLineParams,
  addLineReturn,
  addLinesParams,
  addLinesReturn,
  addTranscriptionParams,
  addTranscriptionReturn,
  getAllEntriesReturn,
  getAllLinesReturn,
  getAllTranscriptionsForEntryParams,
  getAllTranscriptionsForEntryReturn,
  getAllTranscriptionsReturn,
  getEntryCountReturn,
  getEntryParams,
  getEntryReturn,
  getLatestLinesParams,
  getLatestLinesReturn,
  getLineByIndexParams,
  getLineByIndexReturn,
  getLineCountParams,
  getLineCountReturn,
  getTranscriptionCountForEntryParams,
  getTranscriptionCountForEntryReturn,
  getTranscriptionCountReturn,
  getTranscriptionParams,
  getTranscriptionReturn,
  removeEntryParams,
  removeEntryReturn,
  removeLineParams,
  removeLineReturn,
  restoreLineParams,
  restoreLineReturn,
  updateEntryParams,
  updateEntryReturn,
  updateLineParams,
  updateLineReturn,
  updateTranscriptionParams,
  updateTranscriptionReturn,
} from './../../../preload/src/index';

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

// TODO: Need to migrate these to the new types
ipcMain.handle(
  QUERY.ADD_ENTRY,
  async (_event: IpcMainInvokeEvent, args: addEntryParams): addEntryReturn => {
    const {entry} = args[0];
    return new Promise((resolve, reject) => {
      prisma.entry
        .create({
          data: entry,
        })
        .then(insertedEntry => {
          resolve({entry: insertedEntry});
        })
        .catch(err => {
          console.error('QueryDatabase: Error adding entry' + err);
          reject(err);
        });
    });
  },
);

// Add Line

ipcMain.handle(QUERY.ADD_LINE, async (_event: invoke, args: addLineParams): addLineReturn => {
  const {line} = args[0];
  return new Promise((resolve, reject) => {
    prisma.line
      .create({
        data: line,
      })
      .then(insertedLine => {
        resolve({line: insertedLine});
      })
      .catch(err => {
        console.error('QueryDatabase: Error adding line' + err);
        reject(err);
      });
  });
});

// Add Lines

ipcMain.handle(QUERY.ADD_LINES, async (_event: invoke, args: addLinesParams): addLinesReturn => {
  const {lines} = args[0];
  return new Promise((resolve, reject) => {
    prisma
      .$transaction(lines.map(line => prisma.line.create({data: line})))
      .then(insertedLines => {
        resolve({lines: insertedLines});
      })
      .catch(err => {
        console.error('QueryDatabase: Error adding lines' + err);
        reject(err);
      });
  });
});

// Add Transcription
ipcMain.handle(
  QUERY.ADD_TRANSCRIPTION,
  async (_event: invoke, args: addTranscriptionParams): addTranscriptionReturn => {
    const {transcription} = args[0];
    return new Promise((resolve, reject) => {
      prisma.transcription
        .create({
          data: transcription,
        })
        .then(result => {
          resolve({transcription: result});
        })
        .catch(err => {
          console.error('QueryDatabase: Error adding transcription' + err);
          reject(err);
        });
    });
  },
);

// ---- READ ----
// Get Entry
ipcMain.handle(QUERY.GET_ENTRY, async (_event: invoke, args: getEntryParams): getEntryReturn => {
  const {entryUUID} = args[0];
  return new Promise((resolve, reject) => {
    prisma.entry
      .findUnique({
        where: {uuid: entryUUID},
      })
      .then(result => {
        if (result === null) resolve(null);
        else resolve({entry: result});
      })
      .catch(err => {
        console.error('QueryDatabase: Error getting entry' + err);
        reject(err);
      });
  });
});

// // Get Entry Count

// Get Entry Count
ipcMain.handle(QUERY.GET_ENTRY_COUNT, async (): getEntryCountReturn => {
  return new Promise((resolve, reject) => {
    prisma.entry
      .count()
      .then(result => {
        resolve({entryCount: result});
      })
      .catch(err => {
        console.error('QueryDatabase: Error getting entry count' + err);
        reject(err);
      });
  });
});

// Get Line By Index
ipcMain.handle(
  QUERY.GET_LINE_BY_INDEX,
  async (_event: invoke, args: getLineByIndexParams): getLineByIndexReturn => {
    const {index, transcriptionUUID} = args[0];
    return new Promise((resolve, reject) => {
      prisma.line
        .findFirst({
          where: {index, transcription: {uuid: transcriptionUUID}},
          orderBy: {version: 'desc'},
        })
        .then(result => {
          if (result === null) resolve(null);
          else resolve({line: result});
        })
        .catch(err => {
          console.error('QueryDatabase: Error getting line by index' + err);
          reject(err);
        });
    });
  },
);

// Get Line Count
ipcMain.handle(
  QUERY.GET_LINE_COUNT,
  async (_event: invoke, args: getLineCountParams): getLineCountReturn => {
    const {transcriptionUUID} = args[0];
    return new Promise((resolve, reject) => {
      prisma.line
        .count({
          where: {transcription: {uuid: transcriptionUUID}},
        })
        .then(result => {
          resolve({lineCount: result});
        })
        .catch(err => {
          console.error('QueryDatabase: Error getting line count' + err);
          reject(err);
        });
    });
  },
);

// Get Transcription
ipcMain.handle(
  QUERY.GET_TRANSCRIPTION,
  async (_event: invoke, args: getTranscriptionParams): getTranscriptionReturn => {
    const {transcriptionUUID} = args[0];
    return new Promise((resolve, reject) => {
      prisma.transcription
        .findUnique({
          where: {uuid: transcriptionUUID},
        })
        .then(result => {
          if (result === null) resolve(null);
          else resolve({transcription: result});
        })
        .catch(err => {
          console.error('QueryDatabase: Error getting transcription' + err);
          reject(err);
        });
    });
  },
);

// Get Transcription Count

ipcMain.handle(QUERY.GET_TRANSCRIPTION_COUNT, async (): getTranscriptionCountReturn => {
  return new Promise((resolve, reject) => {
    prisma.transcription
      .count()
      .then(result => {
        resolve({transcriptionCount: result});
      })
      .catch(err => {
        console.error('QueryDatabase: Error getting transcription count' + err);
        reject(err);
      });
  });
});

// Get Transcription Count for Entry
ipcMain.handle(
  QUERY.GET_TRANSCRIPTION_COUNT_FOR_ENTRY,
  async (
    _event: invoke,
    args: getTranscriptionCountForEntryParams,
  ): getTranscriptionCountForEntryReturn => {
    const {entryUUID} = args[0];
    return new Promise((resolve, reject) => {
      prisma.transcription
        .count({
          where: {entry: {uuid: entryUUID}},
        })
        .then(result => {
          resolve({transcriptionCount: result});
        })
        .catch(err => {
          console.error('QueryDatabase: Error getting transcription count for entry' + err);
          reject(err);
        });
    });
  },
);

// Get All Entries
ipcMain.handle(QUERY.GET_ALL_ENTRIES, async (): getAllEntriesReturn => {
  return new Promise((resolve, reject) => {
    prisma.entry
      .findMany()
      .then(result => {
        resolve({entries: result});
      })
      .catch(err => {
        console.error('QueryDatabase: Error getting all entries' + err);
        reject(err);
      });
  });
});

// Get All Lines
ipcMain.handle(QUERY.GET_ALL_LINES, async (): getAllLinesReturn => {
  return new Promise((resolve, reject) => {
    prisma.line
      .findMany()
      .then(result => {
        resolve({lines: result});
      })
      .catch(err => {
        console.error('QueryDatabase: Error getting all lines' + err);
        reject(err);
      });
  });
});

// // Get Latest Lines
// ipcMain.handle(
//   QUERY.GET_LATEST_LINES,
//   async (
//     _event: invoke,
//     args: QueryArgs[QUERY.GET_LATEST_LINES],
//   ): QueryReturn[QUERY.GET_LATEST_LINES] => {
//     const {transcriptionUUID} = args;

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

//

//     const lines = (await prisma.line.findMany({
//       where: {transcription: {uuid: transcriptionUUID}},
//       orderBy: {index: 'asc', version: 'desc'},
//     })) as Line[];

//     const latestLines = lines.reduce((acc: Line[], line: Line) => {
//       if (acc.length === 0) {
//         acc.push(line);
//       } else {
//         const lastLine = acc[acc.length - 1];
//         if (lastLine.index === line.index) {
//           if (lastLine.version < line.version) {
//             acc.pop();
//             acc.push(line);
//           }
//         } else {
//           acc.push(line);
//         }
//       }
//       return acc;
//     }, []);

//     const filteredLinesWithoutDeleted = latestLines.filter(line => {
//       if (line.deleted) {
//         return false;
//       } else {
//         return true;
//       }
//     });

//     return filteredLinesWithoutDeleted;
//   },
// );

// Get Latest Lines
ipcMain.handle(
  QUERY.GET_LATEST_LINES,
  async (_event: invoke, args: getLatestLinesParams): getLatestLinesReturn => {
    const {transcriptionUUID} = args[0];
    return new Promise((resolve, reject) => {
      prisma.line
        .findMany({
          where: {transcription: {uuid: transcriptionUUID}},
          orderBy: {index: 'asc', version: 'desc'},
        })
        .then(result => {
          const lines = result as Line[];
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

          resolve({lines: filteredLinesWithoutDeleted});
        })
        .catch(err => {
          console.error('QueryDatabase: Error getting latest lines' + err);
          reject(err);
        });
    });
  },
);

// Get All Transcriptions
ipcMain.handle(QUERY.GET_ALL_TRANSCRIPTIONS, async (): getAllTranscriptionsReturn => {
  return new Promise((resolve, reject) => {
    prisma.transcription
      .findMany()
      .then(result => {
        resolve({transcriptions: result});
      })
      .catch(err => {
        console.error('QueryDatabase: Error getting all transcriptions' + err);
        reject(err);
      });
  });
});

// Get All Transcriptions for Entry
ipcMain.handle(
  QUERY.GET_ALL_TRANSCRIPTIONS_FOR_ENTRY,
  async (
    _event: invoke,
    args: getAllTranscriptionsForEntryParams,
  ): getAllTranscriptionsForEntryReturn => {
    const {entryUUID} = args[0];
    return new Promise((resolve, reject) =>
      prisma.transcription
        .findMany({
          where: {entry: {uuid: entryUUID}},
        })
        .then(result => {
          resolve({transcriptions: result});
        })
        .catch(err => {
          console.error('QueryDatabase: Error getting all transcriptions for entry' + err);
          reject(err);
        }),
    );
  },
);

// ---- UPDATE ----

// Update Entry
ipcMain.handle(
  QUERY.UPDATE_ENTRY,
  async (_event: invoke, args: updateEntryParams): updateEntryReturn => {
    const {entry} = args[0];
    return new Promise((resolve, reject) =>
      prisma.entry
        .update({
          where: {uuid: entry.uuid},
          data: entry,
        })
        .then(result => {
          resolve({entry: result});
        })
        .catch(err => {
          console.error('QueryDatabase: Error updating entry' + err);
          reject(err);
        }),
    );
  },
);

// Update Line
ipcMain.handle(
  QUERY.UPDATE_LINE,
  async (_event: invoke, args: updateLineParams): updateLineReturn => {
    const {line} = args[0];
    return new Promise((resolve, reject) =>
      prisma.line
        .findFirst({
          where: {transcription: {uuid: line.transcriptionId}, index: line.index},
        })
        .then(result => {
          const dbLine = result as Line;
          const updatedLine = {
            ...dbLine,
            ...line,
            uuid: uuidv4(),
            version: dbLine.version + 1,
          };
          return updatedLine;
        })
        .then(updatedLine =>
          prisma.line
            .create({data: updatedLine})
            .then(result => {
              resolve({line: result});
            })
            .catch(err => {
              console.error('QueryDatabase: Error creating new line' + err);
              reject(err);
            }),
        )
        .catch(err => {
          console.error('QueryDatabase: Error finding line' + err);
          reject(err);
        }),
    );
  },
);

// // Restore line
// ipcMain.handle(
//   QUERY.RESTORE_LINE,
//   async (_event: invoke, args: QueryArgs[QUERY.RESTORE_LINE]): QueryReturn[QUERY.RESTORE_LINE] => {
//     const {line} = args;
//     // // Get the lines from the database
//     // const dbLines = (await db('lines')
//     //   .where({transcription: line.transcription})
//     //   .where({index: line.index})) as Line[];

//     // // Get the line with the lowest version number
//     // const lowestVersionLine = dbLines.reduce((acc: Line, line: Line) => {
//     //   if (acc.version > line.version) {
//     //     return line;
//     //   } else {
//     //     return acc;
//     //   }
//     // }, dbLines[0]);

//     // // Remove lines with version number higher than the lowest version number
//     // const linesToDelete = dbLines.filter(line => {
//     //   if (line.version > lowestVersionLine.version) {
//     //     return true;
//     //   } else {
//     //     return false;
//     //   }
//     // });

//     // // Delete the lines
//     // await db('lines')
//     //   .whereIn(
//     //     'uuid',
//     //     linesToDelete.map(line => line.uuid),
//     //   )
//     //   .del();

//     // // Set the deleted flag to false
//     // const updatedLine = {
//     //   ...lowestVersionLine,
//     //   deleted: false,
//     // };

//     // // Update the line in the database and return it
//     // const newLine = (await db('lines')
//     //   .where({uuid: updatedLine.uuid})
//     //   .update(updatedLine)
//     //   .returning('*')) as Line[];
//     // return newLine[0];

//     const dbLines = (await prisma.line.findMany({
//       where: {transcription: {uuid: line.transcriptionId}, index: line.index},
//     })) as Line[];

//     // Get the line with the lowest version number
//     const lowestVersionLine = dbLines.reduce((acc: Line, line: Line) => {
//       if (acc.version > line.version) {
//         return line;
//       } else {
//         return acc;
//       }
//     }, dbLines[0]);

//     // Remove lines with version number higher than the lowest version number
//     const linesToDelete = dbLines.filter(line => {
//       if (line.version > lowestVersionLine.version) {
//         return true;
//       } else {
//         return false;
//       }
//     });

//     // Delete the non-original lines
//     await prisma.line.deleteMany({
//       where: {
//         uuid: {
//           in: linesToDelete.map(line => line.uuid),
//         },
//       },
//     });

//     // Set the deleted flag to false
//     const updatedLine = {
//       ...lowestVersionLine,
//       deleted: false,
//     };

//     // Update the line in the database and return it
//     const newLine = (await prisma.line.update({
//       where: {uuid: updatedLine.uuid},
//       data: updatedLine,
//     })) as Line;
//     return newLine;
//   },
// );

// Restore line
ipcMain.handle(
  QUERY.RESTORE_LINE,
  async (_event: invoke, args: restoreLineParams): restoreLineReturn => {
    const {transcriptionUUID, lineIndex} = args[0];

    return new Promise((resolve, reject) =>
      prisma.line
        .findMany({
          where: {transcription: {uuid: transcriptionUUID}, index: lineIndex},
        })
        .then(result => {
          const dbLines = result as Line[];
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
          return prisma.line
            .deleteMany({
              where: {
                uuid: {
                  in: linesToDelete.map(line => line.uuid),
                },
              },
            })
            .then(() => {
              // Set the deleted flag to false
              const updatedLine = {
                ...lowestVersionLine,
                deleted: false,
              };

              // Update the line in the database and return it
              return prisma.line
                .update({
                  where: {uuid: updatedLine.uuid},
                  data: updatedLine,
                })
                .then(result => {
                  const newLine = result as Line;
                  resolve({line: newLine});
                })
                .catch(err => {
                  console.error('QueryDatabase: Error updating line' + err);
                  reject(err);
                });
            })
            .catch(err => {
              console.error('QueryDatabase: Error deleting lines' + err);
              reject(err);
            });
        })
        .catch(err => {
          console.error('QueryDatabase: Error finding lines' + err);
          reject(err);
        }),
    );
  },
);

// Update Transcription
ipcMain.handle(
  QUERY.UPDATE_TRANSCRIPTION,
  async (_event: invoke, args: updateTranscriptionParams): updateTranscriptionReturn => {
    const {transcription} = args[0];
    return new Promise((resolve, reject) =>
      prisma.transcription
        .update({
          where: {uuid: transcription.uuid},
          data: transcription,
        })
        .then(result => {
          resolve({transcription: result});
        })
        .catch(err => {
          console.error('QueryDatabase: Error updating transcription' + err);
          reject(err);
        }),
    );
  },
);

// ---- DELETE ----

// Delete Entry
ipcMain.handle(
  QUERY.REMOVE_ENTRY,
  async (_event: invoke, args: removeEntryParams): removeEntryReturn => {
    const {entryUUID} = args[0];
    return new Promise((resolve, reject) =>
      prisma.entry
        .delete({where: {uuid: entryUUID}})
        .then(() => {
          resolve();
        })
        .catch(err => {
          console.error('QueryDatabase: Error deleting entry' + err);
          reject(err);
        }),
    );
  },
);

// Delete Line
ipcMain.handle(
  QUERY.REMOVE_LINE,
  async (_event: invoke, args: removeLineParams): removeLineReturn => {
    const {lineUUID} = args[0];

    return new Promise((resolve, reject) =>
      prisma.line
        .update({
          where: {uuid: lineUUID},
          data: {deleted: true},
        })
        .then(result => {
          resolve({line: result});
        })
        .catch(err => {
          console.error('QueryDatabase: Error deleting line' + err);
          reject(err);
        }),
    );
  },
);

console.log('QueryDatabase.ts: loaded');

export default ipcMain;
