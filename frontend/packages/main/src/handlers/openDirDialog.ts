import type {openDirectoryDialogReturn} from './../../../preload/src/index';
import {dialog, ipcMain} from 'electron';
import {Channels} from '../../../../types/channels';

ipcMain.handle(Channels.OPEN_DIR_DIALOG, async (): Promise<openDirectoryDialogReturn> => {
  // Trigger electron directory picker and return the selected directory

  return new Promise((resolve, reject) => {
    dialog
      .showOpenDialog({
        properties: ['openDirectory'],
      })
      .then(result => {
        if (result.canceled) {
          console.log('openDirDialog: cancelled');
          reject(new Error('openDirDialog: cancelled'));
        } else {
          resolve({path: result.filePaths[0]});
        }
      })
      .catch(err => {
        console.log('openDirDialog: error');
        reject(err);
      });
  });
});

console.log('openDirDialog: loaded');

export default ipcMain;
