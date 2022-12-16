/**
 * @module preload
 */

export {versions} from './versions';

export {
  addEntry,
  addLine,
  addLines,
  addTranscription,
  deleteEntry,
  exportTranscription,
  fetchAudioFile,
  getAllEntries,
  getAllEntriesWithLinesAndTranscriptions,
  getAllEntriesWithTranscriptions,
  getAllLines,
  getAllLinesForTranscription,
  getAllTranscriptions,
  getAllTranscriptionsForEntry,
  getEntry,
  getEntryCount,
  getLatestLines,
  getLine,
  getLineByIndex,
  getLineCount,
  getTranscription,
  getTranscriptionCount,
  getTranscriptionCountForEntry,
  newEntry,
  openDirectoryDialog,
  removeEntry,
  removeLine,
  removeTranscription,
  restoreLine,
  runWhisper,
  updateEntry,
  updateLine,
  updateTranscription,
} from './api';

/**
 * Types for the api functions
 *
 * @example
 * import type {function} from './api';
 * Parameter type: Parameters<typeof function>
 * Return type: ReturnType<typeof function>
 */

// RunWhisper
import type {runWhisper} from './api';
export type runWhisperParams = Parameters<typeof runWhisper>;
export type runWhisperReturn = ReturnType<typeof runWhisper>;

// AddEntry
import type {addEntry} from './api';
export type addEntryParams = Parameters<typeof addEntry>;
export type addEntryReturn = ReturnType<typeof addEntry>;

// AddLine
import type {addLine} from './api';
export type addLineParams = Parameters<typeof addLine>;
export type addLineReturn = ReturnType<typeof addLine>;

// AddLines
import type {addLines} from './api';
export type addLinesParams = Parameters<typeof addLines>;
export type addLinesReturn = ReturnType<typeof addLines>;

// AddTranscription
import type {addTranscription} from './api';
export type addTranscriptionParams = Parameters<typeof addTranscription>;
export type addTranscriptionReturn = ReturnType<typeof addTranscription>;

// DeleteEntry
import type {deleteEntry} from './api';
export type deleteEntryParams = Parameters<typeof deleteEntry>;
export type deleteEntryReturn = ReturnType<typeof deleteEntry>;

// ExportTranscription
import type {exportTranscription} from './api';
export type exportTranscriptionParams = Parameters<typeof exportTranscription>;
export type exportTranscriptionReturn = ReturnType<typeof exportTranscription>;

// FetchAudioFile
import type {fetchAudioFile} from './api';
export type fetchAudioFileParams = Parameters<typeof fetchAudioFile>;
export type fetchAudioFileReturn = ReturnType<typeof fetchAudioFile>;

// GetAllEntries
import type {getAllEntries} from './api';
export type getAllEntriesParams = Parameters<typeof getAllEntries>;
export type getAllEntriesReturn = ReturnType<typeof getAllEntries>;

// GetAllEntriesWithLinesAndTranscriptions
import type {getAllEntriesWithLinesAndTranscriptions} from './api';
export type getAllEntriesWithLinesAndTranscriptionsParams = Parameters<
  typeof getAllEntriesWithLinesAndTranscriptions
>;
export type getAllEntriesWithLinesAndTranscriptionsReturn = ReturnType<
  typeof getAllEntriesWithLinesAndTranscriptions
>;

// GetAllEntriesWithTranscriptions
import type {getAllEntriesWithTranscriptions} from './api';
export type getAllEntriesWithTranscriptionsParams = Parameters<
  typeof getAllEntriesWithTranscriptions
>;
export type getAllEntriesWithTranscriptionsReturn = ReturnType<
  typeof getAllEntriesWithTranscriptions
>;

// GetAllLines
import type {getAllLines} from './api';
export type getAllLinesParams = Parameters<typeof getAllLines>;
export type getAllLinesReturn = ReturnType<typeof getAllLines>;

// GetAllLinesForTranscription
import type {getAllLinesForTranscription} from './api';
export type getAllLinesForTranscriptionParams = Parameters<typeof getAllLinesForTranscription>;
export type getAllLinesForTranscriptionReturn = ReturnType<typeof getAllLinesForTranscription>;

