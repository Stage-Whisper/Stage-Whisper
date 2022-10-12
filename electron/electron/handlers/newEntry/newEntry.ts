// Packages
import { app, ipcMain, IpcMainInvokeEvent } from 'electron';
import { copyFileSync } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

// Types
import { Entry } from 'knex/types/tables';
import db from '../../database/database';
import { Channels, NewEntryResponse } from '../../types/channels';
import { entryAudioParams, entryConfig } from '../../types/types';

// Create new entry and add it to the database
export type newEntryArgs = {
  filePath: string;
  audio: Omit<entryAudioParams, 'path' | 'addedOn' | 'fileLength'>;
  config: Omit<entryConfig, 'created' | 'inQueue' | 'queueWeight' | 'activeTranscription' | 'uuid'>;
};

export default ipcMain.handle(
  Channels.newEntry,
  async (_event: IpcMainInvokeEvent, args: newEntryArgs): Promise<NewEntryResponse> => {
    const rootPath = app.getPath('userData'); // Path to the top level of the data folder
    const storePath = join(rootPath, 'store'); // Path to the store folder
    const audioPath = join(storePath, 'audio'); // Path to the audio folder

    const uuid = uuidv4();
    console.log('NewEntry: Creating new entry with UUID: ' + uuid + '...');

    // Create Sqlite entry
    const entry: Entry = {
      uuid: uuid,
      name: args.config.name,
      description: args.config.description,
      created: Date.now(),
      inQueue: false,
      queueWeight: 0,
      activeTranscription: null,
      audio_type: args.audio.type,
      audio_path: join(audioPath, args.audio.name),
      audio_name: args.audio.name,
      audio_language: args.audio.language,
      audio_fileLength: 0,
      audio_addedOn: Date.now()
    };

    // Copy audio file to ./store/audio/{file}
    try {
      console.log('NewEntry: Copying audio file to store...');
      copyFileSync(args.filePath, entry.audio_path);
      console.log('NewEntry: Audio file copied to store.');
    } catch (error) {
      console.error('NewEntry: Error moving audio file to data folder: ' + error + '!');
      throw new Error('Error moving audio file to data folder!');
    }

    // Add entry to database
    let response: null | Entry = null;
    try {
      await db
        .insert(entry)
        .into('entry')
        .then(() => {
          console.log('NewEntry: Entry added to database!');
          response = entry;
        })
        .catch((error) => {
          console.error('NewEntry: Error adding entry to database: ' + error + '!');
          throw new Error('Error adding entry to database!');
        });
    } catch (error) {
      throw new Error('Error adding entry to database' + error + '!');
    }

    if (response === null) {
      throw new Error('Error adding entry to database!');
    } else {
      return response;
    }
  }
);
