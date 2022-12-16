// Database
import {prisma} from '../database';

// Packages
import {app, ipcMain} from 'electron';
import {copyFileSync} from 'fs';
import {join} from 'path';
import {v4 as uuidv4} from 'uuid';

// Types
import type {IpcMainInvokeEvent} from 'electron';
import type {Entry} from '@prisma/client';
import {Channels} from '../../../../types/channels';

// Response type for the new-entry channel
export type NewEntryResponse = {
  entry: Entry;
};

// Create new entry and add it to the database
export type newEntryArgs = {
  filePath: Entry['audio_path'];
  name: Entry['name'];
  description: Entry['description'];
  audio_type: Entry['audio_type'];
  audio_language: Entry['audio_language'];
  audio_name: Entry['audio_name'];
};

export default ipcMain.handle(
  Channels.NEW_ENTRY,
  async (_event: IpcMainInvokeEvent, args: newEntryArgs): Promise<NewEntryResponse> => {
    const rootPath = app.getPath('userData'); // Path to the top level of the data folder
    const storePath = join(rootPath, 'store'); // Path to the store folder
    const audioPath = join(storePath, 'audio'); // Path to the audio folder

    const uuid = uuidv4();
    console.log('NewEntry: Creating new entry with UUID: ' + uuid + '...');

    // Create Sqlite entry
    const entry: Entry = {
      uuid: uuid,
      name: args.name,
      description: args.description,
      created: BigInt(Date.now()),
      inQueue: false,
      queueWeight: 0,
      activeTranscription: null,
      audio_type: args.audio_type,
      audio_path: join(audioPath, args.audio_name),
      audio_name: args.audio_name,
      audio_language: args.audio_language,
      audio_fileLength: BigInt(0),
      audio_addedOn: BigInt(Date.now()),
    };

    // Copy audio file to ./store/audio/{file}
    // TODO: Add a uuid to the file name to avoid collisions
    try {
      console.log('NewEntry: Copying audio file to store...');
      copyFileSync(args.filePath, entry.audio_path);
      console.log('NewEntry: Audio file copied to store.');
    } catch (error) {
      console.error('NewEntry: Error moving audio file to data folder: ' + error + '!');
      throw new Error('Error moving audio file to data folder!');
    }

    const response = await prisma.entry.create({
      data: entry,
    });

    if (response === null) {
      throw new Error('Error adding entry to database!');
    } else {
      return {entry};
    }
  },
);
