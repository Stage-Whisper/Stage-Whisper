import { RootState } from './../../redux/store';

// Transcription Slice
// This holds the state of the transcriptions and will be updated by electron/node processes

import { createSlice } from '@reduxjs/toolkit';
import { WhisperLanguages } from '../input/components/language/languages';

export interface transcriptionState {
  transcriptions: transcription[];
}

export enum transcriptionStatus {
  IDLE = 'idle', // User has added a file to be transcribed but it has not been added to the queue
  QUEUED = 'queued', // User has indicated they want to transcribe this file
  PENDING = 'pending', // Transcription has started but its progress is unknown
  PROCESSING = 'processing', // Transcription is in progress
  STALLED = 'stalled', // Transcription is taking too long (probably due to a large model)
  ERROR = 'error', // Transcription has failed
  PAUSED = 'paused', // Transcription has been paused by the user
  COMPLETE = 'complete', // Transcription has finished
  CANCELLED = 'cancelled', // Transcription has been cancelled by the user
  DELETED = 'deleted', // Transcription has been deleted by the user
  UNKNOWN = 'unknown' // Transcription status is unknown (probably due to an error talking to the transcriber)
}

export interface transcription {
  // File information
  audio: string; // Path to the audio file
  audioTitle: string; // Title of the audio file
  audioAdded: string; // Date of when the audio file was added to the system (YYYY-MM-DD)
  length: number; // Length of the audio file in seconds
  audioFormat: string; // Format of the audio file
  language: keyof typeof WhisperLanguages; // Language of the audio file
  date: string; // Date value for interview (YYYY-MM-DD)

  // Transcription information
  title: string; // Title of the transcription
  description: string; // Description of the transcription
  created: string; // Date of when the transcription was completed (YYYY-MM-DD)
  tags: string[]; // Tags for the transcription
  translated: boolean; // Whether the transcription has been translated
  model: 'tiny' | 'base' | 'small' | 'medium' | 'large'; // Model used for the transcription
  progress: number; // Progress of the transcription
  status: transcriptionStatus; // Status of the transcription
  directory: string; // Directory where the transcription is stored
  transcript: string; // Path to the transcript file
  transcriptLength: number; // Length of the transcript file in words

  // Transcription metadata
  opened: boolean; // Whether the transcription has been opened in the editor
  id: number; // Unique internal id
}

