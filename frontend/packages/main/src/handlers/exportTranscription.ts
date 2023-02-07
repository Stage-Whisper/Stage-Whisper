import type {
  exportTranscriptionParams,
  exportTranscriptionReturn,
} from './../../../preload/src/index';
// Database
import type {Line} from '../database/generated';
import {prisma} from '../database/database';

// Packages
import {app, ipcMain} from 'electron';
import {existsSync, mkdirSync, writeFileSync} from 'fs';
import {stringifySync} from 'subtitle';

// Types
import type {IpcMainInvokeEvent} from 'electron';
import type {NodeList} from 'subtitle';
import {Channels} from '../../../../types/channels';

// Take a transcription, get its lines, format them and write them to a file
export default ipcMain.handle(
  Channels.EXPORT_TRANSCRIPTION,
  async (
    _event: IpcMainInvokeEvent,
    args: exportTranscriptionParams,
  ): Promise<exportTranscriptionReturn> => {
    // Extract the arguments
    const {transcriptionUUID} = args[0];

    let dir = args[0].outputDir;
    // Check if the output directory is provided
    if (!dir) {
      console.log('No output directory provided, using desktop directory');
      dir = app.getPath('desktop');
    }

    try {
      if (!transcriptionUUID) throw new Error('No transcription UUID provided');

      console.log('Exporting transcription', transcriptionUUID);

      // Get the transcription from the database
      console.log('Getting transcription from database...');
      const transcription = await prisma.transcription.findUnique({
        where: {uuid: transcriptionUUID},
      });

      // Check if the transcription exists
      if (!transcription)
        throw new Error(`Transcription with UUID ${transcriptionUUID} does not exist`);

      // Get the entry from the transcription
      console.log('Getting entry from database...');
      const entry = await prisma.entry.findUnique({
        where: {uuid: transcription.entryId},
      });

      // Check if the entry exists
      if (!entry)
        throw new Error(`
        Entry with UUID ${transcription.entryId} does not exist
      `);

      // Get the lines from the database
      console.log('Getting lines from database...');
      // const lines = (await db('lines').where({transcription: transcriptionUUID})) as Line[];
      const lines = await prisma.line.findMany({where: {transcription}});

      // Check if the lines exist
      if (!lines || lines.length === 0) {
        throw new Error(`Lines for transcription with UUID ${transcriptionUUID} do not exist`);
      }

      console.log('Filtering and sorting lines...');
      console.log('Lines before filtering and sorting: ', lines.length);

      // Filter out the lines that are deleted
      const filteredLines = lines.filter(line => !line.deleted);
      console.log('Non-Deleted lines: ', filteredLines.length);

      // Sort the lines by index
      const sortedLines = filteredLines.sort((a, b) => a.index - b.index);

      const latestLines = sortedLines.map(line => {
        // Get max version number of each line
        const maxVersion = Math.max(
          ...filteredLines.filter(l => l.index === line.index).map(l => l.version),
        );

        // Check if the line is the latest version
        if (line.version === maxVersion) {
          return line;
        } else {
          return null;
        }
      }) as Array<Line | null>;

      // Filter out the null lines
      const latestLinesFiltered = latestLines.filter(line => line !== null) as Line[];

      if (!latestLinesFiltered || latestLinesFiltered.length === 0) {
        throw new Error(
          `Latest lines for transcription with UUID ${transcriptionUUID} do not exist`,
        );
      }

      console.log('Latest lines:', latestLinesFiltered.length);

      // Sort the lines again by index
      const latestLinesSorted = latestLinesFiltered.sort((a, b) => a.index - b.index);

      const nodes = [
        {
          type: 'header',
          data: 'WEBVTT',
        },
      ] as NodeList;

      // Convert the lines to a nodeList
      latestLinesSorted.forEach(line => {
        nodes.push({
          type: 'cue',
          data: {
            start: line.start,
            end: line.end,
            text: line.text,
          },
        });
      });

      console.log('Converting lines to nodeList...');
      const vtt = stringifySync(nodes, {format: 'WebVTT'});

      // Check if the output directory exists
      if (!dir) throw new Error('No output directory provided');

      // Check if a file with the same name already exists
      const folderName = `${entry.name}`;
      const fileName = `${entry.name}.vtt`;

      let actualFileName = '';

      try {
        if (existsSync(`${dir}/${folderName}`)) {
          console.log('File name clash detected!, renaming folder...');
          // File already exists, add a number to the end of the file name and try again
          let i = 1;
          while (existsSync(`${dir}/${folderName} (${i})`)) {
            console.log(`File name clash detected again!, renaming folder with suffix (${i})!...`);
            i++;
            if (i > 100) throw new Error('Too many folder name clashes, aborting!');
          }
          const newFolderName = `${folderName} (${i})`;
          console.log('Writing file to disk...');
          mkdirSync(`${dir}/${newFolderName}`);
          writeFileSync(`${dir}/${newFolderName}/${fileName}`, vtt);
          actualFileName = `${newFolderName}/${fileName}`;
        } else {
          // Write the file to the output directory
          console.log('Writing file to disk...');
          mkdirSync(`${dir}/${folderName}`);
          writeFileSync(`${dir}/${folderName}/${fileName}`, vtt);
          actualFileName = `${folderName}/${fileName}`;
        }
      } catch (error) {
        console.log('Error writing file!', error);
        throw new Error('Error writing file');
      }

      console.log('File written to disk!');
      return {
        filePath: `${dir}/${actualFileName}`,
      };
    } catch (error) {
      console.error('Error exporting transcription: ', error);
      throw error;
    }
  },
);
