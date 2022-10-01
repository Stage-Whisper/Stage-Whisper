import { ipcMain, IpcMainInvokeEvent } from 'electron';
import { join } from 'path';
import { parseSync } from 'subtitle';
import { readFilePromise } from '..';

// Get example vtt file
export default ipcMain.handle('load-vtt-from-file', async (_event: IpcMainInvokeEvent, ...args) => {
  const path = args[0];
  const exampleData = args?.[1];

  if (exampleData) {
    console.log('Getting example vtt file');
    const file = await readFilePromise(join(__dirname, '../src/debug/data/example.vtt'));
    const parsed = parseSync(file); // Parse vtt file
    return parsed;
  } else {
    console.log('Getting vtt file from path: ', path);
    const file = await readFilePromise(path);
    const parsed = parseSync(file); // Parse vtt file
    return parsed;
  }
});
