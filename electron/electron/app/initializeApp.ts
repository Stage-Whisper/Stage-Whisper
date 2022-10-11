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
  const audioPath = join(storePath, 'audio'); // Path to the audio folder

  console.log('Store is at: ' + storePath);

  // Check if the top level store folder exists
  if (!existsSync(storePath)) {
    console.warn('init: Store folder does not exist, creating...');
    mkdirSync(storePath);
  }

  // Check if audio folder exists
  if (!existsSync(audioPath)) {
    console.warn('init: Audio folder does not exist, creating...');
    mkdirSync(audioPath);
  }

  return;
};
