import { ipcRenderer, contextBridge } from 'electron';

declare global {
  interface Window {
    Main: typeof api;
    ipcRenderer: typeof ipcRenderer;
  }
}

const api = {
  runWhisper: (args: string[]) => {
    ipcRenderer.send('run-whisper', args);
  },

  openDirectoryDialog: async () => {
    const result = await ipcRenderer.invoke('open-directory-dialog');
    return result;
  },

  sendMessage: (message: string) => {
    ipcRenderer.send('message', message);
  },

  /**
    Here function for AppBar
   */
  // Minimize: () => {
  //   ipcRenderer.send('minimize');
  // },
  // Maximize: () => {
  //   ipcRenderer.send('maximize');
  // },
  // Close: () => {
  //   ipcRenderer.send('close');
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
