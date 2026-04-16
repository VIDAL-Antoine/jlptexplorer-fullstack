'use client';

import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Group, Skeleton, Stack } from '@mantine/core';
import NotFound from '@/app/[lang]/not-found';
import { GrammarPointHeader } from '@/components/features/grammar/GrammarPointHeader/GrammarPointHeader';
import { ScenesGrid } from '@/components/features/scenes/ScenesGrid/ScenesGrid';
import { SourcesMultiSelect } from '@/components/features/sources/SourcesMultiSelect/SourcesMultiSelect';
import { useApiData } from '@/hooks/useApiData';
import { useUrlFilters } from '@/hooks/useUrlFilters';
import { api } from '@/lib/api';

const PAGE_SIZE = 12;

export function GrammarPointLoadingFallback() {
  return (
    <Stack mt="xl" gap="lg">
      <div>
        <Group align="center" gap="sm" mb="xs">
          <Skeleton height={36} width={200} radius="sm" />
          <Skeleton height={24} width={40} radius="xl" />
        </Group>
        <Skeleton height={14} width={120} radius="sm" mb="xs" />
        <Skeleton height={14} width={300} radius="sm" mb="xs" />
        <Skeleton height={12} width={100} radius="sm" />
      </div>
      <ScenesGrid
        scenes={null}
        totalPages={0}
        page={1}
        onPageChange={() => {}}
        loading
        pageSize={PAGE_SIZE}
        noScenesMessage=""
        currentGrammarPointIds={[]}
      />
    </Stack>
  );
}

export function GrammarPointContent() {
  const { slug } = useParams<{ lang: string; slug: string }>();
  const t = useTranslations('GrammarPointPage');
  const { filters, rawFilters, setFilters } = useUrlFilters(['sources'] as const);

  const { data: grammarPoint, loading: grammarPointLoading } = useApiData(
    () => api.grammarPoints.get(slug),
    [slug]
  );

  const { data: scenesPage, loading: scenesLoading } = useApiData(
    () =>
      api.grammarPoints.scenes(slug, {
        sources: filters.sources,
        page: filters.page,
        limit: PAGE_SIZE,
      }),
    [slug, rawFilters.sources, filters.page]
  );

  if (grammarPointLoading) {
    return <GrammarPointLoadingFallback />;
  }
  if (!grammarPoint) {
    return <NotFound />;
  }

  const availableSources = scenesPage?.availableSources ?? [];
  const totalPages = scenesPage ? Math.ceil(scenesPage.total / PAGE_SIZE) : 0;

  return (
    <Stack mt="xl" gap="lg">
      <GrammarPointHeader
        grammarPoint={grammarPoint}
        scenesCount={scenesPage?.total ?? 0}
        tScenes={(key, values) => t(key as Parameters<typeof t>[0], values)}
      />

      {availableSources.length > 0 && (
        <SourcesMultiSelect
          sources={availableSources}
          value={filters.sources}
          onChange={(value) => setFilters({ sources: value, page: 1 })}
          placeholder={t('filterPlaceholder')}
        />
      )}

      <ScenesGrid
        scenes={scenesPage?.items ?? null}
        totalPages={totalPages}
        page={filters.page}
        onPageChange={(newPage) => setFilters({ page: newPage })}
        loading={scenesLoading}
        pageSize={PAGE_SIZE}
        noScenesMessage={t('noScenes')}
        currentGrammarPointIds={grammarPoint ? [grammarPoint.id] : []}
      />
    </Stack>
  );
}
