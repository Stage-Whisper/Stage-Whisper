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
import { initializeApp } from './app/initializeApp';

// Icons

const macIcon = join(__dirname, 'assets/icons/color/Icon - AppSVG.svg');
const otherIcon = join(__dirname, 'assets/icons/color/Icon - Full Colour512.png');

console.log('Starting Electron...');
console.log(__dirname);

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
    },

    // Check if on a mac or other OS
    icon: (() => {
      // TODO: This requires building before changes are reflected, will need to be tested
      if (process.platform === 'darwin') {
        console.log("~I'm a mac~");
        return macIcon;
      } else if (process.platform === 'win32') {
        console.log("~I'm a pc~");
        return otherIcon;
      } else {
        console.log("~I'm a linux (probably)~");
        return otherIcon;
      }
    })()
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

// Handle process termination
process.on('SIGINT', () => {
  console.log('SIGINT: Closing application');
  app.quit();
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

// Import handlers

import './database/database'; // Initialize database
import '../../frontend/packages/main/src/handlers/deleteStore/deleteStore'; // Non functional
import '../../frontend/packages/main/src/handlers/fetchAudioFile/fetchAudioFile'; // Fetch audio file from disk
import '../../frontend/packages/main/src/handlers/queryDatabase/queryDatabase'; // Get all entries from database
import '../../frontend/packages/main/src/handlers/newEntry/newEntry'; // Add a new entry to the database
import '../../frontend/packages/main/src/handlers/runWhisper/runWhisper'; // Run whisper model
import './types/whisperTypes'; // Types for whisper model
import '../../frontend/packages/main/src/handlers/deleteStore/deleteStore'; // Non functional for the moment
import '../../frontend/packages/main/src/handlers/queryDatabase/queryDatabase'; // Handle database functions
import '../../frontend/packages/main/src/handlers/exportTranscription/exportTranscription'; // Export transcription to file
import '../../frontend/packages/main/src/handlers/deleteEntry/deleteEntry'; // Delete entry from database
