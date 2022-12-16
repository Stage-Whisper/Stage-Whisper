import type {fetchAudioFileParams, fetchAudioFileReturn} from './../../../preload/src/index';
// Packages
import {ipcMain} from 'electron';
import {readFileSync} from 'fs';

// Types
import type {IpcMainInvokeEvent} from 'electron';
import {Channels} from '../../../../types/channels';

// Take a given audio file path, and return a Uint8Array of the audio file

export default ipcMain.handle(
  Channels.FETCH_AUDIO_FILE,
  async (_event: IpcMainInvokeEvent, args: fetchAudioFileParams): Promise<fetchAudioFileReturn> => {
    // As we are using a Parameter Type Guard, we need to extract the value from the array
    const audioPath = args[0];

    try {
      // Get the audio file and convert it to a buffer
      const audioBuffer = readFileSync(audioPath);

      // Convert it to a Uint8Array
      const audioUint8Array = new Uint8Array(audioBuffer);

      // Convert send it back to the renderer
      return {audioFile: audioUint8Array};
    } catch (error) {
      throw new Error(`Error reading audio file: ${error}`);
    }
  },
);
