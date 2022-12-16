import {PrismaClient} from '@prisma/client';
// import {app} from 'electron';
// import {existsSync} from 'fs';
// import {join} from 'path';

// Set up Prisma/SQLite
console.log('Initializing Database');

export const prisma = new PrismaClient();

// Add prisma middleware
prisma.$use(async (params, next) => {
  const result = await next(params);
  console.log(`Query: ${params.model}.${params.action}`);
  return result;
});

// Check if the database exists
prisma.$connect();

// Check if the database exists
// if (!existsSync(join(app.getPath('userData'), 'store', 'database.sqlite'))) {
// console.log('Database does not exist, creating...');

// const rootPath = app.getPath('userData'); // Path to the top level of the data folder
// const storePath = join(rootPath, 'store'); // Path to the store folder

/// ---------------------- Types ---------------------- ///

// Valid Audio Types
export const validAudioTypes = [
  'mp3',
  'mpeg',
  'wav',
  'ogg',
  'flac',
  'aac',
  'm4a',
  'wma',
  'ac3',
  'mp2',
  'amr',
  'aiff',
  'au',
  'mpc',
  'opus',
  'tta',
  'voc',
  'wv',
  'webm',
  'x-m4a',
  'x-ms-wma',
  'x-wav',
  'x-flac',
  'x-matroska',
  'x-mpegurl',
  'x-ms-asf',
  'x-ms-wax',
  'x-ms-wvx',
];

// List of possible entry statuses
export enum transcriptionStatus {
  IDLE = 'idle', // User has added a file to be transcribed but it has not been added to the queue
  QUEUED = 'queued', // User has indicated they want to transcribe this file
  PENDING = 'pending', // Transcription has started but its progress is unknown
  PROCESSING = 'processing', // Transcription is in progress
  STALLED = 'stalled', // Transcription is taking too long (probably due to a large model)
  ERROR = 'error', // Transcription has failed
  PAUSED = 'paused', // Transcription has been paused by the user
  COMPLETE = 'complete', // Transcription has finished
  CANCELLED = 'cancelled', // Transcription has been cancelled by the user
  DELETED = 'deleted', // Transcription has been deleted by the user
  UNKNOWN = 'unknown', // Transcription status is unknown (probably due to an error talking to the transcriber)
}
