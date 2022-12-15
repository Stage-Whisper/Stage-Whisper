import {app} from 'electron';
import './security-restrictions';
import {restoreOrCreateWindow} from '/@/mainWindow';

console.log('main.index: starting...');
// console.log(__dirname);

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
 * Install Vue.js or any other extension in development mode only.
 * Note: You must install `electron-devtools-installer` manually
 */
// if (import.meta.env.DEV) {
//   console.debug('Installing extensions...');
//   app.whenReady().then(() => {
//     installExtension(REDUX_DEVTOOLS)
//       .then(name => console.log(`Added Extension:  ${name}`))
//       .catch(err => console.log('An error occurred installing ${name}: ', err));
//   });

//   app.whenReady().then(() => {
//     installExtension(REACT_DEVELOPER_TOOLS)
//       .then(name => console.log(`Added Extension:  ${name}`))
//       .catch(err => console.log('An error occurred installing ${name}: ', err));
//   });
// }
//     .then(({default: installExtension, REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS}) =>
//       installExtension([REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS], {
//         loadExtensionOptions: {
//           allowFileAccess: true,
//         },
//       }),
//     )
//     .catch(e => console.error('Failed install extension:', e));
// }

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
