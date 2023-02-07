import {PrismaClient} from '@prisma/client';
const prisma = new PrismaClient();

import * as pc from 'picocolors';

async function main() {
  console.log(pc.green('Seeding database...'));

  // Entry
  const entry = await prisma.entry.create({
    data: {
      name: 'test entry',
      description: 'test description',
      created: new Date().getTime(),
      inQueue: false,
      queueWeight: 0,
      audio_path: 'audio_test_path',
      audio_name: 'audio_test_name',
      audio_fileLength: 0,
      audio_addedOn: new Date().getTime(),
      audio_type: 'audio_test_type.mp3',
    },
  });
  console.log(pc.green('Created entry with id: ') + entry.uuid);

  // Transcription
  const transcription = await prisma.transcription.create({
    data: {
      //   entry         String  @map(name: "entry_uuid")
      entryId: entry.uuid,
      // uuid          String  @id @default(cuid())
      // transcribedOn Int
      transcribedOn: new Date().getTime(),
      // path          String
      path: 'transcription_test_path',
      // model         String
      model: 'transcription_test_model',
      // language      String
      language: 'transcription_test_language',
      // status        String
      status: 'transcription_test_status',
      // progress      Int
      progress: 0,
      // translated    Boolean
      translated: false,
      // error         String?
      error: 'transcription_test_error',
      // completedOn   BigInt
      completedOn: new Date().getTime(),
    },
  });
  console.log(pc.green('Created transcription with id: ') + transcription.uuid);

  const line1 = await prisma.line.create({
    data: {
      transcriptionId: transcription.uuid,
      version: 0,
      index: 0,
      text: 'test line 0',
      start: 0,
      end: 1,
      deleted: false,
    },
  });
  console.log(pc.green('Created line with id: ') + line1.uuid);

  const line2 = await prisma.line.create({
    data: {
      transcriptionId: transcription.uuid,
      version: 0,
      index: 1,
      text: 'test line 1',
      start: 1,
      end: 2,
      deleted: false,
    },
  });
  console.log(pc.green('Created line with id: ') + line2.uuid);

  const line3 = await prisma.line.create({
    data: {
      transcriptionId: transcription.uuid,
      version: 0,
      index: 2,
      text: 'test line 2',
      start: 2,
      end: 3,
      deleted: false,
    },
  });
  console.log(pc.green('Created line with id: ') + line3.uuid);

  // Nested Create
  const entry2 = await prisma.entry.create({
    data: {
      name: 'test entry 2',
      description: 'test description 2',
      created: new Date().getTime(),
      inQueue: false,
      queueWeight: 0,
      audio_path: 'audio_test_path 2',
      audio_name: 'audio_test_name 2',
      audio_fileLength: 0,
      audio_addedOn: new Date().getTime(),
      audio_type: 'audio_test_type.mp3 2',
      transcriptions: {
        create: [
          {
            transcribedOn: new Date().getTime(),
            path: 'transcription_test_path 2',
            model: 'transcription_test_model 2',
            language: 'transcription_test_language 2',
            status: 'transcription_test_status 2',
            progress: 0,
            translated: false,
            error: 'transcription_test_error 2',
            completedOn: new Date().getTime(),
            lines: {
              create: [
                {
                  version: 0,
                  index: 0,
                  text: 'test line 0 2',
                  start: 0,
                  end: 1,
                  deleted: false,
                },
                {
                  version: 0,
                  index: 1,
                  text: 'test line 1 2',
                  start: 1,
                  end: 2,
                  deleted: false,
                },
                {
                  version: 0,
                  index: 2,
                  text: 'test line 2 2',
                  start: 2,
                  end: 3,
                  deleted: false,
                },
              ],
            },
          },
        ],
      },
    },
  });
  console.log(pc.green('Created nested entry with id: ') + entry2.uuid);

  // Test Query
  const allEntries = await prisma.entry.findMany();

  if (allEntries.length < 1) {
    console.log(pc.red('No entries found!'));
    throw new Error('No entries found!');
  } else {
    console.log(pc.green(`Found ${pc.bold(allEntries.length)} entries!`));
  }

  const allTranscriptions = await prisma.transcription.findMany();
  if (allTranscriptions.length < 1) {
    console.log(pc.red('No transcriptions found!'));
    throw new Error('No transcriptions found!');
  } else {
    console.log(pc.green(`Found ${pc.bold(allTranscriptions.length)} transcriptions!`));
  }

  const allLines = await prisma.line.findMany();
  if (allLines.length < 1) {
    console.log(pc.red('No lines found!'));
    throw new Error('No lines found!');
  } else {
    console.log(pc.green(`Found ${pc.bold(allLines.length)} lines!`));
  }

  const firstTranscriptionEntry = await prisma.entry.findUnique({
    where: {
      uuid: allTranscriptions[0].entryId,
    },
  });
  if (!firstTranscriptionEntry) {
    console.log(pc.red('No entry found for first transcription!'));
    throw new Error('No entry found for first transcription!');
  } else {
    console.log(pc.green('Found entry for first transcription!'));
  }
}

main()
  .then(() => {
    console.log(pc.green('Seeding complete!'));
  })
  .catch(e => {
    console.error(pc.red('Error seeding database!'));
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
