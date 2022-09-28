// Native
import { join } from 'path';

// Python-Shell
import { PythonShell } from 'python-shell';

// Packages
import { BrowserWindow, app, ipcMain, IpcMainEvent, dialog, IpcMainInvokeEvent } from 'electron';
import isDev from 'electron-is-dev';
import { whisperArgs } from './preload';

// Electron Defaults
const height = 600;
const width = 800;

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    api: any;
  }
}

function createWindow() {
  // Create the browser window.
  const window = new BrowserWindow({
    width,
    height,
    frame: true,
    show: true,
    resizable: true,
    fullscreenable: true,
    webPreferences: {
      preload: join(__dirname, 'preload.js')
    }
  });

  const port = process.env.PORT || 3000;
  const url = isDev ? `http://localhost:${port}` : join(__dirname, '../src/out/index.html');

  if (isDev) {
    window?.loadURL(url);
  } else {
    window?.loadFile(url);
  }

  // eslint-disable-next-line no-unused-expressions
  isDev && window?.webContents.openDevTools({ mode: 'detach' });

  // For AppBar
  ipcMain.on('minimize', () => {
    // eslint-disable-next-line no-unused-expressions
    window.isMinimized() ? window.restore() : window.minimize();
  });
  ipcMain.on('maximize', () => {
    // eslint-disable-next-line no-unused-expressions
    window.isMaximized() ? window.restore() : window.maximize();
  });

  ipcMain.on('close', () => {
    window.close();
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// listen the channel `message` and resend the received message to the renderer process
ipcMain.on('message', (event: IpcMainEvent, message: unknown) => {
  // eslint-disable-next-line no-console
  console.log(message);
  setTimeout(() => event.sender.send('message', 'hi from electron'), 500);
});

ipcMain.handle('open-directory-dialog', async () => {
  // Trigger electron directory picker and return the selected directory
  const directory = await dialog.showOpenDialog({
    properties: ['openDirectory']
  });

  return directory.canceled ? null : directory.filePaths[0];
});

ipcMain.handle('run-whisper', (event: IpcMainInvokeEvent, args: whisperArgs) => {
  // eslint-disable-next-line no-console

  // Format model name
  const model = args.language === 'english' ? `${args.model}.en` : args.model || 'base';

  const options = {
    scriptPath: join(__dirname, '../src/python'),
    args: [
      args.file,
      `--model ${model}`,
      args.language || 'en',
      args.translate ? '--task translate' : '',
      args.output_dir ? `--output_dir ${args.output_dir}` : ''
    ]
    // TODO: Add this option to the frontend to allow for automatic language detection
    // args.detect_language
  };

  // eslint-disable-next-line no-console
  console.log('Running python script with options: ', options);
  PythonShell.run('whisper.py', options, (err, results) => {
    if (err) throw err;
    // results is an array consisting of messages collected during execution
    // eslint-disable-next-line no-console
    console.log('results: %j', results);
    event.sender.send('whisper-complete', results);
  });
});
