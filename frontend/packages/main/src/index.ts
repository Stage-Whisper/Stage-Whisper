import {app} from 'electron';
import './security-restrictions';
import {restoreOrCreateWindow} from '/@/mainWindow';
import {initializeApp} from './functions/initializeApp';
import * as pc from 'picocolors';
/**
 * Prevent electron from running multiple instances.
 */
const isSingleInstance = app.requestSingleInstanceLock();
if (!isSingleInstance) {
  app.quit();
  process.exit(0);
}
app.on('second-instance', restoreOrCreateWindow);

/**
 * Run initialization code for the application store.
 */
initializeApp().catch(e => console.error(pc.red('Failed initialize app:'), e));

/**
 * Disable Hardware Acceleration to save more system resources.
 */
app.disableHardwareAcceleration();

/**
 * Shout down background process if all windows was closed
 */
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

/**
 * @see https://www.electronjs.org/docs/latest/api/app#event-activate-macos Event: 'activate'.
 */
app.on('activate', restoreOrCreateWindow);

/**
 * Create the application window when the background process is ready.
 */
app
  .whenReady()
  .then(restoreOrCreateWindow)
  .catch(e => console.error('Failed create window:', e));

/**
 * Check for new version of the application - production mode only.
 */
if (import.meta.env.PROD) {
  app
    .whenReady()
    .then(() => import('electron-updater'))
    .then(({autoUpdater}) => autoUpdater.checkForUpdatesAndNotify())
    .catch(e => console.error('Failed check updates:', e));
}

// Handler Imports
import './handlers/newEntry';
import './handlers/deleteEntry';
import './handlers/deleteStore';
import './handlers/exportTranscription';
import './handlers/fetchAudioFile';
import './handlers/queryDatabase';
import './handlers/runWhisper';
