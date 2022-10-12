import { Entry } from 'knex/types/tables';
import { contextBridge, ipcRenderer } from 'electron';
import { Channels, OpenDirectoryDialogResponse, RunWhisperResponse } from './types/channels';

import { WhisperArgs } from './types/whisperTypes';
import { QUERY, QueryArgs, QueryReturn } from './handlers/queryDatabase/queryDatabase';

declare global {
  interface Window {
    Main: typeof api;
    ipcRenderer: typeof ipcRenderer;
  }
}

const api = {
  // Audio file fetcher
  fetchAudioFile: async (audioPath: string): Promise<Uint8Array> => {
    // Send the audio file path to the main process
    try {
      const audioUint8Array = await ipcRenderer.invoke(Channels.FETCH_AUDIO_FILE, audioPath);
      return audioUint8Array;
    } catch (error) {
      throw new Error(`Preload: Error reading audio file: ${error}`);
    }
  },

  // Run the whisper model with given arguments
  runWhisper: async (args: WhisperArgs, entry: Entry): Promise<RunWhisperResponse> => {
    console.log('Preload: RunWhisper: args', args);

    const result = (await ipcRenderer.invoke(Channels.runWhisper, args, entry)) as RunWhisperResponse;
    console.log(`Preload: Invoked RunWhisper, result: ${result}`);

    return result;
  },

  // Trigger an OS level directory picker
  openDirectoryDialog: async (): Promise<OpenDirectoryDialogResponse> => {
    console.log('Invoking openDirectoryDialog');
    try {
      const result = await ipcRenderer.invoke(Channels.OPEN_DIR_DIALOG);
      return result;
    } catch (error) {
      console.log(`Error in openDirectoryDialog: ${error}`);
      throw error;
    }
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on: (channel: string, callback: (data: any) => void) => {
    ipcRenderer.on(channel, (_, data) => callback(data));
  },

  // Database functions using knex
  ADD_ENTRY: async (args: QueryArgs[QUERY.ADD_ENTRY]): QueryReturn[QUERY.ADD_ENTRY] => {
    // Add an entry to the database
    return await ipcRenderer.invoke(QUERY.ADD_ENTRY, args);
  },
  ADD_LINE: async (args: QueryArgs[QUERY.ADD_LINE]): QueryReturn[QUERY.ADD_LINE] => {
    // Add a line to a transcription
    return await ipcRenderer.invoke(QUERY.ADD_LINE, args);
  },
  ADD_TRANSCRIPTION: async (args: QueryArgs[QUERY.ADD_TRANSCRIPTION]): QueryReturn[QUERY.ADD_TRANSCRIPTION] => {
    // Add a transcription to an entry
    return await ipcRenderer.invoke(QUERY.ADD_TRANSCRIPTION, args);
  },
  REMOVE_ENTRY: async (args: QueryArgs[QUERY.REMOVE_ENTRY]): QueryReturn[QUERY.REMOVE_ENTRY] => {
    // Remove an entry from the database and all associated lines and transcriptions
    return await ipcRenderer.invoke(QUERY.REMOVE_ENTRY, args);
  },
  REMOVE_LINE: async (args: QueryArgs[QUERY.REMOVE_LINE]): QueryReturn[QUERY.REMOVE_LINE] => {
    // Remove a line from a transcription (just marks it as deleted)
    return await ipcRenderer.invoke(QUERY.REMOVE_LINE, args);
  },
  REMOVE_TRANSCRIPTION: async (
    args: QueryArgs[QUERY.REMOVE_TRANSCRIPTION]
  ): QueryReturn[QUERY.REMOVE_TRANSCRIPTION] => {
    // Remove a transcription from an entry and all lines associated with it
    return await ipcRenderer.invoke(QUERY.REMOVE_TRANSCRIPTION, args);
  },
  RESTORE_LINE: async (args: QueryArgs[QUERY.RESTORE_LINE]): QueryReturn[QUERY.RESTORE_LINE] => {
    // Restore a line from the trash
    return await ipcRenderer.invoke(QUERY.RESTORE_LINE, args);
  },
  UPDATE_ENTRY: async (args: QueryArgs[QUERY.UPDATE_ENTRY]): QueryReturn[QUERY.UPDATE_ENTRY] => {
    // Update an entry in the database
    return await ipcRenderer.invoke(QUERY.UPDATE_ENTRY, args);
  },
  UPDATE_LINE: async (args: QueryArgs[QUERY.UPDATE_LINE]): QueryReturn[QUERY.UPDATE_LINE] => {
    // Update a line in a transcription
    return await ipcRenderer.invoke(QUERY.UPDATE_LINE, args);
  },
  UPDATE_TRANSCRIPTION: async (
    args: QueryArgs[QUERY.UPDATE_TRANSCRIPTION]
  ): QueryReturn[QUERY.UPDATE_TRANSCRIPTION] => {
    // Update a transcription in an entry
    return await ipcRenderer.invoke(QUERY.UPDATE_TRANSCRIPTION, args);
  },
  GET_ENTRY: async (args: QueryArgs[QUERY.GET_ENTRY]): QueryReturn[QUERY.GET_ENTRY] => {
    // Get an entry from the database
    return await ipcRenderer.invoke(QUERY.GET_ENTRY, args);
  },
  GET_ENTRY_COUNT: async (args: QueryArgs[QUERY.GET_ENTRY_COUNT]): QueryReturn[QUERY.GET_ENTRY_COUNT] => {
    // Get the number of entries in the database
    return await ipcRenderer.invoke(QUERY.GET_ENTRY_COUNT, args);
  },
  GET_LINE: async (args: QueryArgs[QUERY.GET_LINE]): QueryReturn[QUERY.GET_LINE] => {
    // Get a line from a transcription
    return await ipcRenderer.invoke(QUERY.GET_LINE, args);
  },
  GET_LINE_COUNT: async (args: QueryArgs[QUERY.GET_LINE_COUNT]): QueryReturn[QUERY.GET_LINE_COUNT] => {
    // Get the number of lines in a transcription
    return await ipcRenderer.invoke(QUERY.GET_LINE_COUNT, args);
  },
  GET_TRANSCRIPTION: async (args: QueryArgs[QUERY.GET_TRANSCRIPTION]): QueryReturn[QUERY.GET_TRANSCRIPTION] => {
    // Get a transcription from an entry
    return await ipcRenderer.invoke(QUERY.GET_TRANSCRIPTION, args);
  },
  GET_TRANSCRIPTION_COUNT: async (
    args: QueryArgs[QUERY.GET_TRANSCRIPTION_COUNT]
  ): QueryReturn[QUERY.GET_TRANSCRIPTION_COUNT] => {
    // Get the total number of transcriptions
    return await ipcRenderer.invoke(QUERY.GET_TRANSCRIPTION_COUNT, args);
  },
  GET_TRANSCRIPTION_COUNT_FOR_ENTRY: async (
    args: QueryArgs[QUERY.GET_TRANSCRIPTION_COUNT_FOR_ENTRY]
  ): QueryReturn[QUERY.GET_TRANSCRIPTION_COUNT_FOR_ENTRY] => {
    // Get the number of transcriptions in an entry
    return await ipcRenderer.invoke(QUERY.GET_TRANSCRIPTION_COUNT_FOR_ENTRY, args);
  },
  GET_ALL_ENTRIES: async (args: QueryArgs[QUERY.GET_ALL_ENTRIES]): QueryReturn[QUERY.GET_ALL_ENTRIES] => {
    // Get all entries from the database
    return await ipcRenderer.invoke(QUERY.GET_ALL_ENTRIES, args);
  },
  GET_ALL_LINES: async (args: QueryArgs[QUERY.GET_ALL_LINES]): QueryReturn[QUERY.GET_ALL_LINES] => {
    // Get all lines for a transcription
    return await ipcRenderer.invoke(QUERY.GET_ALL_LINES, args);
  },
  GET_LATEST_LINES: async (args: QueryArgs[QUERY.GET_LATEST_LINES]): QueryReturn[QUERY.GET_LATEST_LINES] => {
    // Get the latest lines for a transcription
    return await ipcRenderer.invoke(QUERY.GET_LATEST_LINES, args);
  },
  GET_ALL_TRANSCRIPTIONS: async (
    args: QueryArgs[QUERY.GET_ALL_TRANSCRIPTIONS]
  ): QueryReturn[QUERY.GET_ALL_TRANSCRIPTIONS] => {
    // Get all transcriptions
    return await ipcRenderer.invoke(QUERY.GET_ALL_TRANSCRIPTIONS, args);
  },
  GET_ALL_TRANSCRIPTIONS_FOR_ENTRY: async (
    args: QueryArgs[QUERY.GET_ALL_TRANSCRIPTIONS_FOR_ENTRY]
  ): QueryReturn[QUERY.GET_ALL_TRANSCRIPTIONS_FOR_ENTRY] => {
    // Get all transcriptions for an entry
    return await ipcRenderer.invoke(QUERY.GET_ALL_TRANSCRIPTIONS_FOR_ENTRY, args);
  },
  GET_ALL_ENTRIES_WITH_TRANSCRIPTIONS: async (
    args: QueryArgs[QUERY.GET_ALL_ENTRIES_WITH_TRANSCRIPTIONS]
  ): QueryReturn[QUERY.GET_ALL_ENTRIES_WITH_TRANSCRIPTIONS] => {
    // Get all entries with transcriptions
    return await ipcRenderer.invoke(QUERY.GET_ALL_ENTRIES_WITH_TRANSCRIPTIONS, args);
  },
  GET_ALL_ENTRIES_WITH_LINES_AND_TRANSCRIPTIONS: async (
    args: QueryArgs[QUERY.GET_ALL_ENTRIES_WITH_LINES_AND_TRANSCRIPTIONS]
  ): QueryReturn[QUERY.GET_ALL_ENTRIES_WITH_LINES_AND_TRANSCRIPTIONS] => {
    // Get all entries with lines and transcriptions
    return await ipcRenderer.invoke(QUERY.GET_ALL_ENTRIES_WITH_LINES_AND_TRANSCRIPTIONS, args);
  }
};

contextBridge.exposeInMainWorld('Main', api);
/**
 * Using the ipcRenderer directly in the browser through the contextBridge ist not really secure.
 * I advise using the Main/api way !!
 */
contextBridge.exposeInMainWorld('ipcRenderer', ipcRenderer);
