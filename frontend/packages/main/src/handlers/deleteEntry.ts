// Database
import {prisma} from '../database/database';

// Packages
import {ipcMain} from 'electron';

// Types
import type {IpcMainInvokeEvent as invoke} from 'electron';
import {Channels} from '../../../../types/channels';
import type {deleteEntryParams, deleteEntryReturn} from '../../../preload/src';

ipcMain.handle(
  Channels.DELETE_ENTRY,
  async (_event: invoke, args: deleteEntryParams): Promise<deleteEntryReturn> => {
    // Extract the arguments
    const {entryUUID} = args[0];

    console.log('Deleting entry, transcriptions and lines for entry: ' + entryUUID);
    await prisma.$transaction([
      prisma.line.deleteMany({
        where: {
          transcription: {
            entry: {
              uuid: entryUUID,
            },
          },
        },
      }),
      prisma.transcription.deleteMany({
        where: {
          entry: {
            uuid: entryUUID,
          },
        },
      }),
    ]);
    prisma.entry
      .delete({
        where: {
          uuid: entryUUID,
        },
      })
      .then(() => {
        console.log('Deleted entry, transcriptions and lines for entry: ' + entryUUID);
        return;
      })
      .catch(err => {
        console.log('Error deleting entry, transcriptions and lines for entry: ' + entryUUID);
        throw err;
      });
  },
);
