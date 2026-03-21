'use client';

import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Group, Skeleton, Stack } from '@mantine/core';
import NotFound from '@/app/[lang]/not-found';
import { GrammarPointHeader } from '@/components/features/grammar/GrammarPointHeader/GrammarPointHeader';
import { ScenesGrid } from '@/components/features/scenes/ScenesGrid/ScenesGrid';
import { SourcesMultiSelect } from '@/components/features/sources/SourcesMultiSelect/SourcesMultiSelect';
import { useApiData } from '@/hooks/useApiData';
import { api } from '@/lib/api';

const PAGE_SIZE = 12;

export default function GrammarPointPage() {
  const { slug } = useParams<{ lang: string; slug: string }>();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations('GrammarPointPage');

  const sourceFilterRaw = searchParams.get('source') ?? '';
  const sourceFilter = sourceFilterRaw ? sourceFilterRaw.split(',') : [];
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10) || 1);

  const { data: grammarPoint, loading: grammarPointLoading } = useApiData(
    () => api.grammarPoints.get(locale, slug),
    [slug, locale]
  );

  const { data: scenesPage, loading: scenesLoading } = useApiData(
    () => api.grammarPoints.scenes(locale, slug, { page, limit: PAGE_SIZE, sources: sourceFilter }),
    [slug, locale, page, sourceFilterRaw]
  );

  function updateParams(sources: string[], newPage: number) {
    const params = new URLSearchParams();
    if (sources.length > 0) {params.set('source', sources.join(','));}
    if (newPage > 1) {params.set('page', String(newPage));}
    const qs = params.toString();
    router.replace(`${pathname}${qs ? `?${qs}` : ''}`);
  }

  if (grammarPointLoading) {
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
  if (!grammarPoint) {return <NotFound />;}

  const selectedSources = grammarPoint.available_sources.filter((s) =>
    sourceFilter.includes(s.slug)
  );
  const availableSources = scenesPage?.available_sources ?? grammarPoint.available_sources;
  const mergedSources = [
    ...availableSources,
    ...selectedSources.filter((s) => !availableSources.some((a) => a.id === s.id)),
  ];

  return (
    <Stack mt="xl" gap="lg">
      <GrammarPointHeader
        grammarPoint={grammarPoint}
        tScenes={(key, values) => t(key as Parameters<typeof t>[0], values)}
      />

      {grammarPoint.available_sources.length > 0 && (
        <SourcesMultiSelect
          sources={mergedSources}
          value={sourceFilter}
          onChange={(value) => updateParams(value, 1)}
          placeholder={t('filterPlaceholder')}
        />
      )}

      <ScenesGrid
        scenes={scenesPage?.scenes ?? null}
        totalPages={scenesPage?.totalPages ?? 0}
        page={page}
        onPageChange={(newPage) => updateParams(sourceFilter, newPage)}
        loading={scenesLoading}
        pageSize={PAGE_SIZE}
        noScenesMessage={t('noScenes')}
        currentGrammarPointIds={[grammarPoint.id]}
      />
    </Stack>
  );
}
