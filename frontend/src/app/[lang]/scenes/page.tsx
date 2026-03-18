'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Stack, Title } from '@mantine/core';
import { GrammarPointsMultiSelect } from '@/components/features/grammar/GrammarPointsMultiSelect/GrammarPointsMultiSelect';
import { ScenesGrid } from '@/components/features/scenes/ScenesGrid/ScenesGrid';
import { SourcesMultiSelect } from '@/components/features/sources/SourcesMultiSelect/SourcesMultiSelect';
import { api, type ScenesPage } from '@/lib/api';

const PAGE_SIZE = 12;

export default function ScenesPage() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations('ScenesPage');

  const sourceFilterRaw = searchParams.get('sources') ?? '';
  const sourceFilter = sourceFilterRaw ? sourceFilterRaw.split(',') : [];
  const grammarFilterRaw = searchParams.get('grammar_points') ?? '';
  const grammarFilter = grammarFilterRaw ? grammarFilterRaw.split(',') : [];
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10) || 1);

  const [scenesPage, setScenesPage] = useState<ScenesPage | null>(null);
  const [scenesLoading, setScenesLoading] = useState(true);

  useEffect(() => {
    setScenesLoading(true);
    api.scenes
      .list(locale, { sources: sourceFilter, grammarPoints: grammarFilter, page, limit: PAGE_SIZE })
      .then(setScenesPage)
      .catch(() => setScenesPage(null))
      .finally(() => setScenesLoading(false));
  }, [locale, page, sourceFilterRaw, grammarFilterRaw]); // eslint-disable-line react-hooks/exhaustive-deps -- arrays are rebuilt each render; raw strings are the stable deps

  function updateParams(sources: string[], grammar: string[], newPage: number) {
    const params = new URLSearchParams();
    if (sources.length > 0) params.set('sources', sources.join(','));
    if (grammar.length > 0) params.set('grammar_points', grammar.join(','));
    if (newPage > 1) params.set('page', String(newPage));
    const qs = params.toString();
    router.replace(`${pathname}${qs ? `?${qs}` : ''}`);
  }

  const availableSources = scenesPage?.available_sources ?? [];
  const availableGrammarPoints = scenesPage?.available_grammar_points ?? [];

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
      />
    </Stack>
  );
}
