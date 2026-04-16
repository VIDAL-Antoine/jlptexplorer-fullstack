'use client';

import { Suspense } from 'react';
import { useParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Group, Skeleton, Stack } from '@mantine/core';
import NotFound from '@/app/[lang]/not-found';
import { GrammarPointsMultiSelect } from '@/components/features/grammar/GrammarPointsMultiSelect/GrammarPointsMultiSelect';
import { ScenesGrid } from '@/components/features/scenes/ScenesGrid/ScenesGrid';
import { SourceHeader } from '@/components/features/sources/SourceHeader/SourceHeader';
import { useSettings } from '@/contexts/SettingsContext';
import { useApiData } from '@/hooks/useApiData';
import { useUrlFilters } from '@/hooks/useUrlFilters';
import { api } from '@/lib/api';
import { getLocalizedTitle } from '@/utils/i18n';

const PAGE_SIZE = 12;

function SourceLoadingFallback() {
  return (
    <Stack mt="xl" gap="lg">
      <Group align="flex-start" gap="xl">
        <Skeleton width={120} height={180} radius="md" style={{ flexShrink: 0 }} />
        <Stack gap="xs">
          <Group align="center" gap="sm">
            <Skeleton height={36} width={200} radius="sm" />
            <Skeleton height={24} width={80} radius="xl" />
          </Group>
          <Skeleton height={14} width={150} radius="sm" />
        </Stack>
      </Group>
      <ScenesGrid
        scenes={null}
        totalPages={0}
        page={1}
        onPageChange={() => {}}
        loading
        pageSize={PAGE_SIZE}
        noScenesMessage=""
      />
    </Stack>
  );
}

function SourceContent() {
  const { slug } = useParams<{ lang: string; slug: string }>();
  const locale = useLocale();
  const t = useTranslations('SourcePage');
  const tTypes = useTranslations('SourceTypes');
  const { sourceTitleLang, grammarMatch } = useSettings();
  const { filters, rawFilters, setFilters } = useUrlFilters(['grammar_points'] as const);

  const { data: source, loading: sourceLoading } = useApiData(() => api.sources.get(slug), [slug]);

  const { data: scenesPage, loading: scenesLoading } = useApiData(
    () =>
      api.sources.scenes(slug, {
        grammar_points: filters.grammar_points.length ? filters.grammar_points : undefined,
        grammar_match: grammarMatch,
        page: filters.page,
        limit: PAGE_SIZE,
      }),
    [slug, rawFilters.grammar_points, grammarMatch, filters.page]
  );

  if (sourceLoading) {
    return <SourceLoadingFallback />;
  }
  if (!source) {
    return <NotFound />;
  }

  const displayTitle = getLocalizedTitle(source, sourceTitleLang, locale);
  const availableGrammarPoints = scenesPage?.availableGrammarPoints ?? [];
  const totalPages = scenesPage ? Math.ceil(scenesPage.total / PAGE_SIZE) : 0;
  const currentGrammarPointIds = availableGrammarPoints
    .filter((gp) => filters.grammar_points.includes(gp.slug))
    .map((gp) => gp.id);

  return (
    <Stack mt="xl" gap="lg">
      <SourceHeader
        source={source}
        displayTitle={displayTitle ?? ''}
        scenesCount={scenesPage?.total ?? 0}
        grammarPointsCount={availableGrammarPoints.length}
        tTypes={(key) => tTypes(key as Parameters<typeof tTypes>[0])}
        tScenes={(key, values) => t(key as Parameters<typeof t>[0], values)}
      />

      {availableGrammarPoints.length > 0 && (
        <GrammarPointsMultiSelect
          grammarPoints={availableGrammarPoints}
          value={filters.grammar_points}
          onChange={(value) => setFilters({ grammar_points: value, page: 1 })}
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
        currentGrammarPointIds={currentGrammarPointIds}
        hideSourceInfo
      />
    </Stack>
  );
}

export default function SourcePage() {
  return (
    <Suspense fallback={<SourceLoadingFallback />}>
      <SourceContent />
    </Suspense>
  );
}
