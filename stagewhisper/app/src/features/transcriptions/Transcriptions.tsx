import { SimpleGrid, Center, Button, Card, Divider, Table, Stack } from '@mantine/core';
import React from 'react';

// Redux
import { useAppDispatch, useAppSelector } from '../../redux/hooks';

// Components
import { selectTranscriptions } from './transcriptionsSlice';
import TranscriptionCard from './components/TranscriptionCard';

// Localization
import strings from '../../localization';

// Component for displaying transcription progress / results
function Transcriptions() {
  // Redux
  const dispatch = useAppDispatch();
  const transcriptions = useAppSelector(selectTranscriptions);

  const transcriptionCards = transcriptions.map((transcription) => {
    return <TranscriptionCard key={transcription.id} transcription={transcription} />;
  });

  return (
    <Stack>
      <Stack spacing="md">{transcriptionCards}</Stack>
    </Stack>

    // const tableElements = transcriptions.map((transcription) => {
    //   return (
    //     <tr key={transcription.id}>
    //       <td>{transcription.id}</td>
    //       <td>{transcription.title}</td>
    //       <td>{transcription.description}</td>
    //       <td>{transcription.date}</td>
    //       <td>{transcription.tags}</td>
    //       <td>{transcription.status}</td>
    //       <td>{transcription.audio}</td>
    //       <td>{transcription.language}</td>
    //       <td>{transcription.model}</td>
    //       <td>{transcription.progress}</td>
    //       <td>{transcription.status}</td>
    //       <td>{transcription.directory}</td>
    //       <td>{transcription.transcript}</td>
    //     </tr>
    //   );
    // });

    // return (
    //   <Center my="lg">
    //     <Stack>
    //       {/* <Card withBorder>Top explainer and column heads</Card>
    //     <Divider /> */}
    //       Not sure if this is working
    //       <Table>
    //         <thead>
    //           <tr>
    //             <th>ID</th>
    //             <th>Title</th>
    //             <th>Description</th>
    //             <th>Date</th>
    //             <th>Tags</th>
    //             <th>Status</th>
    //             <th>Audio</th>
    //             <th>Language</th>
    //             <th>Model</th>
    //             <th>Progress</th>
    //             <th>Status</th>
    //             <th>Directory</th>
    //             <th>Transcript</th>
    //           </tr>
    //         </thead>
    //         <tbody>{tableElements}</tbody>
    //       </Table>
    //     </Stack>
    //   </Center>
  );
}

export default Transcriptions;
