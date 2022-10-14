// Components

import {
  ActionIcon,
  Affix,
  Box,
  Button,
  Card,
  Group,
  Loader,
  NumberInput,
  Stack,
  Text,
  Textarea,
  Title
} from '@mantine/core';

// import { RichTextEditor } from '@mantine/rte';
import { DataTable } from 'mantine-datatable';
// Types

// Packages
import {
  IconArrowBack,
  IconCheck,
  IconEdit,
  IconPlayerPause,
  IconPlayerPlay,
  IconPlayerStop,
  IconTrash,
  IconX
} from '@tabler/icons';

import { Howl } from 'howler';
import { Entry, Line, Transcription } from 'knex/types/tables';
import { useParams } from 'react-router-dom';
import strings from '../../localization';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { selectAudioPadding } from '../settings/settingsSlice';
import { passToWhisper, selectTranscribingStatus } from '../whisper/whisperSlice';
import { getLocalFiles, ReduxEntry, selectEntries } from './entrySlice';
import React, { useEffect, useState } from 'react';
import EntryTable from './components/EntryTable';
// import {  Transcription, Line }  from

// Convert an internal audio path to a url that can be used by howler
const filePathToURL = async (filePath: string): Promise<string> => {
  console.time('AudioPlayer: Fetch Audio');
  const result = await window.Main.fetchAudioFile(filePath);
  console.timeEnd('AudioPlayer: Fetch Audio');

  // Check if the fetch was successful
  if (!result) {
    console.log('No Audio File Found');
    throw new Error('No Audio File Found');
  } else {
    // Convert the Uint8Array to a Blob
    const blob = new Blob([result], { type: 'audio/mp3' });
    // Return the blob
    return URL.createObjectURL(blob);
  }
};

// Fetch Transcription Lines from the database
async function GetLines({ transcriptionUUID }: { transcriptionUUID: string }): Promise<Line[]> {
  const result = (await window.Main.GET_LATEST_LINES({ transcriptionUUID })) as Line[];
  if (!result) {
    console.log('No Lines Found');
    throw new Error('No Lines Found');
  } else {
    return result;
  }
}

// Fetch Transcription from the database
async function GetTranscription({
  transcriptionUUID,
  entryUUID
}: {
  transcriptionUUID?: string;
  entryUUID?: string;
}): Promise<Transcription> {
  if (transcriptionUUID) {
    const result = (await window.Main.GET_TRANSCRIPTION({ transcriptionUUID })) as Transcription;
    if (!result) {
      console.log('No Transcription Found');
      throw new Error('No Transcription Found');
    } else {
      return result;
    }
  } else if (entryUUID) {
    const result = (await window.Main.GET_ALL_TRANSCRIPTIONS_FOR_ENTRY({ entryUUID })) as Transcription[];
    if (!result) {
      console.log('No Transcription Found');
      throw new Error('No Transcription Found');
    } else {
      return result[result.length - 1];
    }
  } else {
    throw new Error('No parameters given for GetTranscription');
  }
}

// Get Entry from the database
async function GetEntry({ entryUUID }: { entryUUID: string }): Promise<Entry> {
  const result = (await window.Main.GET_ENTRY({ entryUUID })) as Entry;
  if (!result) {
    console.log('No Entry Found');
    throw new Error('No Entry Found');
  }
  return result;
}

function EntryEditor() {
  // Params
  const { entryUUID } = useParams<{ entryUUID: string }>();

  const [entry, setEntry] = useState<Entry | null>(null);
  const [transcription, setTranscription] = useState<Transcription | null>(null);
  const [lines, setLines] = useState<Line[] | null>(null);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [audioPlayer, setAudioPlayer] = useState<Howl | null>(null);
  const [audioPlaying, setAudioPlaying] = useState<boolean>(false);
  const [audioSeek, setAudioSeek] = useState<number>(0);

  useEffect(() => {
    if (entryUUID) {
      GetEntry({ entryUUID }).then((entry) => {
        setEntry(entry);
        console.log('1: Entry Set');
        console.log(entry);
        GetTranscription({ entryUUID: entry.uuid }).then((transcription) => {
          setTranscription(transcription);
          console.log('2: Transcription Set');
          console.log(transcription);
          GetLines({ transcriptionUUID: transcription.uuid })
            .then((lines) => {
              setLines(lines);
              console.log('3: Lines Set');
              console.log(lines);
            })
            .then(() => {
              if (entry.audio_path) {
                filePathToURL(entry.audio_path).then((url) => {
                  setAudioURL(url);
                  console.log('4: Audio URL Set');

                  const newAudioPlayer = new Howl({
                    src: [url],
                    html5: true,
                    format: ['mp3'],
                    preload: true
                  });
                  console.log('5: Audio Player Set');
                  newAudioPlayer.on('load', () => {
                    console.log('6: Audio Player Loaded');
                    setAudioPlayer(newAudioPlayer);
                  });
                  newAudioPlayer.once('loaderror', (_id, error) => {
                    console.log('Audio Player Load Error ', error);
                  });
                });
              } else {
                console.log('No Audio Path Found');
                throw new Error('No Audio Path Found');
              }
            });
        });
      });
    }
  }, [entryUUID]);

  useEffect(() => {
    // If the audio player is not null
    if (audioPlayer) {
      console.debug('AudioControls: Audio Player Changed');
      // Construct the audio controls
      // setAudioControls(AudioControls(audioPlayer));
    }
  }, [audioPlayer]);

  if (!entry) {
    return <Text>No entry found...</Text>;
  }

  if (entry && transcription && lines && audioURL && audioPlayer) {
    return <EntryTable audioPlayer={audioPlayer} lines={lines} />;
  } else {
    return <Text>Loading...</Text>;
  }
}

export default EntryEditor;
