'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { IconSearch } from '@tabler/icons-react';
import { useLocale, useTranslations } from 'next-intl';
import {
  Badge,
  Card,
  Center,
  Group,
  Pagination,
  SegmentedControl,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { JLPT_LEVEL_COLORS } from '../../../../constants/jlpt';
import { Link } from '../../../../i18n/navigation';
import { api, type GrammarPoint } from '../../../../lib/api';
import { PageLoader } from '../../../ui/PageLoader/PageLoader';

const LEVELS = Object.keys(JLPT_LEVEL_COLORS);
const PAGE_SIZE = 100;

export function GrammarPointsList() {
  const t = useTranslations('GrammarPointsList');
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [grammarPoints, setGrammarPoints] = useState<GrammarPoint[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState<boolean>(true);
  const rawLevel = searchParams.get('jlpt_level');
  const [level, setLevel] = useState(rawLevel && LEVELS.includes(rawLevel) ? rawLevel : 'All');
  const [inputValue, setInputValue] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const locale = useLocale();

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
    const params = new URLSearchParams(searchParams.toString());
    if (newLevel === 'All') {
      params.delete('jlpt_level');
    } else {
      params.set('jlpt_level', newLevel);
    }
    const qs = params.toString();
    router.replace(`${pathname}${qs ? `?${qs}` : ''}`);
  };

  const levelFilterData = [
    { label: t('all'), value: 'All' },
    ...LEVELS.map((l) => ({ label: l, value: l })),
  ];

  useEffect(() => {
    setLoading(true);
    api.grammarPoints
      .list(locale, {
        jlptLevel: level === 'All' ? undefined : level,
        search: search || undefined,
        page,
        limit: PAGE_SIZE,
      })
      .then((data) => {
        setGrammarPoints(data.grammar_points);
        setTotalPages(data.totalPages);
        setLoading(false);
      });
  }, [level, search, page, locale]);

  return (
    <Stack mt="xl">
      <Select
        data={levelFilterData}
        value={level}
        onChange={(v) => handleLevelChange(v ?? 'All')}
        size="lg"
        hiddenFrom="xs"
        allowDeselect={false}
      />
      <SegmentedControl
        data={levelFilterData}
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

      {loading ? (
        <PageLoader />
      ) : (
        <Stack>
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }}>
            {grammarPoints.map((gp) =>
              gp.has_scenes ? (
                <Card
                  key={gp.id}
                  shadow="sm"
                  padding="md"
                  radius="md"
                  withBorder
                  component={Link}
                  href={`/grammar-points/${gp.slug}`}
                  style={{ textDecoration: 'none' }}
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
                    {gp.meaning}
                  </Text>
                </Card>
              ) : (
                <Card
                  key={gp.id}
                  shadow="sm"
                  padding="md"
                  radius="md"
                  withBorder
                  style={{ opacity: 0.45, cursor: 'default' }}
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
                    {gp.meaning}
                  </Text>
                  <Badge mt="xs" color="gray" variant="light">
                    {t('noScenes')}
                  </Badge>
                </Card>
              ),
            )}
          </SimpleGrid>
          {totalPages > 1 && (
            <Center>
              <Pagination total={totalPages} value={page} onChange={setPage} />
            </Center>
          )}
        </Stack>
      )}
    </Stack>
  );
}
