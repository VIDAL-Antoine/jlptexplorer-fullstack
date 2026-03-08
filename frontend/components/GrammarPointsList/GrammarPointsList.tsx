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
import { JLPT_LEVEL_COLORS } from '../../constants/jlpt';

const LEVEL_FILTER_OPTIONS = ['All', ...Object.keys(JLPT_LEVEL_COLORS)];
import { api, type GrammarPoint } from '../../lib/api';
import { PageLoader } from '../PageLoader/PageLoader';

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
        data={LEVEL_FILTER_OPTIONS}
        value={level}
        onChange={(v) => setLevel(v ?? 'All')}
        size="lg"
        hiddenFrom="xs"
        allowDeselect={false}
      />
      <SegmentedControl data={LEVEL_FILTER_OPTIONS} value={level} onChange={setLevel} size="xl" fullWidth visibleFrom="xs" />
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
                <Badge color={JLPT_LEVEL_COLORS[gp.jlpt_level]}>{gp.jlpt_level}</Badge>
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
