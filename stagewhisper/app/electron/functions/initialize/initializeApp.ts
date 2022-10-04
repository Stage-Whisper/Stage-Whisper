import { entry } from '../../types';
// Initialize the app with the data folder

import {
  // copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync
} from 'fs';
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
  const rootPath = app.getPath('userData'); // Path to the top level the electron app - Also includes other files like localStorage, Cache, extensions, etc
  const storePath = join(rootPath, 'store'); // Path to the store folder - Where our data is stored
  const dataPath = join(storePath, 'data'); // Path to the data folder
  console.log('Initializing app');
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

  // Get settings from preferences file for first run
  // const settings: appConfigType = JSON.parse(readFileSync(join(storePath, 'app_preferences.json')).toString());
  console.debug('init: Getting settings from preferences file');
  const settingsRaw = readFileSync(join(storePath, 'app_preferences.json'));
  const settings = (await JSON.parse(settingsRaw.toString())) as appConfigType;

  // Check if the data folder contains any entries
  if (readdirSync(join(dataPath)).length == 0 && settings.firstRun) {
    // FIXME: #47 This creates an entry without an audio file, this will cause issues as the app will try to load the audio file
    {
      console.warn('init: No entries found, is first run, creating sample...');

      // Copy the sample entry to the data folder
      // fs.copyFileSync(join(__dirname, 'sample'), join(dataPath, 'sample'));

      const sampleEntry: entry = {
        config: {
          uuid: '1bfb7987-da1d-4a02-87a9-e841c5dd4e29',
          inQueue: false,
          name: 'Sample Entry',
          created: new Date(),
          queueWeight: 0,
          tags: ['sample', 'tags'],
          description: 'sample description',
          activeTranscription: null
        },
        audio: {
          name: 'sample.mp3',
          path: join(dataPath, 'entry_1bfb7987-da1d-4a02-87a9-e841c5dd4e29', 'audio', 'sample.mp3'),
          fileLength: 200,
          type: 'mp3',
          addedOn: new Date(),
          language: 'English'
        },
        path: join(dataPath, 'entry_1bfb7987-da1d-4a02-87a9-e841c5dd4e29'),
        transcriptions: []
      };
      // Create the entry folder
      console.log('init: Creating entry folder...');
      mkdirSync(join(dataPath, sampleEntry.config.uuid));

      const entryPath = join(dataPath, sampleEntry.config.uuid);

      // Write the sample entry to the data folder
      console.log('init: Writing config file...');
      writeFileSync(join(entryPath, 'entry_config.json'), JSON.stringify(sampleEntry.config, null, 2));

      // Create the audio folder
      console.log('init: Creating audio folder...');
      mkdirSync(join(entryPath, 'audio'));

      const audioPath = join(entryPath, 'audio');

      // Write the sample entry's audio parameter file to the data folder
      console.log('init: Writing audio parameters file...');
      writeFileSync(join(audioPath, 'parameters.json'), JSON.stringify(sampleEntry.audio, null, 2));

      // Copy the sample audio file to the data folder
      // console.log("init: Copying sample entry's audio file into directory...");
      // copyFileSync(join(__dirname, 'assets', ''), join(audioPath, 'sample.mp3'));

      // Create the transcriptions folder
      console.log("init: Creating sample entry's transcriptions folder...");
      mkdirSync(join(entryPath, 'transcriptions'));

      // Set firstRun to false
      settings.firstRun = false;
    }
  }
  return;
};
