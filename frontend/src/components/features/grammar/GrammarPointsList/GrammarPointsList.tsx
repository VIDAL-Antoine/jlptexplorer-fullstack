'use client';

import { useEffect, useState } from 'react';
import { IconSearch } from '@tabler/icons-react';
import { useLocale, useTranslations } from 'next-intl';
import {
  Badge,
  Card,
  Center,
  Group,
  Pagination,
  SegmentedControl,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { JLPT_LEVEL_COLORS } from '@/constants/jlpt';
import { useApiData } from '@/hooks/useApiData';
import { useQueryParam } from '@/hooks/useQueryParam';
import { Link } from '@/i18n/navigation';
import { api } from '@/lib/api';

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
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }}>
          {Array.from({ length: 24 }).map((_, i) => (
            <Card key={i} shadow="sm" padding="md" radius="md" withBorder>
              <Group justify="space-between" wrap="nowrap" align="flex-start" mb="xs">
                <Skeleton height={28} width="60%" radius="sm" />
                <Skeleton height={20} width={40} radius="xl" />
              </Group>
              <Skeleton height={14} width="40%" radius="sm" mb="xs" />
              <Skeleton height={14} width="80%" radius="sm" />
            </Card>
          ))}
        </SimpleGrid>
      ) : (
        <Stack>
          <SimpleGrid
            cols={{ base: 1, sm: 2, md: 3, lg: 4 }}
            style={{ opacity: loading ? 0.6 : 1, transition: 'opacity 0.15s' }}
          >
            {data.grammar_points.map((gp) =>
              gp.has_scenes ? (
                <Card
                  key={gp.id}
                  shadow="sm"
                  padding="md"
                  radius="md"
                  withBorder
                  component={Link}
                  href={`/grammar-points/${gp.slug}`}
                  td="none"
                >
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
                    {gp.meaning ? gp.meaning.charAt(0).toUpperCase() + gp.meaning.slice(1) : ''}
                  </Text>
                </Card>
              ) : (
                <Card
                  key={gp.id}
                  shadow="sm"
                  padding="md"
                  radius="md"
                  withBorder
                  opacity={0.45}
                  style={{ cursor: 'default' }}
                >
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
                    {gp.meaning ? gp.meaning.charAt(0).toUpperCase() + gp.meaning.slice(1) : ''}
                  </Text>
                  <Badge mt="xs" color="gray" variant="light">
                    {t('noScenes')}
                  </Badge>
                </Card>
              )
            )}
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
