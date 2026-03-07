'use client';

import { useEffect, useState } from 'react';
import { Badge, Card, Group, Stack, Text } from '@mantine/core';
import { api, type Source } from '../../lib/api';
import { PageLoader } from '../PageLoader/PageLoader';

const TYPE_COLORS: Record<Source['type'], string> = {
  game: 'blue',
  anime: 'pink',
  movie: 'dark',
  series: 'violet',
  music: 'teal',
};

export function SourcesList() {
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    api.sources.list().then((data) => {
      setSources(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <PageLoader />;

  return (
    <Stack mt="xl">
      {sources.map((source) => (
        <Card key={source.id} shadow="sm" padding="md" radius="md" withBorder>
          <Group justify="space-between">
            <Text fw={600}>{source.title}</Text>
            <Badge color={TYPE_COLORS[source.type]}>{source.type}</Badge>
          </Group>
          {source.japanese_title && (
            <Text size="sm" c="dimmed">
              {source.japanese_title}
            </Text>
          )}
        </Card>
      ))}
    </Stack>
  );
}
