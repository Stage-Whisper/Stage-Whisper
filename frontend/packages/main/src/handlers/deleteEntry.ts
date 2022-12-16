// Database
import type {Entry} from '@prisma/client';
import {prisma} from '../database';

// Packages
import {ipcMain} from 'electron';

// Types
import type {IpcMainInvokeEvent as invoke} from 'electron';
import {Channels} from '../../../../types/channels';

ipcMain.handle(Channels.DELETE_ENTRY, async (_event: invoke, entry: Entry): Promise<void> => {
  console.log('Deleting entry, transcriptions and lines for entry: ' + entry.uuid);
  await prisma.$transaction([
    prisma.line.deleteMany({
      where: {
        transcription: {
          entry: {
            uuid: entry.uuid,
          },
        },
      },
    }),
    prisma.transcription.deleteMany({
      where: {
        entry: {
          uuid: entry.uuid,
        },
      },
    }),
  ]);
  prisma.entry
    .delete({
      where: {
        uuid: entry.uuid,
      },
    })
    .then(() => {
      console.log('Deleted entry, transcriptions and lines for entry: ' + entry.uuid);
      return;
    })
    .catch(err => {
      console.log('Error deleting entry, transcriptions and lines for entry: ' + entry.uuid);
      throw err;
    });
});
