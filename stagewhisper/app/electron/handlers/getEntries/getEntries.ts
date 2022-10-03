import { ipcMain, IpcMainInvokeEvent } from 'electron';
// File to import all data from the data folder

import { join } from 'path';
import { readdirSync, readFileSync } from 'fs';
import { app } from 'electron';
import { entry, entryTranscription } from './types';

// Paths

const rootPath = app.getPath('userData'); // Path to the top level of the data folder
const storePath = join(rootPath, 'store'); // Path to the store folder
const dataPath = join(storePath, 'data'); // Path to the data folder

// Layout of the app data
// store/
// ├── app_preferences.json { darkmode, langauge, ... }
// ├── app_config.json { version, repo, ... }
// └── data/
//     ├── entry_{uuidv4}/
//     │   ├── entry_config.json { inQueue, title, model, etc }
//     │   ├── audio/
//     │   │   ├── file.mp3 | file.opus | file.wav
//     │   │   └── parameters.json { addedOn, language, type }
//     │   └── transcriptions/
//     │       └── {uuid}/
//     │           ├── parameters.json { language, transcribedOn, model, ... }
//     │           ├── transcript.vtt (Use VTT as source of truth and compile to txt)
//     │           └── transcript.txt
//     └── entry_1bfb7987-da1d-4a02-87a9-e841c5dd4e29/
//         ├── entry_config.json
//         ├── audio/
//         │   ├── fancy_twice_sample.opus
//         │   └── parameters.json {addedOn: 30-12-9999, language: Korean, tpye: Opus
//         └── transcriptions/
//             ├── 3a8b37f4-3a41-4522-b3cc-1c6e28a3ab75/
//             │   ├── parameters.json { langauge: English, transcribedOn: 30-12-9999, model: baseEn, ... }
//             │   ├── transcript.vtt
//             │   └── transcript.txt
//             └── 7fcf511c-f9d5-4bdc-a427-19a28f6e8ca1/
//                 ├── parameters.json { langauge: Korean, transcribedOn: 30-12-9999, model: large, ... }
//                 ├── transcript.vtt
//                 └── transcript.txt

// Error handling
// enum getEntriesErrors {
//   NO_DATA_FOLDER = 'NO_DATA_FOLDER',
//   NO_CONFIG_FILE = 'NO_CONFIG_FILE',
//   NO_AUDIO_FOLDER = 'NO_AUDIO_FOLDER',
//   NO_AUDIO_FILE = 'NO_AUDIO_FILE',
//   NO_TRANSCRIPTIONS_FOLDER = 'NO_TRANSCRIPTIONS_FOLDER',
//   NO_ENTRIES = 'NO_ENTRIES'
// }

// Get all entries
export default ipcMain.handle(
  'get-entries',
  async (_event: IpcMainInvokeEvent): Promise<{ entries: entry[]; error?: string }> => {
    const entries: entry[] = [];

    console.log('Getting entries');
    console.log('Data path: ', dataPath);

    // Get all entries
    try {
      const entryFolders = readdirSync(dataPath, { withFileTypes: true }).filter((dirent) => dirent.isDirectory());
      console.log('Entry folders: ', entryFolders);

      // For each entry folder get the config and audio files and add them to the entries array
      try {
        entryFolders.forEach((entryFolder) => {
          // Check if the entry folder has a config file
          const configPath = join(dataPath, entryFolder.name, 'entry_config.json');
          if (!readdirSync(join(dataPath, entryFolder.name)).includes('entry_config.json')) {
            // throw new Error(`Entry ${entryFolder.name} does not have a config file`);
            console.log(`Entry ${entryFolder.name} does not have a config file`);
            return;
          }

          // Check if the entry folder has an audio folder
          const audioPath = join(dataPath, entryFolder.name, 'audio');
          if (!readdirSync(join(dataPath, entryFolder.name)).includes('audio')) {
            throw new Error(`Entry ${entryFolder.name} does not have an audio folder`);
          }

          // Check if the entry folder has a transcriptions folder and if it has any transcriptions
          const transcriptionsPath = join(dataPath, entryFolder.name, 'transcriptions');
          if (!readdirSync(join(dataPath, entryFolder.name)).includes('transcriptions')) {
            throw new Error(`Entry ${entryFolder.name} does not have a transcriptions folder`);
          }

          // Get the config file
          const config = JSON.parse(readFileSync(configPath, 'utf8'));

          // Get the audio file
          const audio = JSON.parse(readFileSync(join(audioPath, 'parameters.json'), 'utf8'));

          // Get the transcriptions
          const transcriptions: entryTranscription[] = [];
          readdirSync(transcriptionsPath, { withFileTypes: true })
            .filter((dirent) => dirent.isDirectory())
            .forEach((transcriptionFolder) => {
              // Get the parameters file
              const parameters = JSON.parse(
                readFileSync(join(transcriptionsPath, transcriptionFolder.name, 'parameters.json'), 'utf8')
              );

              // Get the transcript file
              const transcript = readFileSync(
                join(transcriptionsPath, transcriptionFolder.name, 'transcript.vtt'),
                'utf8'
              );

              // Add the transcription to the transcriptions array
              const transcription: entryTranscription = {
                uuid: transcriptionFolder.name,
                transcribedOn: parameters.transcribedOn,
                language: parameters.language,
                model: parameters.model,
                path: join(transcriptionsPath, transcriptionFolder.name),
                vtt: transcript
              };

              transcriptions.push(transcription);
            });

          // Add the entry to the entries array
          const entry: entry = {
            uuid: config.uuid,
            path: join(dataPath, entryFolder.name),
            config: {
              title: config.title,
              inQueue: config.inQueue,
              queueWeight: config.queueWeight,
              created: config.created,
              tags: config.tags
            },
            audio: {
              name: audio.name,
              addedOn: audio.addedOn,
              language: audio.language,
              type: audio.type,
              path: join(audioPath, audio.type)
            },
            transcriptions: transcriptions
          };

          entries.push(entry);
        });

        return { entries: entries };
      } catch (error) {
        console.error(error);
        if (error instanceof Error) {
          return { entries: entries, error: error.message };
        } else {
          return { entries: entries, error: 'Unknown error' };
        }
      }
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        return { entries: entries, error: error.message };
      } else {
        return { entries: entries, error: 'Unknown error' };
      }
    }
  }
);
