import { app, ipcMain } from 'electron';
import { rmSync } from 'fs';
import { join } from 'path';
import { Channels } from '../../channels';

export default ipcMain.handle(Channels.clearAppDB, async () => {
  const rootPath = app.getPath('userData'); // Path to the top level of the data folder
  const storePath = join(rootPath, 'store'); // Path to the store folder
  console.log('ResetApp: Handling Reset App');
  // Paths
  // const dataPath = join(storePath, 'data'); // Path to the data folder
  console.log('Resetting app');

  console.log('Removing store folder');
  rmSync(storePath, { recursive: true, force: true });
  console.log('Store folder removed');
  return;
});
