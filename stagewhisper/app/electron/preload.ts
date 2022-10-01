import { WhisperArgs } from './handlers/runWhisper';
import { ipcRenderer, contextBridge } from 'electron';

// import { languages } from '../src/components/language/languages';

declare global {
  interface Window {
    Main: typeof api;
    ipcRenderer: typeof ipcRenderer;
  }
}

const api = {
  runWhisper: (args: WhisperArgs) => {
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
    if (exampleData === true) {
      const result = (await ipcRenderer.invoke('load-vtt-from-file', path, exampleData)) as NodeList;
      return result;
    } else {
      const result = (await ipcRenderer.invoke('load-vtt-from-file', path)) as NodeList;
      return result;
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
