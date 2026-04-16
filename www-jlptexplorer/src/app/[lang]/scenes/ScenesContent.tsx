'use client';

import { useTranslations } from 'next-intl';
import { Stack, Title } from '@mantine/core';
import { GrammarPointsMultiSelect } from '@/components/features/grammar/GrammarPointsMultiSelect/GrammarPointsMultiSelect';
import { ScenesGrid } from '@/components/features/scenes/ScenesGrid/ScenesGrid';
import { SourcesMultiSelect } from '@/components/features/sources/SourcesMultiSelect/SourcesMultiSelect';
import { useSettings } from '@/contexts/SettingsContext';
import { useApiData } from '@/hooks/useApiData';
import { useUrlFilters } from '@/hooks/useUrlFilters';
import { api } from '@/lib/api';

const PAGE_SIZE = 12;

export function ScenesContent() {
  const t = useTranslations('ScenesPage');
  const { grammarMatch } = useSettings();
  const { filters, rawFilters, setFilters } = useUrlFilters(['sources', 'grammar_points'] as const);

  const { data: scenesPage, loading } = useApiData(
    () =>
      api.scenes.list({
        sources: filters.sources.length ? filters.sources : undefined,
        grammar_points: filters.grammar_points.length ? filters.grammar_points : undefined,
        grammar_match: grammarMatch,
        page: filters.page,
        limit: PAGE_SIZE,
      }),
    [rawFilters.sources, rawFilters.grammar_points, grammarMatch, filters.page]
  );

  const availableSources = scenesPage?.availableSources ?? [];
  const availableGrammarPoints = scenesPage?.availableGrammarPoints ?? [];
  const totalPages = scenesPage ? Math.ceil(scenesPage.total / PAGE_SIZE) : 0;

  const currentGrammarPointIds = availableGrammarPoints
    .filter((gp) => filters.grammar_points.includes(gp.slug))
    .map((gp) => gp.id);

  return (
    <Stack mt="xl" gap="lg">
      <Title order={1}>{t('title')}</Title>

      <SourcesMultiSelect
        sources={availableSources}
        value={filters.sources}
        onChange={(value) => setFilters({ sources: value, page: 1 })}
        placeholder={t('filterBySource')}
      />
      <GrammarPointsMultiSelect
        grammarPoints={availableGrammarPoints}
        value={filters.grammar_points}
        onChange={(value) => setFilters({ grammar_points: value, page: 1 })}
        placeholder={t('filterByGrammar')}
      />

      <ScenesGrid
        scenes={scenesPage?.items ?? null}
        totalPages={totalPages}
        page={filters.page}
        onPageChange={(newPage) => setFilters({ page: newPage })}
        loading={loading}
        pageSize={PAGE_SIZE}
        noScenesMessage={t('noScenes')}
        currentGrammarPointIds={currentGrammarPointIds}
      />
    </Stack>
  );
}
