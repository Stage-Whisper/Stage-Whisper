import * as readline from 'node:readline';
// Electron
import { app, ipcMain, IpcMainInvokeEvent } from 'electron';
import { join } from 'path';
import isDev from 'electron-is-dev';

// Packages
import { spawn } from 'child_process';
import { existsSync, mkdirSync, readFileSync } from 'fs';
import { NodeCue, parseSync } from 'subtitle';
import { v4 as uuidv4 } from 'uuid';

// Types
import { Entry, Line, Transcription } from 'knex/types/tables';
import db, { transcriptionStatus } from '../../database/database';
import { Channels } from '../../types/channels';
import { WhisperArgs } from '../../types/whisperTypes';

export type RunWhisperResponse = {
  transcription: Transcription;
  entry: Entry;
};

export default ipcMain.handle(
  Channels.runWhisper,
  async (_event: IpcMainInvokeEvent, args: WhisperArgs, entry: Entry): Promise<RunWhisperResponse> => {
    const { inputPath, language } = args;
    let { model, device, task } = args;

    // Paths
    const rootPath = app.getPath('userData'); // Path to the top level of the data folder
    const storePath = join(rootPath, 'store'); // Path to the store folder
    const whisperPath = join(storePath, 'whisper'); // Path to the whisper folder

    // Check if whisper path exists - if not, create it
    try {
      existsSync(whisperPath);
    } catch (error) {
      mkdirSync(whisperPath);
    }

    // Output will be stored in "./store/whisper/{transcription_uuid}/" as an .srt, .vtt, .txt and .json file
    // ------------------  Set defaults for the whisper model ------------------ //

    if (!model) model = 'base'; // Default to Base multilingual model

    if (!device) device = 'cpu'; // If no device is specified, use the cpu

    if (language !== 'unknown') {
      // If the language is unknown, let whisper decide which task to use
      if (!task) {
        // If no task is specified, check if the audio file's language is English
        // If = english, use transcribe, if not, use translate
        if (language === 'English') task = 'transcribe';
        else task = 'translate';
      }
    }

    if (!inputPath) {
      // If no input path is specified, throw -- This should never happen
      throw new Error('No input path provided');
    }
    const uuid = uuidv4(); // Generate UUID for the transcription

    const transcribedOn = new Date().getTime(); // Get the current date and time for when the transcription was started

    // Generate output path
    const outputDir = join(whisperPath, uuid);

    // ------------------  Construct the input array for the whisper script ------------------ //
    const inputArray = ['--verbose', 'true']; // Array to hold the input arguments for the whisper script

    inputArray.push('--output_dir', outputDir); // Add the output directory

    // If the task is transcribe, add the transcribe flag
    if (task === 'transcribe') inputArray.push('--task', 'transcribe');
    // If the task is translate, add the translate flag
    else if (task === 'translate') inputArray.push('--task', 'translate');

    // If the language is defined, add the language flag
    if (language && language !== 'unknown') inputArray.push('--language', language);

    // If the model is defined, add the model flag
    if (model) inputArray.push('--model', model);

    // If the device is defined, add the device flag
    if (device) inputArray.push('--device', device);

    // Add the input path
    inputArray.push('--input', inputPath);

    // ---------------------------------  Run the whisper script --------------------------------- //

    console.log('RunWhisper: Running model with args', inputArray);

    // Create a new env that has PythonUnbuffered set to true
    // This will allow the child process to output to the console
    const env = Object.create(process.env);
    env.PYTHONUNBUFFERED = '1';

    // Spawn the whisper script
    let childProcessArgs: [string, string[]?, object?];
    if (isDev) {
      const backendDir = join(__dirname, '../../../../backend/');
      childProcessArgs = [
        'poetry',
        ['run', 'stagewhisper', ...inputArray],
        {
          env,
          cwd: backendDir
        }
      ];
    } else {
      childProcessArgs = ['echo', ['"Production backend not yet implemented"']];
    }
    const transcription = await new Promise<Transcription>((resolve, reject) => {
      const childProcess = spawn(...childProcessArgs);

      // Detect if parent node process is killed
      process.on('SIGINT', () => {
        console.log('RunWhisper: Parent process killed, killing child process');
        childProcess.kill();
        process.exit();
      });

      // Create a line reader to read the output of the whisper script
      const lineReader = readline.createInterface({
        input: childProcess.stdout,
        terminal: false
      });

      // When a line is read, handle it
      lineReader.on('line', (line: Buffer) => {
        console.log('RunWhisper: Line read', line.toString());
      });

      childProcess.on('close', async (code: number) => {
        console.log(`RunWhisper: Child process closed with code ${code}`);
        if (code === 0) {
          // ------------------  Convert the VTT file to Json ------------------ //
          const vttPath = join(outputDir, `${entry.audio_name}.vtt`);
          console.log('RunWhisper: Converting VTT to JSON...');
          console.log('RunWhisper: vttPath', vttPath);

          // Check that the VTT file exists
          try {
            existsSync(vttPath);
          } catch (error) {
            console.log('RunWhisper: Error checking if VTT file exists', error);
            throw new Error('Error checking if VTT file exists');
          }

          // Read the VTT file
          let vttFile;
          try {
            vttFile = readFileSync(vttPath, 'utf8');
            console.log('RunWhisper: VTT file read successfully.');
          } catch (error) {
            console.log('RunWhisper: Error reading VTT file!', error);
            throw new Error('Error reading VTT file!');
          }

          // Split the VTT file into an array of lines
          console.log('RunWhisper: Parsing VTT file...');
          const lines = parseSync(vttFile);

          // Check if the VTT file is empty
          if (lines.length === 0) {
            console.log('RunWhisper: VTT file is empty!');
            throw new Error('VTT file is empty!');
          }

          // Remove header lines from the VTT file
          console.log('RunWhisper: Removing header lines from VTT file...');
          const cues = lines.filter((line) => line.type === 'cue') as NodeCue[];

          // Add to the database
          console.log('RunWhisper: Building transcription object...');
          const transcription: Transcription = {
            uuid,
            entry: entry.uuid,
            transcribedOn,
            path: outputDir,
            model,
            language,
            status: transcriptionStatus.COMPLETE,
            progress: 100,
            completedOn: new Date().getTime(),
            error: undefined,
            translated: task === 'translate' // TODO: Detect if the transcription is translated or not, doesn't work for auto detect
          };

          // Add the transcription to the database

          // invoke the main process to add the transcription to the database
          console.log('RunWhisper: Adding transcription to database...');
          console;
          const newTranscription = (
            (await db('transcriptions').insert(transcription).returning('*')) as Transcription[]
          )[0];

          if (newTranscription.error) {
            console.log('RunWhisper: Error adding transcription to database!', newTranscription.error);
            throw new Error('Error adding transcription to database!');
          }

          // Convert cues to Lines objects
          console.log('RunWhisper: Converting cues to lines...');
          const formattedLines: Line[] = cues.map((cue, index) => {
            const line: Line = {
              uuid: uuidv4(),
              entry: entry.uuid,
              transcription: newTranscription.uuid,
              start: cue.data.start,
              end: cue.data.end,
              text: cue.data.text || '',
              index, // Note! This assumes that the cues are in order from whisper
              deleted: false,
              version: 0
            };
            return line;
          });

          // Add the lines to the database
          console.log('RunWhisper: Adding lines to database...');
          const newLines = (await db('lines').insert(formattedLines).returning('*')) as Line[];

          if (newLines.length !== formattedLines.length) {
            console.warn(
              'RunWhisper: Mismatch between number of lines added to database and number of lines generated!'
            );
            console.log('RunWhisper: Error adding lines to database!', newLines);
            throw new Error('Error adding lines to database!');
          } else {
            console.log('RunWhisper: Lines added to database successfully!');
          }

          // ------------------  Delete the VTT file ------------------ //
          // Not deleting the VTT file for now, as it's useful for debugging

          // ------------------  Resolve the promise ------------------ //
          resolve(transcription);
        } else {
          // ------------------  Handle errors ------------------ //
          console.log('RunWhisper: Error running whisper script!');
          const error = new Error('Error running whisper script!');
          reject(error);
        }
      });
    });

    console.log('RunWhisper: Transcription', transcription);

    return {
      transcription,
      entry
    };
  }
);
