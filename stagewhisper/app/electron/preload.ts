import { ipcRenderer, contextBridge } from 'electron';
import vttFromFile from './functions/vttFromFile';

// import { languages } from '../src/components/language/languages';

declare global {
  interface Window {
    Main: typeof api;
    ipcRenderer: typeof ipcRenderer;
  }
}

// Arguments to be passed to the Whisper AI python script
export interface whisperArgs {
  file: string;
  model: 'tiny' | 'base' | 'small' | 'medium' | 'large';
  language: string;
  translate: boolean;
  output_dir: string;
  // detect_language: boolean;
  // output_format: string;
}

const api = {
  runWhisper: (args: whisperArgs) => {
    ipcRenderer.invoke('run-whisper', args);
  },

  openDirectoryDialog: async () => {
    const result = await ipcRenderer.invoke('open-directory-dialog');
    return result;
  },

  sendMessage: (message: string) => {
    ipcRenderer.send('message', message);
  },
  loadVttFromFile: async (path: string, exampleData: boolean) => {
    return await vttFromFile(path, exampleData);
  },
  // loadVttFromFile: async (path: string, exampleData: boolean) => {
  //   return await vttFromFile(path, exampleData);
  // },

  /**
   * Provide an easier way to listen to events
   */
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
