import type {newEntryParams, newEntryReturn} from './../../../preload/src/index';
import * as pc from 'picocolors';
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

export default ipcMain.handle(
  Channels.NEW_ENTRY,
  async (_event: IpcMainInvokeEvent, args: newEntryParams): Promise<newEntryReturn> => {
    console.log(pc.green('NewEntry: New entry request received...'));

    return new Promise((resolve, reject) => {
      const rootPath = app.getPath('userData'); // Path to the top level of the data folder
      const storePath = join(rootPath, 'store'); // Path to the store folder
      const audioPath = join(storePath, 'audio'); // Path to the audio folder

      const uuid = uuidv4();
      console.log('NewEntry: Creating new entry with UUID: ' + uuid + '...');

      const {name, description, audio_type, audio_name, audio_language, filePath} = JSON.parse(
        JSON.stringify(args),
      ) as newEntryParams[0];

      // Check if the args exist
      if (
        name === undefined ||
        description === undefined ||
        audio_type === undefined ||
        audio_name === undefined ||
        audio_language === undefined ||
        filePath === undefined
      ) {
        console.group(pc.red('NewEntry: Missing arguments!'));

        console.assert(name, pc.yellow('name'));
        console.assert(description, pc.yellow('description'));
        console.assert(audio_type, pc.yellow('audio_type'));
        console.assert(audio_name, pc.yellow('audio_name'));
        console.assert(audio_language, pc.yellow('audio_language'));
        console.assert(filePath, pc.yellow('filePath'));
        console.groupEnd();

        reject(new Error('Missing arguments!'));
      }

      // Create Sqlite entry
      const entry: Entry = {
        uuid: uuid,
        name,
        description,
        created: BigInt(Date.now()),
        inQueue: false,
        queueWeight: 0,
        activeTranscription: null,
        audio_type,
        audio_path: join(audioPath, audio_name),
        audio_name,
        audio_language,
        audio_fileLength: BigInt(0),
        audio_addedOn: BigInt(Date.now()),
      };

      // Copy audio file to ./store/audio/{file}
      // TODO: Add a uuid to the file name to avoid collisions
      try {
        console.log('NewEntry: Copying audio file to store...');
        copyFileSync(filePath, entry.audio_path);
        console.log('NewEntry: Audio file copied to store.');
      } catch (error) {
        console.error('NewEntry: Error moving audio file to data folder: ' + error + '!');
        throw new Error('Error moving audio file to data folder!');
      }

      prisma.entry
        .create({
          data: entry,
        })
        .then(response => {
          console.log('NewEntry: Entry added to database.');
          resolve({entry: response});
        })
        .catch(err => {
          console.error('NewEntry: Error adding entry to database: ' + err + '!');
          reject(err);
        });
    });
  },
);
