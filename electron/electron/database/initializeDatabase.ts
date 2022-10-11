import { whisperModels } from './../types/whisperTypes';
import { app } from 'electron';
import knex from 'knex';
import path from 'path';

// Types
import { transcriptionStatus } from '../types/types';
import { WhisperArgs, whisperLanguages } from '../types/whisperTypes';

const rootPath = app.getPath('userData'); // Path to the top level of the data folder
const storePath = path.join(rootPath, 'store'); // Path to the store folder

// Set up Knex
const db = knex({
  client: 'better-sqlite3',
  connection: {
    filename: path.join(storePath, 'database.sqlite')
  },
  useNullAsDefault: true
});
// Types
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
    uuid: string; // UUID of the transcription
    version: number; // Version of the line (used for undo/redo, 0 is the original)
    index: number; // Line number
    text: string; // Text of the line
    start: number; // Start time of the line in seconds
    end: number; // End time of the line in seconds
  }

  export interface Settings {
    darkMode: boolean; // Whether dark mode is enabled
    language: string; // Language of the app
  }

  export interface Tables {
    entry: Entry;
    transcription: Transcription;
    line: Line;
  }
}

// Valid Audio Types
const audioTypes = [
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
  'webm'
];

// Create the tables
console.log('Creating tables...');
db.schema.hasTable('entry').then((exists) => {
  if (!exists) {
    db.schema
      .createTable('entry', (table) => {
        table.string('uuid').primary().unique().notNullable();
        table.string('name').nullable();
        table.string('description').nullable();
        table.integer('created').notNullable().defaultTo(Date.now());
        table.boolean('inQueue').notNullable().defaultTo(false);
        table.integer('queueWeight').notNullable().defaultTo(0);
        table.string('tags').nullable().defaultTo(''); // TODO: Change to an array that works with SQLite (JSON?)
        table.string('activeTranscription').references('uuid').inTable('transcription').nullable();

        // Audio
        table.string('audio_type').notNullable().checkIn(audioTypes);
        table.string('audio_path').notNullable();
        table.string('audio_name').notNullable();
        table.string('audio_language').nullable().checkIn(Object.keys(whisperLanguages));
        table.integer('audio_fileLength').notNullable();
        table.integer('audio_addedOn').notNullable().defaultTo(Date.now());
      })
      .then(() => {
        console.log('Created table: entry');
      })
      .catch((err) => {
        console.log('Error creating table: entry');
        console.error(err);
      });
  }
});
db.schema.hasTable('transcription').then((exists) => {
  if (!exists) {
    db.schema
      .createTable('transcription', (table) => {
        table.string('entry').references('uuid').inTable('entry').notNullable();
        table.string('uuid').primary().unique().notNullable();
        table.integer('transcribedOn').notNullable().defaultTo(Date.now());
        table.string('path').notNullable();
        table.string('model').notNullable().checkIn(Object.values(whisperModels));
        table.string('language').notNullable().checkIn(Object.keys(whisperLanguages));
        table.string('status').notNullable().checkIn(Object.values(transcriptionStatus));
        table.integer('progress').notNullable().defaultTo(0);
        table.boolean('translated').notNullable().defaultTo(false);
        table.string('error').nullable();
        table.integer('completedOn').nullable();
      })
      .then(() => {
        console.log('Created table: transcription');
      })
      .catch((err) => {
        console.log('Error creating table: transcription');
        console.error(err);
      });
  }
});
db.schema.hasTable('line').then((exists) => {
  if (!exists) {
    db.schema
      .createTableIfNotExists('line', (table) => {
        table.string('uuid').references('uuid').inTable('transcription').notNullable();
        table.integer('version').notNullable().defaultTo(0);
        table.integer('index').notNullable();
        table.string('text').notNullable();
        table.integer('start').notNullable();
        table.integer('end').notNullable();
      })
      .then(() => {
        console.log('Created table: line');
      })
      .catch((err) => {
        console.log('Error creating table: line');
        console.error(err);
      });
  }
});

export default db;
