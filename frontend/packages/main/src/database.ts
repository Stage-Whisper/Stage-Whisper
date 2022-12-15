import {knex} from 'knex';
import {app} from 'electron';
import {join} from 'path';
import type {WhisperArgs} from '../../../types/whisper';
import {whisperLanguages, whisperModels} from '../../../types/whisper';

// Set up Knex
console.log('Initializing Database');

const rootPath = app.getPath('userData'); // Path to the top level of the data folder
const storePath = join(rootPath, 'store'); // Path to the store folder

export const db = knex({
  client: 'better-sqlite3',
  connection: {
    filename: join(storePath, 'database.sqlite'),
  },
  useNullAsDefault: true,
});

console.log('Database initialized');
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

/// ---------------------- Database ---------------------- ///
declare module 'knex/types/tables' {
  export interface Entry {
    // Config
    uuid: string; // UUID of the entry
    name: string; // Title of the entry
    description: string; // Description of the entry
    created: number; // Date the entry was created (in milliseconds since 1970)
    inQueue: boolean; // If the entry is in the queue
    queueWeight: number; // Absolute value of the queue weight, 0 is the highest priority
    activeTranscription: string | null; // The active transcription for the entry
    // Audio
    audio_type: //Audio files supported by Whisper in the form of an enum
    | 'mp3'
      | 'wav'
      | 'ogg'
      | 'flac'
      | 'aac'
      | 'm4a'
      | 'wma'
      | 'ac3'
      | 'mp2'
      | 'amr'
      | 'aiff'
      | 'au'
      | 'mpc'
      | 'opus'
      | 'tta'
      | 'voc'
      | 'wv'
      | 'webm';
    audio_path: string; // Path to the audio file
    audio_name: string; // Name of the audio file
    audio_language: WhisperArgs['language'] | undefined; // Language of the audio file
    audio_fileLength: number; // Length of the audio file in seconds
    audio_addedOn: number; // Date the audio file was added to the entry (in milliseconds since 1970)
  }

  export interface Transcription {
    entry: string; // UUID of the entry
    uuid: string; // UUID of the transcription
    transcribedOn: number; // Date the transcription was started (in milliseconds since 1970)
    path: string; // Path to the transcription folder
    model: WhisperArgs['model']; // Model used to transcribe the audio
    language: WhisperArgs['language']; // Language of the audio file
    status: transcriptionStatus; // Status of the transcription -- also used to determine if the transcription is complete
    progress: number; // Progress of the transcription
    translated: boolean; // Whether the transcription has been translated
    error: string | undefined; // Error message if the transcription failed
    completedOn: number; // Date the transcription was completed (in milliseconds since 1970)
  }

  export interface Line {
    uuid: string; // UUID of the line
    entry: string; // UUID of the entry
    transcription: string; // UUID of the transcription
    version: number; // Version of the line (used for undo/redo, 0 is the original)
    index: number; // Line number
    text: string; // Text of the line
    start: number; // Start time of the line in seconds
    end: number; // End time of the line in seconds
    deleted: boolean; // Whether the line has been deleted
  }

  export interface Settings {
    darkMode: boolean; // Whether dark mode is enabled
    language: string; // Language of the app
  }

  export interface Tables {
    entry: Entry;
    transcription: Transcription;
    line: Line;
    settings: Settings;
  }
}

// Create the tables
console.log('Creating tables...');

console.log('Creating settings table...');
db.schema.hasTable('settings').then(exists => {
  if (!exists) {
    db.schema
      .createTable('settings', table => {
        table.boolean('darkMode').defaultTo(false);
        table.string('language').defaultTo('en');
      })
      .then(() => {
        console.log('Created settings table');
      });
  }
});

console.log('Creating entries table...');
db.schema.hasTable('entries').then(exists => {
  if (!exists) {
    db.schema
      .createTable('entries', table => {
        table.string('uuid').primary().unique().notNullable();
        table.string('name').nullable();
        table.string('description').nullable();
        table.integer('created').notNullable().defaultTo(Date.now());
        table.boolean('inQueue').notNullable().defaultTo(false);
        table.integer('queueWeight').notNullable().defaultTo(0);
        table.string('tags').nullable().defaultTo(''); // TODO: Change to an array that works with SQLite (JSON?)
        table.string('activeTranscription').references('uuid').inTable('transcriptions').nullable();

        // Audio
        table.string('audio_type').notNullable().checkIn(validAudioTypes);
        table.string('audio_path').notNullable();
        table.string('audio_name').notNullable();
        table.string('audio_language').nullable().checkIn(Object.keys(whisperLanguages));
        table.integer('audio_fileLength').notNullable();
        table.integer('audio_addedOn').notNullable().defaultTo(Date.now());
      })
      .then(() => {
        console.log('Created table: entries');
      })
      .catch(err => {
        console.log('Error creating table: entries');
        console.error(err);
      });
  }
});

console.log('Creating transcriptions table...');
db.schema.hasTable('transcriptions').then(exists => {
  if (!exists) {
    db.schema
      .createTable('transcriptions', table => {
        table
          .string('entry')
          .references('uuid')
          .inTable('entries')
          .notNullable()
          .onDelete('CASCADE')
          .onUpdate('CASCADE');
        table.string('uuid').primary().unique().notNullable();
        table.integer('transcribedOn').notNullable();
        table.string('path').notNullable();
        table.string('model').notNullable().checkIn(Object.values(whisperModels));
        table.string('language').nullable().checkIn(Object.keys(whisperLanguages));
        table.string('status').notNullable().checkIn(Object.values(transcriptionStatus));
        table.integer('progress').notNullable().defaultTo(0);
        table.boolean('translated').nullable();
        table.string('error').nullable();
        table.integer('completedOn').nullable().defaultTo(Date.now());
      })
      .then(() => {
        console.log('Created table: transcriptions');
      })
      .catch(err => {
        console.log('Error creating table: transcriptions');
        console.error(err);
      });
  }
});

console.log('Creating lines table...');
db.schema.hasTable('lines').then(exists => {
  if (!exists) {
    db.schema
      .createTableIfNotExists('lines', table => {
        table.string('uuid').primary().notNullable();
        table
          .string('entry')
          .references('uuid')
          .inTable('entries')
          .notNullable()
          .onDelete('CASCADE')
          .onUpdate('CASCADE');
        table
          .string('transcription')
          .references('uuid')
          .inTable('transcriptions')
          .notNullable()
          .onUpdate('CASCADE')
          .onDelete('CASCADE');
        table.integer('start').notNullable();
        table.integer('end').notNullable();
        table.string('text').notNullable();
        table.integer('index').notNullable();
        table.boolean('deleted').notNullable().defaultTo(false);
        table.integer('version').notNullable().defaultTo(0);
      })
      .then(() => {
        console.log('Created table: lines');
      })
      .catch(err => {
        console.log('Error creating table: lines');
        console.error(err);
      });
  }
});

export default db;
