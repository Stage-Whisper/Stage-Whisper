import { LoadDatabaseResponse } from '../../types/channels';
import { ipcMain } from 'electron';
// File to import all data from the data folder

import { join } from 'path';
import { readdirSync, readFileSync } from 'fs';
import { app } from 'electron';
import { entry, entryTranscription } from '../../types/types';
import { Channels } from '../../types/channels';

// Subtitle Parser
import { parseSync } from 'subtitle';

// Paths
const rootPath = app.getPath('userData'); // Path to the top level of the data folder
const storePath = join(rootPath, 'store'); // Path to the store folder
const dataPath = join(storePath, 'data'); // Path to the data folder

// Layout of the app data
//  store/
//     ├── app_preferences.json { darkmode, langauge, ... }
//     ├── app_config.json { version, repo, ... }
//     └── data/
//         ├── {uuidv4}/
//         │   ├── entry.json { inQueue, title, model, etc }
//         │   ├── audio/
//         │   │   ├── file.mp3 | file.opus | file.wav
//         │   │   └── audio.json { addedOn, language, type }
//         │   └── transcriptions/
//         │       └── {uuid}/
//         │           ├── transcription.json { language, transcribedOn, model, ... }
//         │           ├── transcript.vtt (Use VTT as source of truth and compile to txt)
//         │           └── transcript.txt
//         └── 1bfb7987-da1d-4a02-87a9-e841c5dd4e29/
//             ├── entry.json
//             ├── audio/
//             │   ├── fancy_twice_sample.opus
//             │   └── audio.json {addedOn: 30-12-9999, language: Korean, tpye: Opus
//             └── transcriptions/
//                 ├── 3a8b37f4-3a41-4522-b3cc-1c6e28a3ab75/
//                 │   ├── transcription.json { langauge: English, transcribedOn: 30-12-9999, model: baseEn, ... }
//                 │   ├── transcript.vtt
//                 │   └── transcript.txt
//                 └── 7fcf511c-f9d5-4bdc-a427-19a28f6e8ca1/
//                     ├── transcription.json { langauge: Korean, transcribedOn: 30-12-9999, model: large, ... }
//                     ├── transcript.vtt
//                     └── transcript.txt

// Get all entries
export default ipcMain.handle(Channels.loadDatabase, async (): Promise<LoadDatabaseResponse> => {
  const entries: entry[] = [];

  console.log('Getting entries');
  console.log('Data path: ', dataPath);

  // Get all entries
  try {
    const entryFolders = readdirSync(dataPath, { withFileTypes: true }).filter(
      // filter out directories that aren't in the format uuidv4
      (dirent) =>
        dirent.isDirectory() &&
        dirent.name.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
    );
    console.log('Found %s Entry Folders', entryFolders.length);

    // For each entry folder get the config and audio files and add them to the entries array

    entryFolders.forEach(async (entryFolder) => {
      // Check if the entry folder has a config file
      const entryPath = join(dataPath, entryFolder.name);
      const configPath = join(entryPath, 'entry.json');

      if (!readdirSync(join(entryPath)).includes('entry.json')) {
        // throw new Error(`Entry ${entryFolder.name} does not have a config file`);
        console.warn(`LoadDatabase: Entry ${entryFolder.name} does not have a config file`);
        return;
      }

      // Check if the entry folder has an audio folder
      const audioFolderPath = join(entryPath, 'audio');
      try {
        readdirSync(join(entryPath)).includes('audio');
      } catch (error) {
        console.warn(`LoadDatabase: Entry ${entryFolder.name} does not have an audio folder`);
        return;
      }

      // Check if the entry folder has a transcriptions folder and if it has any transcriptions
      const transcriptionFolderPath = join(entryPath, 'transcriptions');
      try {
        readdirSync(join(entryPath)).includes('transcriptions');
      } catch (error) {
        console.warn(`LoadDatabase: Entry ${entryFolder.name} does not have a transcriptions folder`);
        return;
      }

      // Get the config file
      const config = JSON.parse(readFileSync(configPath, 'utf8')) as entry['config'];

      // Get the audio file
      const audio = JSON.parse(readFileSync(join(audioFolderPath, 'audio.json'), 'utf8')) as entry['audio'];

      // Get the transcriptions
      const transcriptions: entryTranscription[] = [];
      readdirSync(transcriptionFolderPath, { withFileTypes: true })
        .filter(
          async (dirent) =>
            dirent.isDirectory() &&
            dirent.name.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
        )
        .forEach(async (transcriptionFolder) => {
          // Check if the transcription folder has a transcription.json file
          const transcriptionPath = join(transcriptionFolderPath, transcriptionFolder.name);
          const transcriptionConfigPath = join(transcriptionPath, 'transcription.json');

          try {
            readFileSync(transcriptionConfigPath);
          } catch {
            console.warn(`LoadDatabase: Transcription ${transcriptionFolder.name} does not have a config file`);
            return; // TODO: #54 Implement a way to handle this error ( Transcription was not handled and has no config file )
          }

          // If it exists get the transcription.json file
          const parameters = JSON.parse(readFileSync(join(transcriptionConfigPath), 'utf8'));

          // Check if the transcription folder has a transcript.vtt file
          try {
            readdirSync(transcriptionPath).includes(`${audio.name}.vtt`);
          } catch {
            console.warn(`LoadDatabase: Transcription ${transcriptionFolder.name} does not have a transcript.vtt file`);
            return; // TODO: #55 Implement a way to handle this error ( Transcription was not handled and has no transcript file )
          }

          // If it exists get the transcript.vtt file

          const vttPath = join(transcriptionPath, `${audio.name}.vtt`);
          // const transcript = readFileSync(join(vttPath), 'utf8');
          const vttFile = readFileSync(join(vttPath), 'utf8');
          const vtt = parseSync(vttFile);

          // Add the transcription to the transcriptions array
          const transcription: entryTranscription = {
            uuid: transcriptionFolder.name,
            transcribedOn: parameters.transcribedOn,
            language: parameters.language,
            model: parameters.model,
            path: join(transcriptionFolderPath, transcriptionFolder.name),
            vtt,
            status: parameters.status,
            progress: parameters.progress,
            translated: parameters.translated,
            completedOn: parameters.completedOn,
            error: parameters.error
          };
          console.log('LoadDatabase: Transcription Added: ', transcription.uuid);
          transcriptions.push(transcription);
        });

      // Add the entry to the entries array
      const entry: entry = {
        path: join(entryPath),
        config: {
          name: config.name,
          description: config.description,
          inQueue: config.inQueue,
          queueWeight: config.queueWeight,
          created: config.created,
          tags: config.tags,
          activeTranscription: config.activeTranscription,
          uuid: config.uuid
        },
        audio: {
          name: audio.name,
          addedOn: audio.addedOn,
          fileLength: audio.fileLength,
          language: audio.language,
          type: audio.type,
          path: join(audioFolderPath, audio.name)
        },
        transcriptions: transcriptions
      };
      console.log('LoadDatabase: Entry Added: ', entry.config.name);
      entries.push(entry);
    });

    // Log to table
    console.table(
      entries.map((entry) => {
        return { name: entry.config.name, numTranscripts: entry.transcriptions.length, lang: entry.audio.language };
      })
    );

    return { entries: entries };
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      return { entries: entries, error: error.message };
    } else {
      return { entries: entries, error: 'Unknown error' };
    }
  }
});
