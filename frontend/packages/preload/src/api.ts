// Packages
import {ipcRenderer} from 'electron';
import * as pc from 'picocolors';
// Types
import {QUERY} from '../../../types/queries';
// import type {QueryArgs, QueryReturn} from '../../../types/queries';
import type {WhisperArgs} from '../../../types/whisper';
import {Channels} from '../../../types/channels';
import type {Entry, Line, Transcription} from '@prisma/client';

/**
 * =======================  README  =======================
 * @remarks
 * This file contains all the functions that the renderer process can call to interact with the main process
 * Each is exported as a function that returns a promise
 * The parameters here are used as types for the functions invoked in the main process,
 * changing them here will change them there
 * ========================================================
 */

// Delete Store -- Used for debugging or if the user wants to reset the app
// export const deleteStore () => ipcRenderer.invoke(Channels.DELETE_STORE)

/**
 * Delete an entry from the database
 * @param entryUUID - The UUID of the entry to delete
 * @returns A promise that resolves when the entry has been deleted
 */
export const deleteEntry = async ({entryUUID}: {entryUUID: string}): Promise<void> => {
  console.debug(pc.dim('API: deleteEntry'));
  return new Promise((resolve, reject) => {
    ipcRenderer
      .invoke(Channels.DELETE_ENTRY, entryUUID)
      .then(resolve)
      .catch(error => {
        console.error(`API: Error deleting entry: ${error}`);
        reject(error);
      });
  });
};

/**
 * Fetch the audio file from the given path
 * @param audioPath - The path to the audio file
 * @returns The audio file as a Uint8Array
 */
export const fetchAudioFile = async ({
  audioPath,
}: {
  audioPath: string;
}): Promise<{audioFile: Uint8Array}> => {
  console.debug(pc.dim('API: fetchAudioFile'));
  return new Promise((resolve, reject) => {
    ipcRenderer
      .invoke(Channels.FETCH_AUDIO_FILE, audioPath)
      .then(result => {
        console.assert(
          result instanceof Uint8Array,
          pc.yellow('API: fetchAudioFile: result is not a Uint8Array'),
        );
        resolve({
          audioFile: result as Uint8Array,
        });
      })
      .catch(error => {
        console.error(`API: Error reading audio file: ${error}`);
        reject(error);
      });
  });
};

/**
 * Export a transcription to a file
 * @param transcriptionUUID - The UUID of the transcription to export
 * @param outputDir - The directory to export the transcription to
 * @returns The path to the exported file
 * @remarks
 * The outputDir is optional, if it is not provided the file will be saved to the default export directory
 * (usually the user's desktop folder)
 */
export const exportTranscription = async ({
  transcriptionUUID,
  outputDir,
}: {
  transcriptionUUID: string;
  outputDir?: string;
}): Promise<{filePath: string}> => {
  console.debug(pc.dim('API: exportTranscription'));
  return new Promise((resolve, reject) => {
    ipcRenderer
      .invoke(Channels.EXPORT_TRANSCRIPTION, transcriptionUUID, outputDir)
      .then(result => {
        console.assert(
          typeof result === 'string',
          pc.yellow('API: exportTranscription: result is not a string'),
        );
        resolve(result as {filePath: string});
      })
      .catch(error => {
        console.error(`API: Error exporting transcription: ${error}`);
        reject(error);
      });
  });
};

/**
 * Run the whisper model with given arguments
 * @param whisperArgs - The arguments to pass to the whisper model
 * @param entryUUID - The UUID of the entry to run the model on
 * @returns The transcription generated by the model
 */
export const runWhisper = async ({
  whisperArgs,
  entryUUID,
}: {
  whisperArgs: WhisperArgs;
  entryUUID: string;
}): Promise<{transcription: Transcription}> => {
  console.debug(pc.dim('API: runWhisper'));
  return new Promise((resolve, reject) => {
    ipcRenderer
      .invoke(Channels.runWhisper, whisperArgs, entryUUID)
      .then(result => {
        console.assert(
          typeof result === 'object',
          pc.yellow('API: runWhisper: result is not an object'),
        );
        resolve({
          transcription: result as Transcription,
        });
      })
      .catch(error => {
        console.error(`API: Error running whisper: ${error}`);
        reject(error);
      });
  });
};

/**
 * Trigger an OS level directory picker
 * @returns The path to the selected directory
 */
