import * as React from 'react';
import {useEffect, useState} from 'react';

function AudioPlayer({filePath}: {filePath: string}) {
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  // Calls main process to get audio file, returned in format Uint8Array that can be recomposed into an audio file
  const handleAudioUint8Array = async (filePath: string) => {
    console.time('AudioPlayer: Fetch Audio');
    window.Main.fetchAudioFile(filePath).then(audio => {
      const audioBlob = new Blob([audio], {type: 'audio/mp3'});
      setAudioBlob(audioBlob);
      console.timeEnd('AudioPlayer: Fetch Audio');
    });
  };

  useEffect(() => {
    if (filePath) {
      handleAudioUint8Array(filePath);
    }
  }, [filePath]);

  return audioBlob ? (
    <>
      <audio controls>
        <source
          src={URL.createObjectURL(audioBlob)}
          type="audio/mp3"
        />
      </audio>
    </>
  ) : null;
}

export default AudioPlayer;
