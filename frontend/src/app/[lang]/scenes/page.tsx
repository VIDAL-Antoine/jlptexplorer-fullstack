'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Stack, Title } from '@mantine/core';
import { GrammarPointsMultiSelect } from '@/components/features/grammar/GrammarPointsMultiSelect/GrammarPointsMultiSelect';
import { ScenesGrid } from '@/components/features/scenes/ScenesGrid/ScenesGrid';
import { SourcesMultiSelect } from '@/components/features/sources/SourcesMultiSelect/SourcesMultiSelect';
import { useSettings } from '@/contexts/SettingsContext';
import { useApiData } from '@/hooks/useApiData';
import { api } from '@/lib/api';

const PAGE_SIZE = 12;

export default function ScenesPage() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations('ScenesPage');
  const { grammarMatch } = useSettings();

  const sourceFilterRaw = searchParams.get('sources') ?? '';
  const sourceFilter = sourceFilterRaw ? sourceFilterRaw.split(',') : [];
  const grammarFilterRaw = searchParams.get('grammar_points') ?? '';
  const grammarFilter = grammarFilterRaw ? grammarFilterRaw.split(',') : [];
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10) || 1);

  const { data: scenesPage, loading: scenesLoading } = useApiData(
    () =>
      api.scenes.list(locale, {
        sources: sourceFilter,
        grammarPoints: grammarFilter,
        grammarMatch,
        page,
        limit: PAGE_SIZE,
      }),
    [locale, page, sourceFilterRaw, grammarFilterRaw, grammarMatch]
  );

  function updateParams(sources: string[], grammar: string[], newPage: number) {
    const params = new URLSearchParams();
    if (sources.length > 0) {
      params.set('sources', sources.join(','));
    }
    if (grammar.length > 0) {
      params.set('grammar_points', grammar.join(','));
    }
    if (newPage > 1) {
      params.set('page', String(newPage));
    }
    const qs = params.toString();
    router.replace(`${pathname}${qs ? `?${qs}` : ''}`);
  }

  const availableSources = scenesPage?.available_sources ?? [];
  const availableGrammarPoints = scenesPage?.available_grammar_points ?? [];
  const currentGrammarPointIds = availableGrammarPoints
    .filter((gp) => grammarFilter.includes(gp.slug))
    .map((gp) => gp.id);

  return (
    <Stack mt="xl" gap="lg">
      <Title order={1}>{t('title')}</Title>

      <SourcesMultiSelect
        sources={availableSources}
        value={sourceFilter}
        onChange={(value) => updateParams(value, grammarFilter, 1)}
        placeholder={t('filterBySource')}
      />
      <GrammarPointsMultiSelect
        grammarPoints={availableGrammarPoints}
        value={grammarFilter}
        onChange={(value) => updateParams(sourceFilter, value, 1)}
        placeholder={t('filterByGrammar')}
      />

      <ScenesGrid
        scenes={scenesPage?.scenes ?? null}
        totalPages={scenesPage?.totalPages ?? 0}
        page={page}
        onPageChange={(newPage) => updateParams(sourceFilter, grammarFilter, newPage)}
        loading={scenesLoading}
        pageSize={PAGE_SIZE}
        noScenesMessage={t('noScenes')}
        currentGrammarPointIds={currentGrammarPointIds}
      />
    </Stack>
  );
}
