export enum Channels {
  // Utility channels
  DELETE_STORE = 'delete-store',
  OPEN_DIR_DIALOG = 'open-directory-dialog', // Trigger a directory picker
  FETCH_AUDIO_FILE = 'fetch-audio-file', // Convert an audio file to a Uint8Array and send it back to the renderer

  // Database channels
  QUERY_DATABASE = 'query-database', // Loads all entries from the database and returns them
  NEW_ENTRY = 'new-entry', // Creates a new entry in the database and returns it
  EXPORT_TRANSCRIPTION = 'export-transcription', // Exports a transcription to a file
  DELETE_ENTRY = 'delete-entry', // Deletes an entry, its transcriptions and lines from the database

  // Whisper channels
  runWhisper = 'run-whisper', // Runs the whisper model with given arguments and returns the entry
  whisperComplete = 'whisper-complete', // Returns the entry and path to the transcription
  transcriptionComplete = 'transcription-complete', // Transcription complete event - Triggers WebContents.send
  whisperError = 'whisper-error', // Returns the error message
}
