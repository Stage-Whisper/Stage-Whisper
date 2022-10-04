import { entry, entryAudioParams, entryConfig } from '../../types';
import { app, ipcMain, IpcMainInvokeEvent } from 'electron';
import { v4 as uuidv4 } from 'uuid';
import { copyFileSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { getAudioDurationInSeconds } from 'get-audio-duration';

// Create new entry and add it to the store

export type newEntryArgs = {
  filePath: string;
  audio: Omit<entryAudioParams, 'path' | 'addedOn' | 'fileLength'>;
  config: Omit<entryConfig, 'created' | 'inQueue' | 'queueWeight' | 'activeTranscription' | 'uuid'>;
};

export default ipcMain.handle(
  'new-entry',
  async (_event: IpcMainInvokeEvent, args: newEntryArgs): Promise<{ entry: entry | null; error?: string }> => {
    const rootPath = app.getPath('userData'); // Path to the top level of the data folder
    const storePath = join(rootPath, 'store'); // Path to the store folder
    const dataPath = join(storePath, 'data'); // Path to the data folder

    const uuid = uuidv4();
    console.log('NewEntry: Creating new entry with UUID: ' + uuid);

    try {
      console.log('NewEntry: Copying file to data folder');

      const newFilePath = join(dataPath, uuid, 'audio', args.audio.name);

      // Create entry
      const entry: entry = {
        config: {
          uuid: uuidv4(),
          inQueue: false,
          name: args.config.name,
          created: new Date(),
          queueWeight: 0,
          tags: args.config.tags,
          description: args.config.description,
          activeTranscription: null
        },
        audio: {
          name: args.audio.name,
          type: args.audio.type,
          fileLength: await getAudioDurationInSeconds(args.filePath),
          language: args.audio.language,
          addedOn: new Date(),
          path: newFilePath
        },
        path: join(dataPath, uuid),
        transcriptions: []
      };

      console.log('NewEntry: Creating Folder Structure');
      // Make folders
      const entryPath = join(dataPath, uuid);
      mkdirSync(join(entryPath)); // Make entry folder
      const audioPath = join(entryPath, 'audio');
      mkdirSync(join(audioPath)); // Make audio folder
      const transcriptionsPath = join(entryPath, 'transcriptions');
      mkdirSync(join(transcriptionsPath)); // Make transcriptions folder

      // Move file to data folder
      copyFileSync(args.filePath, newFilePath); // Copy file to new location
      console.log('NewEntry: File copied to: ' + newFilePath);

      console.log('NewEntry: Writing entry to store');
      // Make entry_config file
      writeFileSync(join(entryPath, 'entry_config.json'), JSON.stringify(entry.config, null, 2));
      // Make Audio Parameters file
      writeFileSync(join(audioPath, 'parameters.json'), JSON.stringify(entry.audio, null, 2));

      console.log('NewEntry: Entry created successfully');

      return { entry };
    } catch (error) {
      console.error('NewEntry: Error creating new entry: ' + error);
      if (error instanceof Error) {
        return { entry: null, error: error.message };
      } else return { entry: null, error: 'Unknown Error' };
    }
  }
);
