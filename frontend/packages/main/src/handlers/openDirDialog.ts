import type {OpenDirectoryDialogResponse} from '../../../../types/handlers';
import {dialog, ipcMain} from 'electron';
import {Channels} from '../../../../types/channels';

ipcMain.handle(Channels.OPEN_DIR_DIALOG, async (): Promise<OpenDirectoryDialogResponse> => {
  // Trigger electron directory picker and return the selected directory
  const directory = await dialog.showOpenDialog({
    properties: ['openDirectory'],
  });

  return {
    path: directory.canceled ? null : directory.filePaths[0],
  };
});

console.log('openDirDialog: loaded');

export default ipcMain;
