'use client';

import { useEffect, useState } from 'react';
import { Badge, Card, Group, SimpleGrid, Text, Title } from '@mantine/core';
import { api, type GrammarPoint } from '../../lib/api';
import { PageLoader } from '../PageLoader/PageLoader';

export function GrammarPointsList() {
  const [grammarPoints, setGrammarPoints] = useState<GrammarPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    api.grammarPoints.list().then((data) => {
      setGrammarPoints(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <PageLoader />;

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} mt="xl">
      {grammarPoints.map((gp) => (
        <Card key={gp.id} shadow="sm" padding="md" radius="md" withBorder>
          <Group justify="space-between">
            <Title order={1}>{gp.title}</Title>
            <Badge color="blue">{gp.jlpt_level}</Badge>
          </Group>
          <Text size="md" c="dimmed">
            {gp.romaji}
          </Text>
          <Text size="md" mt="xs">
            {gp.meaning}
          </Text>
        </Card>
      ))}
    </SimpleGrid>
  );
}
