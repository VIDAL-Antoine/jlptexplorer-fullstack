'use client';

import { useEffect, useState } from 'react';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Badge, Group, Stack, Text, Title } from '@mantine/core';
import NotFound from '@/app/[lang]/not-found';
import { ScenesGrid } from '@/components/features/scenes/ScenesGrid/ScenesGrid';
import { SourcesMultiSelect } from '@/components/features/sources/SourcesMultiSelect/SourcesMultiSelect';
import { PageLoader } from '@/components/ui/PageLoader/PageLoader';
import { JLPT_LEVEL_COLORS } from '@/constants/jlpt';
import { Link } from '@/i18n/navigation';
import { api, type GrammarPointDetail, type GrammarPointScenesPage } from '@/lib/api';

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

  const [grammarPoint, setGrammarPoint] = useState<GrammarPointDetail | null>(null);
  const [grammarPointLoading, setGrammarPointLoading] = useState(true);
  const [scenesPage, setScenesPage] = useState<GrammarPointScenesPage | null>(null);
  const [scenesLoading, setScenesLoading] = useState(true);

  useEffect(() => {
    setGrammarPointLoading(true);
    api.grammarPoints
      .get(locale, slug)
      .then(setGrammarPoint)
      .catch(() => setGrammarPoint(null))
      .finally(() => setGrammarPointLoading(false));
  }, [slug, locale]);

  useEffect(() => {
    setScenesLoading(true);
    api.grammarPoints
      .scenes(locale, slug, { page, limit: PAGE_SIZE, sources: sourceFilter })
      .then(setScenesPage)
      .catch(() => setScenesPage(null))
      .finally(() => setScenesLoading(false));
  }, [slug, locale, page, sourceFilterRaw]); // eslint-disable-line react-hooks/exhaustive-deps -- sourceFilter is a new array each render; sourceFilterRaw is the stable string dep

  function updateParams(sources: string[], newPage: number) {
    const params = new URLSearchParams();
    if (sources.length > 0) params.set('source', sources.join(','));
    if (newPage > 1) params.set('page', String(newPage));
    const qs = params.toString();
    router.replace(`${pathname}${qs ? `?${qs}` : ''}`);
  }

  if (grammarPointLoading) return <PageLoader />;
  if (!grammarPoint) return <NotFound />;

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
      <div>
        <Group align="center" gap="sm">
          <Title order={1}>{grammarPoint.title}</Title>
          <Badge
            color={JLPT_LEVEL_COLORS[grammarPoint.jlpt_level]}
            size="lg"
            component={Link}
            href={`/grammar-points?jlpt_level=${grammarPoint.jlpt_level}`}
            style={{ cursor: 'pointer' }}
          >
            {grammarPoint.jlpt_level}
          </Badge>
        </Group>
        <Text c="dimmed">{grammarPoint.romaji}</Text>
        <Text mt="xs">{grammarPoint.meaning}</Text>
        {grammarPoint.notes && (
          <Text size="sm" c="dimmed" mt="xs">
            {grammarPoint.notes}
          </Text>
        )}
        <Text size="sm" c="dimmed" mt="xs">
          {t('scenesCount', { count: grammarPoint.scenes_count })}
        </Text>
      </div>

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
