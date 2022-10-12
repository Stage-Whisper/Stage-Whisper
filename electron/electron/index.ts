// Native
import { join } from 'path';
// Python-Shell

// Dev Tools
import installExtension, { REDUX_DEVTOOLS } from 'electron-devtools-installer';

// Packages
import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import isDev from 'electron-is-dev';
import { existsSync, readFile } from 'fs';
import { Channels, OpenDirectoryDialogResponse } from './types/channels';

// Import handlers
import { initializeApp } from './app/initializeApp';
import './handlers/deleteStore/deleteStore'; // Non functional
import './handlers/fetchAudioFile/fetchAudioFile'; // Fetch audio file from disk
import './handlers/queryDatabase/queryDatabase'; // Get all entries from database
import './handlers/newEntry/newEntry'; // Add a new entry to the database
import './handlers/runWhisper/runWhisper'; // Run whisper model
import './types/whisperTypes'; // Types for whisper model
import './database/database'; // Initialize database
import './handlers/queryDatabase/queryDatabase'; // Handle database functions

// Electron Defaults
const height = 600;
const width = 800;

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    api: any;
  }
}

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

  isDev && window?.webContents.openDevTools({ mode: 'detach' });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
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

ipcMain.handle(Channels.OPEN_DIR_DIALOG, async (): Promise<OpenDirectoryDialogResponse> => {
  // Trigger electron directory picker and return the selected directory
  const directory = await dialog.showOpenDialog({
    properties: ['openDirectory']
  });

  return {
    path: directory.canceled ? null : directory.filePaths[0]
  };
});