export const openDirectoryDialog = async (): Promise<{path: string} | null> => {
  console.debug(pc.dim('API: openDirectoryDialog'));
  return new Promise((resolve, reject) => {
    ipcRenderer
      .invoke(Channels.OPEN_DIR_DIALOG)
      .then(result => {
        console.assert(
          typeof result === 'string',
          pc.yellow('API: openDirectoryDialog: result is not a string'),
        );
        resolve({path: result as string});
      })
      .catch(error => {
        console.error(`API: Error opening directory dialog: ${error}`);
        reject(error);
      });
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// on: (channel: string, callback: (data: any) => void) => {
// ipcRenderer.on(channel, (_, data) => callback(data));
// },

/**
 * Create a new entry in the database with the given arguments
 * @param args - The arguments to create the entry with
 * @returns The entry that was created
 * @deprecated - Should be replaced with addEntry with entry constructed in the renderer
 */
export const newEntry = async ({
  filePath,
  name,
  description,
  audio_type,
  audio_language,
  audio_name,
}: {
  filePath: Entry['audio_path'];
  name: Entry['name'];
  description: Entry['description'];
  audio_type: Entry['audio_type'];
  audio_language: Entry['audio_language'];
  audio_name: Entry['audio_name'];
}): Promise<{entry: Entry}> => {
  console.debug(pc.dim('API: newEntry'));
  return new Promise((resolve, reject) => {
    ipcRenderer
      .invoke(
        Channels.NEW_ENTRY,
        filePath,
        name,
        description,
        audio_type,
        audio_language,
        audio_name,
      )
      .then(result => {
        console.assert(
          result instanceof Object && Object.hasOwn(result, 'inQueue'),
          pc.yellow('API: newEntry: result is not an Entry'),
        );
        resolve({entry: result as Entry});
      })
      .catch(error => {
        console.log(pc.red('API:Error in newEntry: ') + error);
        reject(error);
      });
  });
};

/**
 * Add a new entry to the database
 * @param entry - The entry to add
 * @returns The entry that was added
 */
export const addEntry = async ({entry}: {entry: Entry}): Promise<{entry: Entry}> => {
  console.debug(pc.dim('API: addEntry'));
  return new Promise((resolve, reject) => {
    ipcRenderer
      .invoke(QUERY.ADD_ENTRY, entry)
      .then(result => {
        console.assert(
          result instanceof Object && Object.hasOwn(result, 'inQueue'),
          pc.yellow('API: addEntry: result is not an Entry'),
        );
        resolve({entry: result as Entry});
      })
      .catch(error => {
        console.log(pc.red('API:Error in addEntry: ') + error);
        reject(error);
      });
  });
};

/**
 * Add a new line to a transcription
 * @param line - The line to add
 * @returns The line that was added
 */
export const addLine = async ({line}: {line: Line}): Promise<{line: Line}> => {
  console.debug(pc.dim('API: addLine'));
  return new Promise((resolve, reject) => {
    ipcRenderer
      .invoke(QUERY.ADD_LINE, line)
      .then(result => {
        console.assert(
          result instanceof Object && Object.hasOwn(result, 'version'),
          pc.yellow('API: addLine: result is not a Line'),
        );
        resolve({line: result as Line});
      })
      .catch(error => {
        console.log(pc.red('API:Error in addLine: ') + error);
        reject(error);
      });
  });
};

/**
 * Add a new lines to a transcription
 * @param lines[] - The lines to add
 * @returns The lines that were added
 */
export const addLines = async ({lines}: {lines: Line[]}): Promise<{lines: Line[]}> => {
  console.debug(pc.dim('API: addLines'));
  return new Promise((resolve, reject) => {
    ipcRenderer
      .invoke(QUERY.ADD_LINES, lines)
      .then(result => {
        console.assert(result instanceof Array, pc.yellow('API: addLines: result is not an Array'));
        console.assert(
          Object.hasOwn(result, 'version'),
          pc.yellow('API: addLines: result is not a Line'),
        );
        resolve({lines: result as Line[]});
      })
      .catch(error => {
        console.log(pc.red('API:Error in addLines: ') + error);
        reject(error);
      });
  });
};

/**
 * Add a new transcription to an entry
 * @param transcription - The transcription to add
 * @returns The transcription that was added
 */
export const addTranscription = async ({
  transcription,
}: {
  transcription: Transcription;
}): Promise<{transcription: Transcription}> => {
  return new Promise((resolve, reject) => {
    ipcRenderer
      .invoke(QUERY.ADD_TRANSCRIPTION, transcription)
      .then(result => {
        console.assert(
          result instanceof Object && Object.hasOwn(result, 'transcribedOn'),
          pc.yellow('API: addTranscription: result is not a Transcription'),
        );
        resolve({transcription: result as Transcription});
      })
      .catch(error => {
        console.log(pc.red('API:Error in addTranscription: ') + error);
        reject(error);
      });
  });
};

/**
 * Remove an entry from the database and all associated lines and transcriptions
 * @param entry - The entry to remove
 * @returns The entry that was removed
 */
export const removeEntry = async ({entry}: {entry: Entry}): Promise<{entry: Entry}> => {
  console.debug(pc.dim('API: removeEntry'));
  return new Promise((resolve, reject) => {
    ipcRenderer
      .invoke(QUERY.REMOVE_ENTRY, entry)
      .then(result => {
        console.assert(
          result instanceof Object && Object.hasOwn(result, 'inQueue'),
          pc.yellow('API: removeEntry: result is not an Entry'),
        );
        resolve({entry: result as Entry});
      })
      .catch(error => {
        console.log(pc.red('API:Error in removeEntry: ') + error);
        reject(error);
      });
  });
};

/**
 * Remove a line from a transcription (just marks it as deleted)
 * @param lineUUID - The line to remove
 * @returns The line that was removed
 */
export const removeLine = async ({lineUUID}: {lineUUID: string}): Promise<{line: Line}> => {
  console.debug(pc.dim('API: removeLine'));
  return new Promise((resolve, reject) => {
    ipcRenderer
      .invoke(QUERY.REMOVE_LINE, lineUUID)

      .then(result => {
        console.assert(
          result instanceof Object && Object.hasOwn(result, 'version'),
          pc.yellow('API: removeLine: result is not a Line'),
        );
        resolve({line: result as Line});
      })
      .catch(error => {
        console.log(pc.red('API:Error in removeLine: ') + error);
        reject(error);
      });
  });
};

/**
 * Remove a transcription from an entry and all lines associated with it
 * @param  transcriptionUUID - The transcription to remove
 * @returns The transcription that was removed
 */
export const removeTranscription = async ({
  transcriptionUUID,
}: {
  transcriptionUUID: string;
}): Promise<{transcription: Transcription}> => {
  console.debug(pc.dim('API: removeTranscription'));
  return new Promise((resolve, reject) => {
    ipcRenderer
      .invoke(QUERY.REMOVE_TRANSCRIPTION, transcriptionUUID)
      .then(result => {
        console.assert(
          result instanceof Object && Object.hasOwn(result, 'transcribedOn'),
          pc.yellow('API: removeTranscription: result is not a Transcription'),
        );
        resolve({transcription: result as Transcription});
      })
      .catch(error => {
        console.log(pc.red('API:Error in removeTranscription: ') + error);
        reject(error);
      });
  });
};

/**
 * Restore a line (deletes all newer versions of the line)
 * @param transcriptionUUID - The UUID of the transcription to restore the line in
 * @param lineIndex - The index of the line to restore
 * @returns The line that was restored
 */
export const restoreLine = async ({
  transcriptionUUID,
  lineIndex,
}: {
  transcriptionUUID: string;
  lineIndex: number;
}): Promise<{line: Line}> => {
  console.debug(pc.dim('API: restoreLine'));
  return new Promise((resolve, reject) => {
    ipcRenderer
      .invoke(QUERY.RESTORE_LINE, transcriptionUUID, lineIndex)
      .then(result => {
        console.assert(
          result instanceof Object && Object.hasOwn(result, 'version'),
          pc.yellow('API: restoreLine: result is not a Line'),
        );
        resolve({line: result as Line});
      })
      .catch(error => {
        console.log(pc.red('API:Error in restoreLine: ') + error);
        reject(error);
      });
  });
};

/**
 * Update an entry in the database
 * @param entry - The entry to update
 * @returns The entry that was updated
 */
export const updateEntry = async ({entry}: {entry: Entry}): Promise<{entry: Entry}> => {
  console.debug(pc.dim('API: updateEntry'));
  return new Promise((resolve, reject) => {
    ipcRenderer
      .invoke(QUERY.UPDATE_ENTRY, entry)
      .then(result => {
        console.assert(
          result instanceof Object && Object.hasOwn(result, 'inQueue'),
          pc.yellow('API: updateEntry: result is not an Entry'),
        );
        resolve({entry: result as Entry});
      })
      .catch(error => {
        console.log(pc.red('API:Error in updateEntry: ') + error);
        reject(error);
      });
  });
};

/**
 * Update a line in a transcription
 * @param line - The line to update
 * @returns a promise that resolves to the line that was updated
 */
export const updateLine = async ({line}: {line: Line}): Promise<{line: Line}> => {
  console.debug(pc.dim('API: updateLine'));
  return new Promise((resolve, reject) => {
    ipcRenderer
      .invoke(QUERY.UPDATE_LINE, line)
      // .then(result => resolve({line: result as Line}))
      .then(result => {
        console.assert(
          result instanceof Object && Object.hasOwn(result, 'version'),
          pc.yellow('API: updateLine: result is not a Line'),
        );
        resolve({line: result as Line});
      })
      .catch(error => {
        console.log(pc.red('API:Error in updateLine: ') + error);
        reject(error);
      });
  });
};

/**
 * Update a transcription in an entry
 * @param transcription - The transcription to update (will use the UUID)
 * @returns The transcription that was updated
 */
export const updateTranscription = async ({
  transcription,
}: {
  transcription: Transcription;
}): Promise<{transcription: Transcription}> => {
  console.debug(pc.dim('API: updateTranscription'));
  return new Promise((resolve, reject) => {
    ipcRenderer
      .invoke(QUERY.UPDATE_TRANSCRIPTION, transcription)
      .then(result => {
        console.assert(
          result instanceof Object && Object.hasOwn(result, 'transcribedOn'),
          pc.yellow('API: updateTranscription: result is not a Transcription'),
        );
        resolve({transcription: result as Transcription});
      })
      .catch(error => {
        console.log(pc.red('API:Error in updateTranscription: ') + error);
        reject(error);
      });
  });
};

/**
 * Get an entry from the database
 * @param entryUUID - The UUID of the entry to get
 * @returns The entry, or null if it does not exist
 */
export const getEntry = async ({entryUUID}: {entryUUID: string}): Promise<{entry: Entry}> => {
  console.debug(pc.dim('API: getEntry'));
  return new Promise((resolve, reject) => {
    ipcRenderer
      .invoke(QUERY.GET_ENTRY, entryUUID)
      .then(result => {
        console.assert(
          result instanceof Object && Object.hasOwn(result, 'inQueue'),
          pc.yellow('API: getEntry: result is not an Entry'),
        );
        resolve({entry: result as Entry});
      })
      .catch(error => {
        console.log(pc.red('API:Error in getEntry: ') + error);
        reject(error);
      });
  });
};

/**
 * Get a line from a transcription
 * @param lineUUID - The UUID of the line to get
 * @returns The line, or null if it does not exist
 */
export const getLine = async ({lineUUID}: {lineUUID: string}): Promise<{line: Line}> => {
  console.debug(pc.dim('API: getLine'));
  return new Promise((resolve, reject) => {
    ipcRenderer
      .invoke(QUERY.GET_LINE, lineUUID)
      .then(result => {
        console.assert(
          result instanceof Object && Object.hasOwn(result, 'version'),
          pc.yellow('API: getLine: result is not a Line'),
        );
        resolve({line: result as Line});
      })
      .catch(error => {
        console.log(pc.red('API:Error in getLine: ') + error);
        reject(error);
      });
  });
};

/**
 * Get line based on its index in a transcription
 * @param index - The index of the line to get
 * @param transcriptionUUID
 * @returns The line, or null if it does not exist
 */
export const getLineByIndex = async ({
  index,
  transcriptionUUID,
}: {
  index: number;
  transcriptionUUID: string;
}): Promise<{line: Line}> => {
  console.debug(pc.dim('API: getLineByIndex'));
  return new Promise((resolve, reject) => {
    ipcRenderer
      .invoke(QUERY.GET_LINE_BY_INDEX, {
        index,
        transcriptionUUID,
      })
      .then(result => {
        console.assert(
          result instanceof Object && Object.hasOwn(result, 'version'),
          pc.yellow('API: getLineByIndex: result is not a Line'),
        );
        resolve({line: result as Line});
      })
      .catch(error => {
        console.log(pc.red('API:Error in getLineByIndex: ') + error);
        reject(error);
      });
  });
};

/**
 * Get a transcription
 * @param transcriptionUUID - The UUID of the transcription to get
 * @returns The transcription, or null if it does not exist
 */

export const getTranscription = async ({
  transcriptionUUID,
}: {
  transcriptionUUID: string;
}): Promise<{transcription: Transcription}> => {
  console.debug(pc.dim('API: getTranscription'));
  return new Promise((resolve, reject) => {
    ipcRenderer
      .invoke(QUERY.GET_TRANSCRIPTION, transcriptionUUID)
      .then(result => {
        console.assert(
          result instanceof Object && Object.hasOwn(result, 'transcribedOn'),
          pc.yellow('API: getTranscription: result is not a Transcription'),
        );
        resolve({transcription: result as Transcription});
      })
      .catch(error => {
        console.log(pc.red('API:Error in getTranscription: ') + error);
        reject(error);
      });
  });
};

/**
 * Get the number of entries in the database
 * @returns The number of entries
 */
export const getEntryCount = async (): Promise<{entryCount: number}> => {
  console.debug(pc.dim('API: getEntryCount'));
  return new Promise((resolve, reject) => {
    ipcRenderer
      .invoke(QUERY.GET_ENTRY_COUNT)
      .then(result => {
        console.assert(
          typeof result === 'number',
          pc.yellow('API: getEntryCount: result is not a number'),
        );
        resolve({entryCount: result as number});
      })
      .catch(error => {
        console.log(pc.red('API:Error in getEntryCount: ') + error);
        reject(error);
      });
  });
};

/**
 * Get the number of lines in a transcription
 * @param transcriptionUUID - The UUID of the transcription to get the line count of
 * @returns The number of lines
 */
export const getLineCount = async ({
  transcriptionUUID,
}: {
  transcriptionUUID: string;
}): Promise<{lineCount: number}> => {
  console.debug(pc.dim('API: getLineCount'));
  return new Promise((resolve, reject) => {
    ipcRenderer
      .invoke(QUERY.GET_LINE_COUNT, transcriptionUUID)
      .then(result => {
        console.assert(
          typeof result === 'number',
          pc.yellow('API: getLineCount: result is not a number'),
        );
        resolve({lineCount: result as number});
      })
      .catch(error => {
        console.log(pc.red('API:Error in getLineCount: ') + error);
        reject(error);
      });
  });
};

/**
 * Get the number of transcriptions in an entry
 * @param entryUUID - The UUID of the entry to get the transcription count of
 * @returns The number of transcriptions
 */
export const getTranscriptionCountForEntry = async ({
  entryUUID,
}: {
  entryUUID: string;
}): Promise<{transcriptionCount: number}> => {
  console.debug(pc.dim('API: getTranscriptionCountForEntry'));
  return new Promise((resolve, reject) => {
    ipcRenderer
      .invoke(QUERY.GET_TRANSCRIPTION_COUNT_FOR_ENTRY, entryUUID)
      .then(result => {
        console.assert(
          typeof result === 'number',
          pc.yellow('API: getTranscriptionCountForEntry: result is not a number'),
        );
        resolve({transcriptionCount: result as number});
      })
      .catch(error => {
        console.log(pc.red('API:Error in getTranscriptionCountForEntry: ') + error);
        reject(error);
      });
  });
};

/**
 * Get the number of transcriptions in the database
 * @returns The number of transcriptions
 */
export const getTranscriptionCount = async (): Promise<{transcriptionCount: number}> => {
  console.debug(pc.dim('API: getTranscriptionCount'));
  return new Promise((resolve, reject) => {
    ipcRenderer
      .invoke(QUERY.GET_TRANSCRIPTION_COUNT)
      .then(result => {
        console.assert(
          typeof result === 'number',
          pc.yellow('API: getTranscriptionCount: result is not a number'),
        );
        resolve({transcriptionCount: result as number});
      })
      .catch(error => {
        console.log(pc.red('API:Error in getTranscriptionCount: ') + error);
        reject(error);
      });
  });
};

/**
 * Get all entries from the database
 * @returns An array of all entries
 */
export const getAllEntries = async (): Promise<{entries: Entry[]}> => {
  console.debug(pc.dim('API: getAllEntries'));
  return new Promise((resolve, reject) => {
    ipcRenderer
      .invoke(QUERY.GET_ALL_ENTRIES)
      .then(result => {
        console.assert(
          result instanceof Array,
          pc.yellow('API: getAllEntries: result is not an array'),
        );
        console.assert(
          result.length === 0 ||
            (result[0] instanceof Object && Object.hasOwn(result[0], 'createdOn')),
          pc.yellow('API: getAllEntries: result is not an array of Entries'),
        );

        resolve({entries: result as Entry[]});
      })

      .catch(error => {
        console.log(pc.red('API:Error in getAllEntries: ') + error);
        reject(error);
      });
  });
};

/**
 * Get all transcriptions in an entry
 * @param entryUUID - The UUID of the entry to get the transcriptions from
 * @returns An array of all transcriptions
 */
export const getAllTranscriptionsForEntry = async ({
  entryUUID,
}: {
  entryUUID: string;
}): Promise<{transcriptions: Transcription[]}> => {
  console.debug(pc.dim('API: getAllTranscriptionsForEntry'));
  return new Promise((resolve, reject) => {
    ipcRenderer
      .invoke(QUERY.GET_ALL_TRANSCRIPTIONS_FOR_ENTRY, entryUUID)
      .then(result => {
        console.assert(
          result instanceof Array,
          pc.yellow('API: getAllTranscriptionsForEntry: result is not an array'),
        );
        console.assert(
          result.length === 0 ||
            (result[0] instanceof Object && Object.hasOwn(result[0], 'transcribedOn')),
          pc.yellow('API: getAllTranscriptionsForEntry: result is not an array of Transcriptions'),
        );

        resolve({transcriptions: result as Transcription[]});
      })
      .catch(error => {
        console.log(pc.red('API:Error in getAllTranscriptionsForEntry: ') + error);
        reject(error);
      });
  });
};

/**
 * Get all lines in a transcription
 * @param transcriptionUUID - The UUID of the transcription to get the lines of
 * @returns An array of all lines
 */
export const getAllLinesForTranscription = async ({
  transcriptionUUID,
}: {
  transcriptionUUID: string;
}): Promise<{lines: Line[]}> => {
  console.debug(pc.dim('API: getAllLinesForTranscription'));
  return new Promise((resolve, reject) => {
    ipcRenderer
      .invoke(QUERY.GET_ALL_LINES_FOR_TRANSCRIPTION, transcriptionUUID)

      .then(result => {
        console.assert(
          result instanceof Array,
          pc.yellow('API: getAllLinesForTranscription: result is not an array'),
        );
        console.assert(
          result.length === 0 ||
            (result[0] instanceof Object && Object.hasOwn(result[0], 'version')),
          pc.yellow('API: getAllLinesForTranscription: result is not an array of Lines'),
        );

        resolve({lines: result as Line[]});
      })

      .catch(error => {
        console.log(pc.red('API:Error in getAllLinesForTranscription: ') + error);
        reject(error);
      });
  });
};

/**
 * Get every line in the database
 * @returns An array of all lines
 */
export const getAllLines = async (): Promise<{lines: Line[]}> => {
  console.debug(pc.dim('API: getAllLines'));
  return new Promise((resolve, reject) => {
    ipcRenderer
      .invoke(QUERY.GET_ALL_LINES)

      .then(result => {
        console.assert(
          result instanceof Array,
          pc.yellow('API: getAllLines: result is not an array'),
        );
        console.assert(
          result.length === 0 ||
            (result[0] instanceof Object && Object.hasOwn(result[0], 'version')),
          pc.yellow('API: getAllLines: result is not an array of Lines'),
        );

        resolve({lines: result as Line[]});
      })

      .catch(error => {
        console.log(pc.red('API:Error in getAllLines: ') + error);
        reject(error);
      });
  });
};

/**
 * Get the latest version of the lines in a transcription
 * @param transcriptionUUID - The UUID of the transcription to get the latest lines of
 * @returns An array of the latest lines
 */
export const getLatestLines = async ({
  transcriptionUUID,
}: {
  transcriptionUUID: string;
}): Promise<{lines: Line[]}> => {
  return new Promise((resolve, reject) => {
    ipcRenderer
      .invoke(QUERY.GET_LATEST_LINES, transcriptionUUID)
      .then(result => {
        console.assert(
          result instanceof Array,
          pc.yellow('API: getLatestLines: result is not an array'),
        );
        console.assert(
          result.length === 0 ||
            (result[0] instanceof Object && Object.hasOwn(result[0], 'version')),
          pc.yellow('API: getLatestLines: result is not an array of Lines'),
        );

        resolve({lines: result as Line[]});
      })
      .catch(error => {
        console.log(pc.red('API:Error in getLatestLines: ') + error);
        reject(error);
      });
  });
};

/**
 * Get all transcriptions in the database
 * @returns An array of all transcriptions
 */
export const getAllTranscriptions = async (): Promise<{
  transcriptions: Transcription[];
}> => {
  console.debug(pc.dim('API: getAllTranscriptions'));
  return new Promise((resolve, reject) => {
    ipcRenderer
      .invoke(QUERY.GET_ALL_TRANSCRIPTIONS)
      .then(result => {
        console.assert(
          result instanceof Array,
          pc.yellow('API: getAllTranscriptions: result is not an array'),
        );
        console.assert(
          result.length === 0 ||
            (result[0] instanceof Object && Object.hasOwn(result[0], 'transcribedOn')),
          pc.yellow('API: getAllTranscriptions: result is not an array of Transcriptions'),
        );
      })
      .catch(error => {
        console.log(pc.red('API:Error in getAllTranscriptions: ') + error);
        reject(error);
      });
  });
};

// export const GET_ALL_ENTRIES_WITH_TRANSCRIPTIONS =
//   async (): QueryReturn[QUERY.GET_ALL_ENTRIES_WITH_TRANSCRIPTIONS] => {
//     // Get all entries with transcriptions
//     return (await ipcRenderer.invoke(
//       QUERY.GET_ALL_ENTRIES_WITH_TRANSCRIPTIONS,
//     )) as QueryReturn[QUERY.GET_ALL_ENTRIES_WITH_TRANSCRIPTIONS];
//   };

/**
 * Get all entries with transcriptions
 * @returns An array of all entries with transcriptions
 */
export const getAllEntriesWithTranscriptions = async (): Promise<{
  entries: Entry[];
}> => {
  console.debug(pc.dim('API: getAllEntriesWithTranscriptions'));
  return new Promise((resolve, reject) => {
    ipcRenderer
      .invoke(QUERY.GET_ALL_ENTRIES_WITH_TRANSCRIPTIONS)
      .then(result => {
        console.assert(
          result instanceof Array,
          pc.yellow('API: getAllEntriesWithTranscriptions: result is not an array'),
        );
        console.assert(
          result.length === 0 ||
            (result[0] instanceof Object && Object.hasOwn(result[0], 'inQueue')),
          pc.yellow('API: getAllEntriesWithTranscriptions: result is not an array of Entries'),
        );

        resolve({entries: result as Entry[]});
      })
      .catch(error => {
        console.log(pc.red('API:Error in getAllEntriesWithTranscriptions: ') + error);
        reject(error);
      });
  });
};

/**
 * Get all entries with lines and transcriptions
 * @returns An array of all entries with lines and transcriptions
 */
export const getAllEntriesWithLinesAndTranscriptions = async (): Promise<{
  entries: Entry[];
}> => {
  console.debug(pc.dim('API: getAllEntriesWithLinesAndTranscriptions'));
  return new Promise((resolve, reject) => {
    ipcRenderer
      .invoke(QUERY.GET_ALL_ENTRIES_WITH_LINES_AND_TRANSCRIPTIONS)
      .then(result => {
        console.assert(
          result instanceof Array,
          pc.yellow('API: getAllEntriesWithLinesAndTranscriptions: result is not an array'),
        );
        console.assert(
          result.length === 0 ||
            (result[0] instanceof Object && Object.hasOwn(result[0], 'inQueue')),
          pc.yellow(
            'API: getAllEntriesWithLinesAndTranscriptions: result is not an array of Entries',
          ),
        );

        resolve({entries: result as Entry[]});
      })
      .catch(error => {
        console.log(pc.red('API:Error in getAllEntriesWithLinesAndTranscriptions: ') + error);
        reject(error);
      });
  });
};
