import { contextBridge, ipcRenderer } from 'electron';
import {
  Channels,
  LoadDatabaseResponse,
  NewEntryResponse,
  OpenDirectoryDialogResponse,
  RunWhisperResponse
} from './types/channels';
// import { initializeApp } from './functions/initialize/initializeApp';
import { newEntryArgs } from './handlers/newEntry/newEntry';
import { entry } from './types/types';
import { WhisperArgs } from './types/whisperTypes';

// import { languages } from '../src/components/language/languages';

declare global {
  interface Window {
    Main: typeof api;
    ipcRenderer: typeof ipcRenderer;
  }
}

const api = {
  // Add a new file to the database
  newEntry: async (args: newEntryArgs): Promise<NewEntryResponse> => {
    try {
      const response = await ipcRenderer.invoke(Channels.newEntry, args);
      return response;
    } catch (error) {
      console.log(`Error in newEntry: ${error}`);

      throw error;
    }
  },

  // Run the whisper model with given arguments
  runWhisper: async (args: WhisperArgs, entry: entry): Promise<RunWhisperResponse> => {
    console.log('Preload: RunWhisper: args', args);

    const result = (await ipcRenderer.invoke(Channels.runWhisper, args, entry)) as RunWhisperResponse;
    console.log(`Preload: Invoked RunWhisper, result: ${result}`);

    return result;
  },

  // Delete store file
  deleteStore: async (): Promise<void> => {
    try {
      await ipcRenderer.invoke(Channels.deleteStore);
    } catch (error) {
      console.log(`Error in deleteStore: ${error}`);

      throw error;
    }
  },

  // Get the list of all entries stored in the app database
  loadDatabase: async (): Promise<LoadDatabaseResponse> => {
    console.log('Invoking loadDatabase');
    try {
      const result = await ipcRenderer.invoke(Channels.loadDatabase);
      return result;
    } catch (error) {
      console.log(`Error in loadDatabase: ${error}`);
      throw error;
    }
  },

  // Trigger an OS level directory picker
  openDirectoryDialog: async (): Promise<OpenDirectoryDialogResponse> => {
    console.log('Invoking openDirectoryDialog');
    try {
      const result = await ipcRenderer.invoke(Channels.openDirectoryDialog);
      return result;
    } catch (error) {
      console.log(`Error in openDirectoryDialog: ${error}`);
      throw error;
    }
  },

  on: (channel: string, callback: (data: any) => void) => {
    ipcRenderer.on(channel, (_, data) => callback(data));
  }
};
contextBridge.exposeInMainWorld('Main', api);
/**
 * Using the ipcRenderer directly in the browser through the contextBridge ist not really secure.
 * I advise using the Main/api way !!
 */
contextBridge.exposeInMainWorld('ipcRenderer', ipcRenderer);
