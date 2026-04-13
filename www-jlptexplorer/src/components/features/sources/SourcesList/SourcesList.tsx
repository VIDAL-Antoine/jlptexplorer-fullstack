'use client';

import { useState } from 'react';
import { IconSearch } from '@tabler/icons-react';
import { useLocale, useTranslations } from 'next-intl';
import { Center, Chip, Group, Pagination, SimpleGrid, Stack, TextInput } from '@mantine/core';
import { useSettings } from '@/contexts/SettingsContext';
import { useApiData } from '@/hooks/useApiData';
import { useQueryParam } from '@/hooks/useQueryParam';
import { api } from '@/lib/api';
import { getSourceTypeIcon } from '@/utils/icons';
import { SourceCard } from './SourceCard';
import { SourcesListSkeleton } from './SourcesListSkeleton';

const VALID_SOURCE_TYPES = new Set(['game', 'anime', 'movie', 'series', 'music']);
const PAGE_SIZE = 24;

export function SourcesList() {
  const t = useTranslations('SourcesList');
  const tTypes = useTranslations('SourceTypes');
  const locale = useLocale();
  const { setParam, searchParams } = useQueryParam();
  const rawType = searchParams.get('type');
  const [activeType, setActiveType] = useState<string>(
    rawType && VALID_SOURCE_TYPES.has(rawType) ? rawType : 'all'
  );
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const { sourceTitleLang } = useSettings();

  const handleTypeChange = (v: string) => {
    setActiveType(v);
    setPage(1);
    setParam('type', v === 'all' ? null : v);
  };

  const { data, loading } = useApiData(
    () =>
      api.sources.list(locale, {
        type: activeType !== 'all' ? activeType : undefined,
        page,
        limit: PAGE_SIZE,
      }),
    [locale, activeType, page]
  );

  if (!data) {
    return <SourcesListSkeleton />;
  }

  const filtered = data.sources.filter((s) => {
    const q = search.toLowerCase();
    return (
      (s.title ?? '').toLowerCase().includes(q) ||
      (s.japanese_title ?? '').toLowerCase().includes(q)
    );
  });

  return (
    <Stack mt="xl">
      <TextInput
        placeholder={t('searchPlaceholder')}
        leftSection={<IconSearch size={16} />}
        value={search}
        size="lg"
        onChange={(e) => setSearch(e.currentTarget.value)}
      />
      <Chip.Group value={activeType} onChange={(v) => handleTypeChange(v as string)}>
        <Group gap="xs">
          <Chip value="all" size="xl">
            {t('all')}
          </Chip>
          {data.available_types.map((type) => {
            const Icon = getSourceTypeIcon(type);
            return (
              <Chip key={type} value={type} size="xl">
                <Group gap={6} wrap="nowrap">
                  <Icon size={14} />
                  {tTypes(type)}
                </Group>
              </Chip>
            );
          })}
        </Group>
      </Chip.Group>

      <SimpleGrid
        cols={{ base: 3, sm: 3, md: 4, lg: 8 }}
        style={{ opacity: loading ? 0.6 : 1, transition: 'opacity 0.15s' }}
      >
        {filtered.map((source) => (
          <SourceCard key={source.id} source={source} sourceTitleLang={sourceTitleLang} />
        ))}
      </SimpleGrid>

      {data.totalPages > 1 && (
        <Center>
          <Pagination total={data.totalPages} value={page} onChange={setPage} />
        </Center>
      )}
    </Stack>
  );
}
