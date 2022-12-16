import {Card, Center, Divider, Stack, Text, Title} from '@mantine/core';
import * as React from 'react';
import strings from '../../features/localization';

function About() {
  return (
    <Center my="lg">
      <Stack style={{maxWidth: '700px'}}>
        <Card withBorder>
          <Title
            order={2}
            align={'center'}
          >
            {strings.about?.title}
          </Title>
          <Divider my="md" />
          <Text> {strings.about?.title} </Text>
        </Card>
      </Stack>
    </Center>
  );
}

export default About;
