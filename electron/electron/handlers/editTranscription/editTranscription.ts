import { entry, entryTranscription, transcriptionLine } from './../../types/types';
import { ipcMain, IpcMainInvokeEvent } from 'electron';
// import { readFileSync } from 'fs';
import { Channels } from '../../types/channels';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

export type EditTranscriptionArgs = {
  entry: entry; // Entry associated with the transcription
  transcription: entryTranscription; // Transcription to edit
  line: transcriptionLine; // New line data to be added to the transcription, must also include the original line data
};

export default ipcMain.handle(
  Channels.editTranscription,
  async (_event: IpcMainInvokeEvent, args: EditTranscriptionArgs): Promise<void> => {
    // -------------- Entry -------------- //
    // Check if the entry was passed in
    if (!args.entry) throw new Error('editTranscription: No entry provided');

    // Check if entry exists in the filesystem
    try {
      existsSync(args.entry.path);
    } catch (error) {
      throw new Error('editTranscription: Entry does not exist in the filesystem');
    }

    // Check if the entry has a config file
    try {
      readFileSync(join(args.entry.path, 'entry.json'));
    } catch (error) {
      throw new Error('editTranscription: Entry does not have a config file');
    }

    // Get the entry from the filesystem (for establishing a source of truth)
    const entry: entry = JSON.parse(readFileSync(join(args.entry.path, 'entry.json'), 'utf8'));

    // At this point we have a valid entry object that exists in the filesystem and has a config file (entry.json) //
    // We can now use the entry object to verify the other arguments passed in //

    // -------------- Transcription -------------- //
    // Check that entry has a transcription
    if (!entry.transcriptions) throw new Error('editTranscription: Entry has no transcriptions');

    // Check that the entry has a transcription with the given uuid
    if (!entry.transcriptions.find((t) => t.uuid === args.transcription.uuid))
      throw new Error('editTranscription: Entry has no transcription with the given uuid');

    const transcriptionPath = join(args.entry.path, 'transcriptions', args.transcription.uuid);

    // Check if the transcription folder exists in the filesystem
    try {
      existsSync(transcriptionPath);
    } catch (error) {
      throw new Error('editTranscription: Transcription folder does not exist in the filesystem');
    }

    // Check if the transcription has a config file
    try {
      readFileSync(join(transcriptionPath, 'transcription.json'));
    } catch (error) {
      throw new Error('editTranscription: Transcription does not have a config file');
    }

    // Get the transcription from the filesystem
    const transcription: entryTranscription = JSON.parse(
      readFileSync(join(transcriptionPath, 'transcription.json'), 'utf8')
    );

    // Check if the transcription has data
    if (!transcription.data) throw new Error('editTranscription: Transcription has no data');

    // At this point we have a valid transcription object that exists in the filesystem and has a config file (transcription.json) //
    // We can now use the transcription stored in the filesystem as a reference for the edits we want to make to the lines //

    // -------------- Line -------------- //
    // Check if the line was passed in
    if (!args.line) throw new Error('editTranscription: No line provided');
    const newLine = args.line;
    // Check if the line exists in the known-good transcription
    if (!transcription.data.find((l) => l.id === args.line.id))
      throw new Error('editTranscription: Transcription does not have a line with the given uuid');

    // Check if the line has its original data - used to check if the new line data is different from the original
    if (!newLine.id) throw new Error('editTranscription: No original line id provided');
    if (!newLine.index) throw new Error('editTranscription: No original line index provided');
    if (!newLine.start) throw new Error('editTranscription: No original line start time provided');
    if (!newLine.end) throw new Error('editTranscription: No original line end time provided');
    if (!newLine.text) throw new Error('editTranscription: No original line text provided');

    // Get the original line from the known-good transcription
    const originalLine = transcription.data.find((l) => l.id === args.line.id);

    // Check if original line exists
    if (!originalLine) throw new Error('editTranscription: Original line does not exist');

    // Check if original line has its original data
    if (!originalLine.id) throw new Error('editTranscription: Original line has no id');
    if (!originalLine.index) throw new Error('editTranscription: Original line has no index');
    if (!originalLine.start) throw new Error('editTranscription: Original line has no start time');
    if (!originalLine.end) throw new Error('editTranscription: Original line has no end time');
    if (!originalLine.text) throw new Error('editTranscription: Original line has no text');

    // Sanity check to make sure the original line data matches the new line data not including the edit object
    // ie. the original line data is the same as the new line data except for the edit object which contains the changes we want to make
    // this is done to make sure the original line data is not tampered with
    if (
      newLine.index !== originalLine.index ||
      newLine.start !== originalLine.start ||
      newLine.end !== originalLine.end ||
      newLine.text !== originalLine.text
    ) {
      throw new Error('editTranscription: New line original data is the same as in filesystem, cannot edit, aborting');
    }

    // At this point we have a valid line object, and we know that the new line origin data matches the original line data //
    // We can now check to see what needs to be changed in the line //

    // -------------- Edit -------------- //
    // Check if the line has an edit object
    if (newLine.edit === undefined) throw new Error('editTranscription: No edit object provided');

    // Check if the original line has an edit object
    if (originalLine.edit === null)
      console.log('editTranscription: Original line has no edit object - it has not been edited before');

    // Check if the new edit object is null -- if it is, we know that the user wants to clear the edits made to the line
    switch (newLine.edit) {
      case null:
        // Clear the edits made to the line
        // Set the line's edit object to null
        originalLine.edit = null;
        break;
      case undefined:
        // No edits were made to the line
        // Do nothing
        console.warn('editTranscription: CATCH: No edits were made to the line, aborting...');
        break;
      default:
        // Edits were made to the line
        // Check which edits were made to the line
        originalLine.edit = {
          start: newLine.edit.start ? newLine.edit.start : originalLine.edit?.start,
          end: newLine.edit.end ? newLine.edit.end : originalLine.edit?.end,
          text: newLine.edit.text ? newLine.edit.text : originalLine.edit?.text,
          deleted: newLine.edit.deleted ? newLine.edit.deleted : originalLine.edit?.deleted
        };
        break;
    }

    // At this point we have a valid line object with an edit object that reflects the desired state from the user //

    // Apply the edits to the line
    const newTranscription = transcription.data.map((l) => {
      if (l.id === originalLine.id) {
        return originalLine;
      } else {
        return l;
      }
    });

    // -------------- Write to filesystem -------------- //
    // Write the new line data to the transcription file
    try {
      console.log('editTranscription: Writing new line data to transcription file...');
      writeFileSync(join(transcriptionPath, 'transcription.json'), JSON.stringify(newTranscription, null, 2), 'utf8');
      console.log('editTranscription: New line data written to transcription file');
    } catch (error) {
      throw new Error('editTranscription: Failed to write changes to transcription.json file');
    }
  }
);
