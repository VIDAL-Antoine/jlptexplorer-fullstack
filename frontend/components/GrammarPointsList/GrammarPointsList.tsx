'use client';

import { useState } from 'react';
import { Badge, Button, Card, Group, Stack, Text } from '@mantine/core';
import { api, type GrammarPoint } from '../../lib/api';

export function GrammarPointsList() {
  const [grammarPoints, setGrammarPoints] = useState<GrammarPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  async function fetchGrammarPoints() {
    setLoading(true);
    const data = await api.grammarPoints.list();
    setGrammarPoints(data);
    setLoading(false);
    setLoaded(true);
  }

  return (
    <Stack mt="xl">
      {!loaded && (
        <Button onClick={fetchGrammarPoints} loading={loading}>
          Load grammar points
        </Button>
      )}

      {grammarPoints.map((gp) => (
        <Card key={gp.id} shadow="sm" padding="md" radius="md" withBorder>
          <Group justify="space-between">
            <Text fw={600}>{gp.title}</Text>
            <Badge color="blue">{gp.jlpt_level}</Badge>
          </Group>
          <Text size="sm" c="dimmed">{gp.romaji}</Text>
          <Text size="sm" mt="xs">{gp.meaning}</Text>
        </Card>
      ))}
    </Stack>
  );
}
