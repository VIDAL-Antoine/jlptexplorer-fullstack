'use client';

import { Suspense } from 'react';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Group, Skeleton, Stack } from '@mantine/core';
import NotFound from '@/app/[lang]/not-found';
import { GrammarPointsMultiSelect } from '@/components/features/grammar/GrammarPointsMultiSelect/GrammarPointsMultiSelect';
import { ScenesGrid } from '@/components/features/scenes/ScenesGrid/ScenesGrid';
import { SourceHeader } from '@/components/features/sources/SourceHeader/SourceHeader';
import { useSettings } from '@/contexts/SettingsContext';
import { useApiData } from '@/hooks/useApiData';
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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations('SourcePage');
  const tTypes = useTranslations('SourceTypes');
  const { sourceTitleLang, grammarMatch } = useSettings();

  const grammarFilterRaw = searchParams.get('grammar_points') ?? '';
  const grammarFilter = grammarFilterRaw ? grammarFilterRaw.split(',') : [];
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10) || 1);

  const { data: source, loading: sourceLoading } = useApiData(() => api.sources.get(slug), [slug]);

  const { data: scenesPage, loading: scenesLoading } = useApiData(
    () =>
      api.sources.scenes(slug, {
        grammar_points: grammarFilter.length ? grammarFilter : undefined,
        grammar_match: grammarMatch,
        page,
        limit: PAGE_SIZE,
      }),
    [slug, grammarFilterRaw, grammarMatch, page]
  );

  function updateParams(grammar: string[], newPage: number) {
    const params = new URLSearchParams();
    if (grammar.length > 0) {
      params.set('grammar_points', grammar.join(','));
    }
    if (newPage > 1) {
      params.set('page', String(newPage));
    }
    const qs = params.toString();
    router.replace(`${pathname}${qs ? `?${qs}` : ''}`);
  }

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
    .filter((gp) => grammarFilter.includes(gp.slug))
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
          value={grammarFilter}
          onChange={(value) => updateParams(value, 1)}
          placeholder={t('filterPlaceholder')}
        />
      )}

      <ScenesGrid
        scenes={scenesPage?.items ?? null}
        totalPages={totalPages}
        page={page}
        onPageChange={(newPage) => updateParams(grammarFilter, newPage)}
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