// GetAllTranscriptions
import type {getAllTranscriptions} from './api';
export type getAllTranscriptionsParams = Parameters<typeof getAllTranscriptions>;
export type getAllTranscriptionsReturn = ReturnType<typeof getAllTranscriptions>;

// GetAllTranscriptionsForEntry
import type {getAllTranscriptionsForEntry} from './api';
export type getAllTranscriptionsForEntryParams = Parameters<typeof getAllTranscriptionsForEntry>;
export type getAllTranscriptionsForEntryReturn = ReturnType<typeof getAllTranscriptionsForEntry>;

// GetEntry
import type {getEntry} from './api';
export type getEntryParams = Parameters<typeof getEntry>;
export type getEntryReturn = ReturnType<typeof getEntry>;

// GetEntryCount
import type {getEntryCount} from './api';
export type getEntryCountParams = Parameters<typeof getEntryCount>;
export type getEntryCountReturn = ReturnType<typeof getEntryCount>;

// GetLatestLines
import type {getLatestLines} from './api';
export type getLatestLinesParams = Parameters<typeof getLatestLines>;
export type getLatestLinesReturn = ReturnType<typeof getLatestLines>;

// GetLine
import type {getLine} from './api';
export type getLineParams = Parameters<typeof getLine>;
export type getLineReturn = ReturnType<typeof getLine>;

// GetLineByIndex
import type {getLineByIndex} from './api';
export type getLineByIndexParams = Parameters<typeof getLineByIndex>;
export type getLineByIndexReturn = ReturnType<typeof getLineByIndex>;

// GetLineCount
import type {getLineCount} from './api';
export type getLineCountParams = Parameters<typeof getLineCount>;
export type getLineCountReturn = ReturnType<typeof getLineCount>;

// GetTranscription
import type {getTranscription} from './api';
export type getTranscriptionParams = Parameters<typeof getTranscription>;
export type getTranscriptionReturn = ReturnType<typeof getTranscription>;

// GetTranscriptionCount
import type {getTranscriptionCount} from './api';
export type getTranscriptionCountParams = Parameters<typeof getTranscriptionCount>;
export type getTranscriptionCountReturn = ReturnType<typeof getTranscriptionCount>;

// GetTranscriptionCountForEntry
import type {getTranscriptionCountForEntry} from './api';
export type getTranscriptionCountForEntryParams = Parameters<typeof getTranscriptionCountForEntry>;
export type getTranscriptionCountForEntryReturn = ReturnType<typeof getTranscriptionCountForEntry>;

// NewEntry
import type {newEntry} from './api';
export type newEntryParams = Parameters<typeof newEntry>;
export type newEntryReturn = ReturnType<typeof newEntry>;

// OpenDirectoryDialog
import type {openDirectoryDialog} from './api';
export type openDirectoryDialogParams = Parameters<typeof openDirectoryDialog>;
export type openDirectoryDialogReturn = ReturnType<typeof openDirectoryDialog>;

// RemoveEntry
import type {removeEntry} from './api';
export type removeEntryParams = Parameters<typeof removeEntry>;
export type removeEntryReturn = ReturnType<typeof removeEntry>;

// RemoveLine
import type {removeLine} from './api';
export type removeLineParams = Parameters<typeof removeLine>;
export type removeLineReturn = ReturnType<typeof removeLine>;

// RemoveTranscription
import type {removeTranscription} from './api';
export type removeTranscriptionParams = Parameters<typeof removeTranscription>;
export type removeTranscriptionReturn = ReturnType<typeof removeTranscription>;

// UpdateEntry
import type {updateEntry} from './api';
export type updateEntryParams = Parameters<typeof updateEntry>;
export type updateEntryReturn = ReturnType<typeof updateEntry>;

// UpdateLine
import type {updateLine} from './api';
export type updateLineParams = Parameters<typeof updateLine>;
export type updateLineReturn = ReturnType<typeof updateLine>;

// UpdateTranscription
import type {updateTranscription} from './api';
export type updateTranscriptionParams = Parameters<typeof updateTranscription>;
export type updateTranscriptionReturn = ReturnType<typeof updateTranscription>;

// RestoreLine
import type {restoreLine} from './api';
export type restoreLineParams = Parameters<typeof restoreLine>;
export type restoreLineReturn = ReturnType<typeof restoreLine>;
