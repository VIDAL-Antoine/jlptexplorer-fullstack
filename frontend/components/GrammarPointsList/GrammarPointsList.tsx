'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '../../i18n/navigation';
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
import { useSettings } from '../../contexts/SettingsContext';

const LEVELS = Object.keys(JLPT_LEVEL_COLORS);
import { api, type GrammarPoint } from '../../lib/api';
import { PageLoader } from '../PageLoader/PageLoader';

export function GrammarPointsList() {
  const t = useTranslations('GrammarPointsList');
  const [grammarPoints, setGrammarPoints] = useState<GrammarPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [level, setLevel] = useState('All');
  const [search, setSearch] = useState('');
  const locale = useLocale();
  const { showGrammarPointRomaji } = useSettings();

  const levelFilterData = [
    { label: t('all'), value: 'All' },
    ...LEVELS.map((l) => ({ label: l, value: l })),
  ];

  useEffect(() => {
    setLoading(true);
    api.grammarPoints.list(locale, level === 'All' ? undefined : level).then((data) => {
      setGrammarPoints(data);
      setLoading(false);
    });
  }, [level, locale]);

  const filtered = grammarPoints.filter((gp) => {
    const q = search.toLowerCase();
    return (
      gp.title.toLowerCase().includes(q) ||
      gp.romaji.toLowerCase().includes(q) ||
      (gp.meaning ?? '').toLowerCase().includes(q)
    );
  });

  return (
    <Stack mt="xl">
      <Select
        data={levelFilterData}
        value={level}
        onChange={(v) => setLevel(v ?? 'All')}
        size="lg"
        hiddenFrom="xs"
        allowDeselect={false}
      />
      <SegmentedControl data={levelFilterData} value={level} onChange={setLevel} size="xl" fullWidth visibleFrom="xs" />
      <TextInput
        placeholder={t('searchPlaceholder')}
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
            <Card key={gp.id} shadow="sm" padding="md" radius="md" withBorder component={Link} href={`/grammar-points/${gp.slug}`} style={{ textDecoration: 'none' }}>
              <Group justify="space-between" wrap="nowrap" align="flex-start">
                <Title order={1} flex={1}>
                  {gp.title}
                </Title>
                <Badge color={JLPT_LEVEL_COLORS[gp.jlpt_level]}>{gp.jlpt_level}</Badge>
              </Group>
              {showGrammarPointRomaji && (
                <Text size="md" c="dimmed">
                  {gp.romaji}
                </Text>
              )}
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
