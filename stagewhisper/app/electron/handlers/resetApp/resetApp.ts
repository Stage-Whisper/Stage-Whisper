import { app, ipcMain, IpcMainInvokeEvent } from 'electron';
import { rmSync } from 'fs';
import { join } from 'path';
import { Channels, ResetAppResponse } from './../../channels';
import { initializeApp } from './../../functions/initialize/initializeApp';

// Paths
const rootPath = app.getPath('userData'); // Path to the top level of the data folder
const storePath = join(rootPath, 'store'); // Path to the store folder
// const dataPath = join(storePath, 'data'); // Path to the data folder

export default ipcMain.handle(Channels.resetApp, async (_event: IpcMainInvokeEvent): Promise<ResetAppResponse> => {
  console.log('Resetting app');

  console.log('Removing store folder');
  rmSync(storePath, { recursive: true, force: true });
  console.log('Store folder removed');

  return await initializeApp()
    .then(() => {
      return {
        success: true
      };
    })
    .catch((err) => {
      console.log(err);
      return {
        success: false,
        error: err
      };
    });
});
