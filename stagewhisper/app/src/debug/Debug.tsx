import { Button, Card, Stack, Title } from '@mantine/core';
import React from 'react';

function Debug() {
  //#region Testing area

  //#endregion

  return (
    <Stack>
      <Card withBorder>
        <Title order={5} mb={'sm'}>
          Debug Menu
        </Title>

        <Button
          onClick={() => {
            if (window.Main) {
              window.Main.loadVttFromFile('dev', true).then((vtt) => {
                console.log(vtt);
              });
            }
          }}
          variant="outline"
        >
          Load Dev Transcription VTT
        </Button>
      </Card>
    </Stack>
  );
}

export default Debug;
