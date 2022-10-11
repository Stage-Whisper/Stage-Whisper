import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { app } from 'electron';

// Settings Type
type appConfigType = {
  darkMode: boolean;
  language: string;
  firstRun: boolean;
};

const defaultSettings: appConfigType = {
  darkMode: false,
  language: 'English',
  firstRun: true
};

export const initializeApp = async (): Promise<void> => {
  // Get the data path
  console.log('Initializing app');

  const rootPath = app.getPath('userData'); // Path to the top level the electron app - Also includes other files like localStorage, Cache, extensions, etc
  const storePath = join(rootPath, 'store'); // Path to the store folder - Where our data is stored
  const dataPath = join(storePath, 'data'); // Path to the data folder
  console.log('Store is at: ' + storePath);

  // Check if the top level store folder exists
  if (!existsSync(storePath)) {
    console.warn('init: Store folder does not exist, creating...');
    mkdirSync(storePath);
  } else {
    console.debug('init: Store folder exists');
  }

  // Check if the app_preferences file exists
  if (!existsSync(join(storePath, 'app_preferences.json'))) {
    console.warn('init: Preferences file does not exist, creating...');
    writeFileSync(join(storePath, 'app_preferences.json'), JSON.stringify(defaultSettings, null, 2));
  } else {
    console.debug('init: Preferences file exists');
  }

  // Check if the app_config file exists
  if (!existsSync(join(storePath, 'app_config.json'))) {
    console.warn('init: App_Config file does not exist, creating...');
    writeFileSync(join(storePath, 'app_config.json'), JSON.stringify({ version: app.getVersion() }, null, 2));
  } else {
    console.debug('init: App_Config file exists');
  }

  // Check if the data folder exists
  if (!existsSync(join(dataPath))) {
    console.warn('init: Data folder does not exist, creating...');
    mkdirSync(join(dataPath));
  } else {
    console.debug('init: Data folder exists');
  }

  return;
};
