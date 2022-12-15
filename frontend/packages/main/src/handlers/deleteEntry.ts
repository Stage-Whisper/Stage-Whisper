// Database
import db from '../database';

// Packages
import {ipcMain} from 'electron';

// Types
import type {IpcMainInvokeEvent as invoke} from 'electron';
import type {Entry, Line, Transcription} from 'knex/types/tables';
import {Channels} from '../../../../types/channels';

ipcMain.handle(Channels.DELETE_ENTRY, async (_event: invoke, entry: Entry): Promise<void> => {
  try {
    await db
      .transaction(async trx => {
        await trx<Entry>('entries').where({uuid: entry.uuid}).del();
        await trx<Transcription>('transcriptions').where({entry: entry.uuid}).del();
        await trx<Line>('lines').where({entry: entry.uuid}).del();
      })
      .then(() => {
        console.log('Deleted entry: ' + entry.uuid);
        return;
      })
      .catch(err => {
        console.log('Error deleting entry: ' + entry.uuid);
        throw err;
      });
  } catch (err) {
    console.error(err);
  }
});
