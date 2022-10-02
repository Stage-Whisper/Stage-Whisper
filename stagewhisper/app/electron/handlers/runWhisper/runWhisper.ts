import { spawn } from 'child_process';
import { ipcMain, IpcMainInvokeEvent } from 'electron';
import { WhisperArgs } from '../../whisperTypes';

export default ipcMain.handle('run-whisper', async (_event: IpcMainInvokeEvent, args: WhisperArgs) => {
  const { inputPath, output_dir } = args;
  console.log('Running whisper script');
  console.log('args: ', args);

  // const out = spawn('whisper', ['--model', 'base.en', '--output_dir', join(__dirname, '../src/debug/data')]);
  const out = spawn('whisper', [inputPath, '--model', 'base.en', '--output_dir', output_dir]);

  out.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });
  out.stderr.on('data', (err) => {
    console.log(`stderr: ${err}`);
  });
  out.on('message', (message) => {
    console.log(`message: ${message}`);
  });

  out.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
});
