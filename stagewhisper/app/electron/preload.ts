import { ResetAppResponse } from './channels.d';
import { NewEntryResponse, RunWhisperResponse, LoadDatabaseResponse, OpenDirectoryDialogResponse } from './channels';
import { newEntryArgs } from './handlers/newEntry/newEntry';
import { WhisperArgs } from './whisperTypes';
import { ipcRenderer, contextBridge } from 'electron';
import { entry } from './types';
import { Channels } from './channels';

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
    const result = await ipcRenderer.invoke(Channels.newEntry, args);

    if (result.error) {
      throw result.error;
    } else {
      return result.entry;
    }
  },

  // Run the whisper model with given arguments
  runWhisper: async (args: WhisperArgs, entry: entry): Promise<RunWhisperResponse> => {
    console.log('runWhisper args', args);

    const result = await ipcRenderer.invoke(Channels.runWhisper, args, entry);

    if (result.error) {
      throw result.error;
    } else {
      return result;
    }
  },

  // Reset the app
  resetApp: async (): Promise<ResetAppResponse> => {
    console.log('Invoking resetApp');
    const result = await ipcRenderer.invoke(Channels.resetApp);

    if (result.success) {
      return result;
    } else {
      return result;
    }
  },

  // Get the list of all entries stored in the app database
  loadDatabase: async (): Promise<LoadDatabaseResponse> => {
    const result = await ipcRenderer.invoke(Channels.loadDatabase);
    return result;
  },

  // Trigger an OS level directory picker
  openDirectoryDialog: async (): Promise<OpenDirectoryDialogResponse> => {
    const result = await ipcRenderer.invoke(Channels.openDirectoryDialog);
    return result;
  },

  // Testing: Load a file from the app directory
  // loadVttFromFile: async (path: string, exampleData: boolean) => {
  //   if (exampleData === true) {
  //     const result = (await ipcRenderer.invoke('load-vtt-from-file', path, exampleData)) as NodeList;
  //     return result;
  //   } else {
  //     const result = (await ipcRenderer.invoke('load-vtt-from-file', path)) as NodeList;
  //     return result;
  //   }
  // },

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
