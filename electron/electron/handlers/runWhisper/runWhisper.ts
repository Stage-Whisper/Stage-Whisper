// Electron
import { ipcMain, IpcMainInvokeEvent } from 'electron';
import { join } from 'path';

// Packages
import { v4 as uuidv4 } from 'uuid';

// Types
import { Channels, RunWhisperResponse } from '../../types/channels';
import { entry, entryTranscription, transcriptionLine, transcriptionStatus } from '../../types/types';
import { WhisperArgs } from '../../types/whisperTypes';

// Node
import { spawn } from 'child_process';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { NodeCue, parseSync } from 'subtitle';

export default ipcMain.handle(
  Channels.runWhisper,
  async (_event: IpcMainInvokeEvent, args: WhisperArgs, entry: entry): Promise<RunWhisperResponse> => {
    const { inputPath, language } = args;
    let { model, device, task } = args;

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
    const outputDir = join(entry.path, 'transcriptions', uuid);
    console.log('RunWhisper: outputDir', outputDir);

    // ------------------  Construct the input array for the whisper script ------------------ //
    const inputArray = []; // Array to hold the input arguments for the whisper script

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
    inputArray.push(inputPath);

    // ---------------------------------  Run the whisper script --------------------------------- //

    console.log('RunWhisper: Running model with args', inputArray);

    // Spawn the whisper script
    const childProcess = spawn('whisper', inputArray, { stdio: 'inherit' });

    const transcription = await new Promise((resolve, reject): void => {
      childProcess.on('data', (data: string) => {
        console.log(`stdout: ${data}`);
      });
      childProcess.on('error', (error: Error) => {
        console.log(`stderr: ${error.message}`);
      });

      // ------------------  Listen for the child process to exit and generate a transcription.json file ------------------ //
      childProcess.on('close', (code: number) => {
        console.log(`RunWhisper: Child process closed with code ${code}`);
        if (code === 0) {
          // ------------------  Convert the VTT file to Json ------------------ //
          const vttPath = join(outputDir, `${entry.audio.name}.vtt`);
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
            console.log('RunWhisper: VTT file read successfully');
          } catch (error) {
            console.log('RunWhisper: Error reading VTT file', error);
            throw new Error('Error reading VTT file');
          }

          // Split the VTT file into an array of lines
          console.log('RunWhisper: Parsing VTT file...');
          const lines = parseSync(vttFile);

          // Check if the VTT file is empty
          if (lines.length === 0) {
            console.log('RunWhisper: VTT file is empty');
            throw new Error('VTT file is empty');
          }

          // Remove header lines from the VTT file
          console.log('RunWhisper: Removing header lines from VTT file...');
          const cues = lines.filter((line) => line.type === 'cue') as NodeCue[];

          // Generate the formatted lines
          console.log('RunWhisper: Generating formatted lines...');
          const formattedLines = cues.map((line, index): transcriptionLine => {
            return {
              id: uuidv4(),
              index,
              start: line.data.start,
              end: line.data.end,
              text: line.data.text,
              edit: null
            };
          });

          console.log('RunWhisper: Generating formatted transcription...');
          // Generate the formatted transcription

          const parameters: entryTranscription = {
            uuid,
            transcribedOn,
            completedOn: new Date().getTime(),
            model, // Model used to transcribe
            language, // Language of the audio file
            status: transcriptionStatus.COMPLETE, // Status of the transcription
            progress: 100, // Progress of the transcription
            translated: task === 'translate', // If the transcription was translated
            error: undefined, // Error message
            path: outputDir, // Path to the transcription folder
            data: formattedLines
          };

          // Create the transcription.json file
          const transcriptionPath = join(outputDir, 'transcription.json');
          console.log('RunWhisper: Creating transcription.json file at', transcriptionPath);
          console.log('RunWhisper: parameters', parameters);
          try {
            writeFileSync(transcriptionPath, JSON.stringify(parameters));
          } catch (error) {
            console.log('RunWhisper: Error writing transcription.json file', error);
            reject(error);
          }

          resolve(parameters);
        } else {
          reject(new Error(`Child process exited with code ${code}`));
        }
      });
    });

    // ------------------  Return the transcription Information ------------------ //
    if (transcription) {
      const parameters: RunWhisperResponse = {
        transcription_uuid: uuid,
        outputDir,
        entry,
        transcribedOn
      };
      console.log('RunWhisper: Transcription complete, returning entry');
      return parameters;
    } else {
      throw new Error('Transcription failed');
    }
  }
);
