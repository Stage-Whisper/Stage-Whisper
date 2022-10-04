// Native
import { join } from 'path';
// Python-Shell

// Dev Tools
import installExtension, { REDUX_DEVTOOLS } from 'electron-devtools-installer';

// Packages
import { app, BrowserWindow, dialog, ipcMain, IpcMainEvent } from 'electron';
import isDev from 'electron-is-dev';

import { existsSync, readFile } from 'fs';

// Electron Defaults
const height = 600;
const width = 800;

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    api: any;
  }
}

//#region Utility Functions
// Promise wrapper for readFile
export const readFilePromise = (path: string): Promise<string> =>
  new Promise((resolve, reject) => {
    existsSync(path)
      ? readFile(path, 'utf8', (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        })
      : reject(new Error('File does not exist'));
  });

//#endregion

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

// Import handlers
import './handlers/loadVtt/loadVtt'; // Testing
import './handlers/runWhisper/runWhisper'; // Run whisper model
import './whisperTypes'; // Types for whisper model
import './handlers/loadDatabase/loadDatabase'; // Get all entries from database
import './handlers/newEntry/newEntry'; // Add a new entry to the database
import { initializeApp } from './functions/initialize/initializeApp';

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  installExtension(REDUX_DEVTOOLS)
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch((err) => console.log('An error occurred: ', err));

  // Check if file structure exists and create if not
  initializeApp().then(() => {
    createWindow();
  });
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