const initialState: transcriptionState = {
  transcriptions: [
    {
      id: 0,
      title: 'Test Title0',
      transcriptLength: 300,
      description: 'Test Description0',
      date: '2020-01-01',
      created: '2020-01-01',
      tags: ['test', 'tags'],
      audio: 'test audio 0',
      audioTitle: 'Fancy twice mp3',
      audioAdded: '2020-01-01',
      language: 'en',
      translated: false,
      model: 'base',
      progress: 0,
      status: transcriptionStatus.PENDING,
      directory: '/test/user/desktop/output.txt',
      transcript:
        'test transcript text that will be replaced with a complicated object with timings and other things, I am filling space so that we can see what it might look like hello there ',
      opened: false,
      length: 100,
      audioFormat: 'mp3'
    },
    {
      id: 1,
      title:
        'Adventures of Sherlock Holmes - Very long title that will be truncated or break something in one of the ui views',
      transcriptLength: 300,
      description: 'A collection of short stories by Sir Arthur Conan Doyle',
      date: '2020-01-01',
      created: '2020-01-01',
      audioTitle: 'SherlockHolmes.mp3',
      audioAdded: '2020-01-01',
      tags: [
        'sherlock',
        'holmes',
        'more tags',
        'even more tags',
        'many tags',
        'tags2',
        ' more more tags',
        'repeating tags',
        'very very very very very very long tags'
      ],
      audio: 'original sherlock holmes audio',
      language: 'en',
      translated: false,
      model: 'tiny',
      progress: 100,
      status: transcriptionStatus.COMPLETE,
      directory: '/test/user/desktop/output.txt',
      transcript: `I found Renfield sitting placidly in his room with his hands folded, smiling benignly. At the moment he seemed as sane as any one I ever saw. I sat down and talked with him on a lot of subjects, all of which he treated naturally. He then, of his own accord, spoke of going home, a subject he has never mentioned to my knowledge during his sojourn here. In fact, he spoke quite confidently of getting his discharge at once. I believe that, had I not had the chat with Harker and read the letters and the dates of his outbursts, I should have been prepared to sign for him after a brief time of observation. As it is, I am darkly suspicious. All those outbreaks were in some way linked with the proximity of the Count. What then does this absolute content mean? Can it be that his instinct is satisfied as to the vampire's ultimate triumph? Stay; he is himself zoöphagous, and in his wild ravings outside the chapel door of the deserted house he always spoke of "master." This all seems confirmation of our idea. However, after a while I came away; my friend is just a little too sane at present to make it safe to probe him too deep with questions. He might begin to think, and then--! So I came away. I mistrust these quiet moods of his; so I have given the attendant a hint to look closely after him, and to have a strait-waistcoat ready in case of need. 29 September, in train to London.--When I received Mr. Billington's courteous message that he would give me any information in his power I thought it best to go down to Whitby and make, on the spot, such inquiries as I wanted. It was now my object to trace that horrid cargo of the Count's to its place in London. Later, we may be able to deal with it. Billington junior, a nice lad, met me at the station, and brought me to his father's house, where they had decided that I must stay the night. They are hospitable, with true Yorkshire hospitality: give a guest everything, and leave him free to do as he likes. They all knew that I was busy, and that my stay was short, and Mr. Billington had ready in his office all the papers concerning the consignment of boxes. It gave me almost a turn to see again one of the letters which I had seen on the Count's table before I knew of his diabolical plans. Everything had been carefully thought out, and done systematically and with precision. He seemed to have been prepared for every obstacle which might be placed by accident in the way of his intentions being carried out. To use an Americanism, he had "taken no chances," and the absolute accuracy with which his instructions were fulfilled, was simply the logical result of his care. I saw the invoice, and took note of it: "Fifty cases of common earth, to be used for experimental purposes." Also the copy of letter to Carter Paterson, and their reply; of both of these I got copies. This was all the information Mr. Billington could give me, so I went down to the port and saw the coastguards, the Customs officers and the harbour-master. They had all something to say of the strange entry of the ship, which is already taking its place in local tradition; but no one could add to the simple description "Fifty cases of common earth." I then saw the station-master, who kindly put me in communication with the men who had actually received the boxes. Their tally was exact with the list, and they had nothing to add except that the boxes were "main and mortal heavy," and that shifting them was dry work. One of them added that it was hard lines that there wasn't any gentleman "such-like as yourself, squire," to show some sort of appreciation of their efforts in a liquid form; another put in a rider that the thirst then generated was such that even the time which had elapsed had not completely allayed it. Needless to add, I took care before leaving to lift, for ever and adequately, this source of reproach. 30 September.--The station-master was good enough to give me a line to his old companion the station-master at King's Cross, so that when I arrived there in the morning I was able to ask him about the arrival of the boxes. He, too, put me at once in communication with the proper officials, and I saw that their tally was correct with the original invoice. The opportunities of acquiring an abnormal thirst had been here limited; a noble use of them had, however, been made, and again I was compelled to deal with the result in an ex post facto manner.`,
      opened: false,
      length: 100,
      audioFormat: 'mp3'
    },
    {
      id: 2,
      title: 'Test Title2',
      transcriptLength: 300,
      description: 'Test Description',
      date: '2020-01-01',
      created: '2020-01-01',
      tags: ['test', 'tags'],
      audio: 'test audio',
      audioTitle: 'Batman.mp3',
      audioAdded: '2020-01-01',
      language: 'tr',
      translated: false,
      model: 'large',
      progress: 70,
      status: transcriptionStatus.ERROR,
      directory: '/test/user/desktop/output.txt',
      transcript:
        'test transcript text that will be replaced with a complicated object with timings and other things, I am filling space so that we can see what it might look like hello there ',
      opened: false,
      length: 100,
      audioFormat: 'mp3'
    },
    {
      id: 3,
      title: 'Test Title3',
      transcriptLength: 300,
      description: 'Test Description',
      date: '2020-01-01',
      created: '2020-01-01',
      tags: ['test', 'tags'],
      audio: 'test audio',
      audioTitle: 'Interview_with_John_Doe.mp3',
      audioAdded: '2020-01-01',
      language: 'en',
      translated: false,
      model: 'medium',
      progress: 40,
      status: transcriptionStatus.STALLED,
      directory: '/test/user/desktop/output.txt',
      transcript:
        'test transcript text that will be replaced with a complicated object with timings and other things, I am filling space so that we can see what it might look like hello there ',
      opened: false,
      length: 100,
      audioFormat: 'mp3'
    },
    {
      id: 4,
      title: 'Test Title4',
      transcriptLength: 300,
      description: 'Test Description',
      date: '2020-01-01',
      created: '2020-01-01',
      tags: ['test', 'tags'],
      audio: 'test audio',
      audioTitle: 'test audio title',
      audioAdded: '2020-01-01',
      language: 'en',
      translated: false,
      model: 'base',
      opened: false,
      length: 100,
      audioFormat: 'mp3',
      progress: 20,
      status: transcriptionStatus.PAUSED,
      directory: '/test/user/desktop/output.txt',
      transcript:
        'test transcript text that will be replaced with a complicated object with timings and other things, I am filling space so that we can see what it might look like hello there '
    },
    {
      id: 5,
      title: 'Test Title5',
      transcriptLength: 300,
      description: 'Test Description',
      date: '2020-01-01',
      created: '2020-01-01',
      tags: ['test', 'tags'],
      audio: 'test audio',
      audioTitle: 'test audio title',
      audioAdded: '2020-01-01',
      language: 'en',
      translated: false,
      model: 'base',
      opened: false,
      length: 100,
      audioFormat: 'mp3',
      progress: 20,
      status: transcriptionStatus.PROCESSING,
      directory: '/test/user/desktop/output.txt',
      transcript:
        'test transcript text that will be replaced with a complicated object with timings and other things, I am filling space so that we can see what it might look like hello there '
    },
    {
      id: 6,
      title: 'Test Title6',
      transcriptLength: 300,
      description: 'Test Description',
      date: '2020-01-01',
      created: '2020-01-01',
      tags: ['test', 'tags'],
      audio: 'test audio',
      audioTitle: 'test audio title',
      audioAdded: '2020-01-01',
      language: 'en',
      translated: false,
      model: 'base',
      opened: false,
      length: 100,
      audioFormat: 'mp3',
      progress: 20,
      status: transcriptionStatus.CANCELLED,
      directory: '/test/user/desktop/output.txt',
      transcript:
        'test transcript text that will be replaced with a complicated object with timings and other things, I am filling space so that we can see what it might look like hello there '
    },
    {
      id: 7,
      title: 'Test Title7',
      transcriptLength: 300,
      description: 'Test Description',
      date: '2020-01-01',
      created: '2020-01-01',
      tags: ['test', 'tags'],
      audio: 'test audio',
      audioTitle: 'test audio title',
      audioAdded: '2020-01-01',
      language: 'en',
      translated: false,
      model: 'base',
      opened: false,
      length: 10000,
      audioFormat: 'mp3',
      progress: 20,
      status: transcriptionStatus.DELETED,
      directory: '/test/user/desktop/output.txt',
      transcript:
        'test transcript text that will be replaced with a complicated object with timings and other things, I am filling space so that we can see what it might look like hello there '
    },
    {
      id: 8,
      title: 'Test Title8',
      transcriptLength: 300,
      description: 'Test Description',
      date: '2020-01-01',
      created: '2020-01-01',
      tags: ['test', 'tags'],
      audio: 'test audio',
      audioTitle: 'test audio title',
      audioAdded: '2020-01-01',
      language: 'en',
      translated: false,
      model: 'base',
      opened: false,
      length: 100,
      audioFormat: 'mp3',
      progress: 20,
      status: transcriptionStatus.QUEUED,
      directory: '/test/user/desktop/output.txt',
      transcript:
        'test transcript text that will be replaced with a complicated object with timings and other things, I am filling space so that we can see what it might look like hello there '
    },
    {
      id: 9,
      title: 'Test Title9',
      transcriptLength: 300,
      description: 'Test Description',
      date: '2020-01-01',
      created: '2020-01-01',
      tags: ['test', 'tags'],
      audio: 'test audio',
      audioTitle: 'test audio title',
      audioAdded: '2020-01-01',
      language: 'en',
      translated: false,
      model: 'base',
      opened: false,
      length: 100,
      audioFormat: 'mp3',
      progress: 20,
      status: transcriptionStatus.IDLE,
      directory: '/test/user/desktop/output.txt',
      transcript:
        'test transcript text that will be replaced with a complicated object with timings and other things, I am filling space so that we can see what it might look like hello there '
    }
  ]
};

export const transcriptionsSlice = createSlice({
  name: 'transcriptions',
  initialState,
  reducers: {
    addTranscription: (state, action) => {
      state.transcriptions.push(action.payload);
    },
    updateTranscription: (state, action) => {
      const index = state.transcriptions.findIndex((transcription) => transcription.id === action.payload.id);
      if (index !== -1) {
        state.transcriptions[index] = action.payload;
      }
    },
    removeTranscription: (state, action) => {
      const index = state.transcriptions.findIndex((transcription) => transcription.id === action.payload);
      if (index !== -1) {
        state.transcriptions.splice(index, 1);
      }
    },
    test: (state, action) => {
      console.log('test');
      console.log(action.payload);
    }
  }
});

export const { addTranscription, updateTranscription, removeTranscription, test } = transcriptionsSlice.actions;

// Export Transcription States
export const selectTranscriptions = (state: RootState) => state.transcriptions.transcriptions;

// Export the reducer
export default transcriptionsSlice.reducer;
