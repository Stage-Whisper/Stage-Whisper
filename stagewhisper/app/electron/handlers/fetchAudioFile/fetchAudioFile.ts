import { ipcMain, IpcMainInvokeEvent } from 'electron';
import { readFileSync } from 'fs';
import { Channels } from '../../types/channels';

// Take a given audio file path, and return a Uint8Array of the audio file

export default ipcMain.handle(
  Channels.fetchAudioFile,
  async (_event: IpcMainInvokeEvent, audioPath: string): Promise<Uint8Array> => {
    try {
      // var buffer = new ArrayBuffer(8);
      // ipcRenderer.send('sendData', {
      //   data: new Uint8Array(buffer)
      // });

      // Get the audio file and convert it to a buffer
      const audioBuffer = readFileSync(audioPath);

      // Convert it to a Uint8Array
      const audioUint8Array = new Uint8Array(audioBuffer);

      // Convert send it back to the renderer
      return audioUint8Array;
    } catch (error) {
      throw new Error(`Error reading audio file: ${error}`);
    }
  }
);
