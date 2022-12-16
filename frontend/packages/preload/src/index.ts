/**
 * @module preload
 */

export {sha256sum} from './nodeCrypto';
export {versions} from './versions';

// export const deleteStore () => ipcRenderer.invoke(Channels.DELETE_STORE)
export {
  deleteEntry,
  fetchAudioFile,
  exportTranscription,
  runWhisper,
  openDirectoryDialog,
  newEntry,
  addEntry,
  addLine,
  addLines,
  addTranscription,
  removeEntry,
  removeLine,
  removeTranscription,
  restoreLine,
  updateEntry,
  updateLine,
  updateTranscription,
  getEntry,
  getLine,
  getLineByIndex,
  getTranscription,
  getEntryCount,
  getLineCount,
  getTranscriptionCountForEntry,
  getTranscriptionCount,
  getAllEntries,
  getAllTranscriptionsForEntry,
  getAllLinesForTranscription,
  getAllLines,
  getLatestLines,
  getAllTranscriptions,
  getAllEntriesWithTranscriptions,
  getAllEntriesWithLinesAndTranscriptions,
} from './api';
