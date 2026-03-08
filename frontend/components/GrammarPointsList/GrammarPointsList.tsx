'use client';

import { useEffect, useState } from 'react';
import { IconSearch } from '@tabler/icons-react';
import {
  Badge,
  Card,
  Group,
  SegmentedControl,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { api, type GrammarPoint } from '../../lib/api';
import { PageLoader } from '../PageLoader/PageLoader';

const LEVELS = ['All', 'N5', 'N4', 'N3', 'N2', 'N1'];

export function GrammarPointsList() {
  const [grammarPoints, setGrammarPoints] = useState<GrammarPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [level, setLevel] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    api.grammarPoints.list(level === 'All' ? undefined : level).then((data) => {
      setGrammarPoints(data);
      setLoading(false);
    });
  }, [level]);

  const filtered = grammarPoints.filter((gp) => {
    const q = search.toLowerCase();
    return (
      gp.title.toLowerCase().includes(q) ||
      gp.romaji.toLowerCase().includes(q) ||
      gp.meaning.toLowerCase().includes(q)
    );
  });

  return (
    <Stack mt="xl">
      <Select
        data={LEVELS}
        value={level}
        onChange={(v) => setLevel(v ?? 'All')}
        size="lg"
        hiddenFrom="xs"
        allowDeselect={false}
      />
      <SegmentedControl data={LEVELS} value={level} onChange={setLevel} size="xl" fullWidth visibleFrom="xs" />
      <TextInput
        placeholder="Search..."
        leftSection={<IconSearch size={16} />}
        value={search}
        size="lg"
        onChange={(e) => setSearch(e.currentTarget.value)}
      />

      {loading ? (
        <PageLoader />
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }}>
          {filtered.map((gp) => (
            <Card key={gp.id} shadow="sm" padding="md" radius="md" withBorder>
              <Group justify="space-between" wrap="nowrap" align="flex-start">
                <Title order={1} flex={1}>
                  {gp.title}
                </Title>
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
      )}
    </Stack>
  );
}
