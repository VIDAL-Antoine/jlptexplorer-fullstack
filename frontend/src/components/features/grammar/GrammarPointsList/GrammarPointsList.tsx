'use client';

import { useEffect, useState } from 'react';
import { IconSearch } from '@tabler/icons-react';
import { useLocale, useTranslations } from 'next-intl';
import { Center, Pagination, SegmentedControl, SimpleGrid, Stack, Text, TextInput } from '@mantine/core';
import { JLPT_LEVEL_COLORS } from '@/constants/jlpt';
import { useApiData } from '@/hooks/useApiData';
import { useQueryParam } from '@/hooks/useQueryParam';
import { api } from '@/lib/api';
import { GrammarPointCard } from './GrammarPointCard';
import { GrammarPointsListSkeleton } from './GrammarPointsListSkeleton';

const LEVELS = Object.keys(JLPT_LEVEL_COLORS);
const PAGE_SIZE = 100;

export function GrammarPointsList() {
  const t = useTranslations('GrammarPointsList');
  const locale = useLocale();
  const { setParam, searchParams } = useQueryParam();
  const rawLevel = searchParams.get('jlpt_level');
  const [level, setLevel] = useState(rawLevel && LEVELS.includes(rawLevel) ? rawLevel : 'All');
  const [inputValue, setInputValue] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const id = setTimeout(() => {
      setSearch(inputValue);
      setPage(1);
    }, 200);
    return () => clearTimeout(id);
  }, [inputValue]);

  const handleLevelChange = (newLevel: string) => {
    setLevel(newLevel);
    setPage(1);
    setParam('jlpt_level', newLevel === 'All' ? null : newLevel);
  };

  const levelSegmentedData = [
    {
      label: (
        <Text fz="xl" fw={700} py="xs">
          {t('all')}
        </Text>
      ),
      value: 'All',
    },
    ...LEVELS.map((l) => ({
      label: (
        <Text
          fz="xl"
          fw={700}
          c={`${JLPT_LEVEL_COLORS[l as keyof typeof JLPT_LEVEL_COLORS]}.6`}
          py="xs"
          inherit
        >
          {l}
        </Text>
      ),
      value: l,
    })),
  ];

  const { data, loading } = useApiData(
    () =>
      api.grammarPoints.list(locale, {
        jlptLevel: level === 'All' ? undefined : level,
        search: search || undefined,
        page,
        limit: PAGE_SIZE,
      }),
    [level, search, page, locale]
  );

  return (
    <Stack mt="xl">
      <SegmentedControl
        data={levelSegmentedData}
        value={level}
        onChange={handleLevelChange}
        orientation="vertical"
        fullWidth
        hiddenFrom="xs"
      />
      <SegmentedControl
        data={levelSegmentedData}
        value={level}
        onChange={handleLevelChange}
        size="xl"
        fullWidth
        visibleFrom="xs"
      />
      <TextInput
        placeholder={t('searchPlaceholder')}
        leftSection={<IconSearch size={16} />}
        value={inputValue}
        size="lg"
        onChange={(e) => setInputValue(e.currentTarget.value)}
      />

      {!data ? (
        <GrammarPointsListSkeleton />
      ) : (
        <Stack>
          <SimpleGrid
            cols={{ base: 1, sm: 2, md: 3, lg: 4 }}
            style={{ opacity: loading ? 0.6 : 1, transition: 'opacity 0.15s' }}
          >
            {data.grammar_points.map((gp) => (
              <GrammarPointCard key={gp.id} gp={gp} />
            ))}
          </SimpleGrid>
          {data.totalPages > 1 && (
            <Center>
              <Pagination total={data.totalPages} value={page} onChange={setPage} />
            </Center>
          )}
        </Stack>
      )}
    </Stack>
  );
}
