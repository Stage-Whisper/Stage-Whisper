import { app, ipcMain, IpcMainInvokeEvent } from 'electron';
import { Entry, Line, Transcription } from 'knex/types/tables';
import { Channels } from '../../types/channels';

import db from '../../database/database';
import { NodeList, stringifySync } from 'subtitle';
import { existsSync, mkdirSync, writeFileSync } from 'fs';

export type ExportTranscriptionResponse = {
  outputDir: string;
};

// Take a transcription, get its lines, format them and write them to a file
export default ipcMain.handle(
  Channels.EXPORT_TRANSCRIPTION,
  async (
    _event: IpcMainInvokeEvent,
    transcriptionUUID: string,
    entry: Entry,
    outputPath?: string
  ): Promise<ExportTranscriptionResponse> => {
    try {
      if (!transcriptionUUID) throw new Error('No transcription UUID provided');
      if (!entry) throw new Error('No entry provided');

      // Get the user desktop directory
      const outputDir = outputPath || app.getPath('desktop');

      console.log('Exporting transcription', transcriptionUUID, entry.name);

      // Get the transcription from the database
      console.log('Getting transcription from database...');
      const transcription = (await db('transcriptions').where({ uuid: transcriptionUUID }).first()) as Transcription;

      // Check if the transcription exists
      if (!transcription) throw new Error(`Transcription with UUID ${transcriptionUUID} does not exist`);

      // Get the lines from the database
      console.log('Getting lines from database...');
      const lines = (await db('lines').where({ transcription: transcriptionUUID })) as Line[];

      // Check if the lines exist
      if (!lines || lines.length === 0) {
        throw new Error(`Lines for transcription with UUID ${transcriptionUUID} do not exist`);
      }

      console.log('Filtering and sorting lines...');
      console.log('Lines before filtering and sorting: ', lines.length);

      // Filter out the lines that are deleted
      const filteredLines = lines.filter((line) => !line.deleted);
      console.log('Non-Deleted lines: ', filteredLines.length);

      // Sort the lines by index
      const sortedLines = filteredLines.sort((a, b) => a.index - b.index);

      const latestLines = sortedLines.map((line) => {
        // Get max version number of each line
        const maxVersion = Math.max(...filteredLines.filter((l) => l.index === line.index).map((l) => l.version));

        // Check if the line is the latest version
        if (line.version === maxVersion) {
          return line;
        } else {
          return null;
        }
      }) as Array<Line | null>;

      // Filter out the null lines
      const latestLinesFiltered = latestLines.filter((line) => line !== null) as Line[];

      if (!latestLinesFiltered || latestLinesFiltered.length === 0) {
        throw new Error(`Latest lines for transcription with UUID ${transcriptionUUID} do not exist`);
      }

      console.log('Latest lines:', latestLinesFiltered.length);

      // Sort the lines again by index
      const latestLinesSorted = latestLinesFiltered.sort((a, b) => a.index - b.index);

      const nodes = [
        {
          type: 'header',
          data: 'WEBVTT'
        }
      ] as NodeList;

      // Convert the lines to a nodeList
      latestLinesSorted.forEach((line) => {
        nodes.push({
          type: 'cue',
          data: {
            start: line.start,
            end: line.end,
            text: line.text
          }
        });
      });

      console.log('Converting lines to nodeList...');
      const vtt = stringifySync(nodes, { format: 'WebVTT' });

      // Check if the output directory exists
      if (!outputDir) throw new Error('No output directory provided');

      // Check if a file with the same name already exists
      const folderName = `${entry.name}`;
      const fileName = `${entry.name}.vtt`;

      try {
        if (existsSync(`${outputDir}/${folderName}`)) {
          console.log('File name clash detected!, renaming folder...');
          // File already exists, add a number to the end of the file name and try again
          let i = 1;
          while (existsSync(`${outputDir}/${folderName} (${i})`)) {
            console.log(`File name clash detected again!, renaming folder with suffix (${i})!...`);
            i++;
            if (i > 100) throw new Error('Too many folder name clashes, aborting!');
          }
          const newFolderName = `${folderName} (${i})`;
          console.log('Writing file to disk...');
          mkdirSync(`${outputDir}/${newFolderName}`);
          writeFileSync(`${outputDir}/${newFolderName}/${fileName}`, vtt);
        } else {
          // Write the file to the output directory
          console.log('Writing file to disk...');
          mkdirSync(`${outputDir}/${folderName}`);
          writeFileSync(`${outputDir}/${folderName}/${fileName}`, vtt);
        }
      } catch (error) {
        console.log('Error writing file!', error);
        throw new Error('Error writing file');
      }

      console.log('File written to disk!');
      return { outputDir };
    } catch (error) {
      console.error('Error exporting transcription: ', error);
      throw error;
    }
  }
);
