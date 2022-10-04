// Electron
import { ipcMain, IpcMainInvokeEvent } from 'electron';
import { join } from 'path';

// Packages
import { v4 as uuidv4 } from 'uuid';

// Types
import { Channels, RunWhisperResponse } from '../../types/channels';
import { entry, entryTranscription, transcriptionStatus } from '../../types/types';
import { WhisperArgs } from '../../types/whisperTypes';

// Node
import { spawn } from 'child_process';

export default ipcMain.handle(
  Channels.runWhisper,
  async (_event: IpcMainInvokeEvent, args: WhisperArgs, entry: entry): Promise<RunWhisperResponse> => {
    const { inputPath } = args;
    let { model, language, device, task } = args;

    // Set Defaults
    // Default to Base multilingual model
    if (!model) model = 'base';

    // If no language is specified, use the language of the audio file, if it is not specified, use English
    if (!language) {
      if (entry.audio.language) language = entry.audio.language;
      else language = 'English';
    }

    // If no device is specified, use the cpu
    if (!device) device = 'cpu';

    // If no task is specified, check if the audio file's language is English, if it is, use transcribe, if not, use translate
    if (!task) {
      if (language === 'English') task = 'transcribe';
      else task = 'translate';
    }

    // If no input path is specified, throw
    if (!inputPath) {
      throw new Error('No input path provided');
    }

    // Generate UUID for the entry
    const uuid = uuidv4();

    const transcribedOn = new Date().toISOString();

    // Generate output path
    const outputDir = join(entry.path, 'transcriptions', uuid);
    console.log('RunWhisper: outputDir', outputDir);

    // Run Whisper
    console.log('Running whisper script');

    const inputs = [
      '--output_dir',
      `${outputDir}`,
      '--model',
      `${model}`,
      `--task`,
      `${task}`,
      '--device',
      `${device}`,
      '--language',
      `${language}`,
      `${inputPath}`
    ];

    console.log('RunWhisper: Running model with args', inputs);

    // Synchronously run the script
    // TODO: #48 Make this async
    const childProcess = spawn('whisper', inputs, { stdio: 'inherit' });

    const transcription = await new Promise((resolve, reject): void => {
      childProcess.on('data', (data: string) => {
        console.log(`stdout: ${data}`);
      });
      childProcess.on('error', (error: Error) => {
        console.log(`stderr: ${error.message}`);
      });

      childProcess.on('close', (code: number) => {
        console.log(`RunWhisper: Child process closed with code ${code}`);
        if (code === 0) {
          const parameters: entryTranscription = {
            uuid,
            transcribedOn,
            completedOn: new Date().toISOString(),
            model, // Model used to transcribe
            language, // Language of the audio file
            status: transcriptionStatus.COMPLETE, // Status of the transcription
            progress: 100, // Progress of the transcription
            translated: task === 'translate', // If the transcription was translated
            error: undefined, // Error message
            path: outputDir // Path to the transcription folder
          };
          resolve(parameters);
        } else {
          reject(new Error(`Child process exited with code ${code}`));
        }
      });
    });

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
