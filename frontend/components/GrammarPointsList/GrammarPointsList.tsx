'use client';

import { useEffect, useState } from 'react';
import { Badge, Card, Group, Stack, Text } from '@mantine/core';
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
    <Stack mt="xl">
      {grammarPoints.map((gp) => (
        <Card key={gp.id} shadow="sm" padding="md" radius="md" withBorder>
          <Group justify="space-between">
            <Text fw={600}>{gp.title}</Text>
            <Badge color="blue">{gp.jlpt_level}</Badge>
          </Group>
          <Text size="sm" c="dimmed">
            {gp.romaji}
          </Text>
          <Text size="sm" mt="xs">
            {gp.meaning}
          </Text>
        </Card>
      ))}
    </Stack>
  );
}
