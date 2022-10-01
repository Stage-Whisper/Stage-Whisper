import { Text, Center, Stack, Card, Title, Divider } from '@mantine/core';
import React from 'react';
import strings from '../../localization';

function About() {
  return (
    <Center my="lg">
      <Stack style={{ maxWidth: '700px' }}>
        <Card withBorder>
          <Title order={2} align={'center'}>
            {strings.about?.title}
          </Title>
          <Divider my="md" />
          <Text> {strings.about?.subtitle} </Text>
          <Text>{strings.about?.terms_of_service}</Text>
          <Text>{strings.about?.terms_of_service}</Text>
        </Card>
      </Stack>
    </Center>
  );
}

export default About;
