'use client';

import { useEffect, useState } from 'react';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import {
  Badge,
  Group,
  MultiSelect,
  Pagination,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import NotFound from '@/app/[lang]/not-found';
import { SceneCard } from '@/components/features/scenes/SceneCard/SceneCard';
import { PageLoader } from '@/components/ui/PageLoader/PageLoader';
import { JLPT_LEVEL_COLORS } from '@/constants/jlpt';
import { useSettings } from '@/contexts/SettingsContext';
import { Link } from '@/i18n/navigation';
import { api, type GrammarPointDetail, type GrammarPointScenesPage } from '@/lib/api';

const PAGE_SIZE = 12;

const SOURCE_TYPE_ORDER = ['anime', 'game', 'movie', 'series', 'music'] as const;

export default function GrammarPointPage() {
  const { slug } = useParams<{ lang: string; slug: string }>();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations('GrammarPointPage');
  const tTypes = useTranslations('SourceTypes');
  const { sourceTitleLang } = useSettings();

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
    if (sources.length > 0) {
      params.set('source', sources.join(','));
    }
    if (newPage > 1) {
      params.set('page', String(newPage));
    }
    const qs = params.toString();
    router.replace(`${pathname}${qs ? `?${qs}` : ''}`);
  }

  if (grammarPointLoading) {
    return <PageLoader />;
  }
  if (!grammarPoint) {
    return <NotFound />;
  }

  const selectedSources = grammarPoint.available_sources.filter((s) =>
    sourceFilter.includes(s.slug)
  );
  const availableSources = scenesPage?.available_sources ?? grammarPoint.available_sources;
  const mergedSources = [
    ...availableSources,
    ...selectedSources.filter((s) => !availableSources.some((a) => a.id === s.id)),
  ];

  const toItem = (s: { slug: string; title: string | null; japanese_title: string | null }) => ({
    value: s.slug,
    label: (sourceTitleLang === 'japanese' ? (s.japanese_title ?? s.title) : s.title) ?? s.slug,
  });

  const selectData = SOURCE_TYPE_ORDER.flatMap((type) => {
    const items = mergedSources.filter((s) => s.type === type).map(toItem);
    return items.length ? [{ group: tTypes(type), items }] : [];
  });

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
        <MultiSelect
          size="lg"
          placeholder={t('filterPlaceholder')}
          data={selectData}
          value={sourceFilter}
          onChange={(value) => updateParams(value, 1)}
          searchable
          clearable
          w="100%"
        />
      )}

      {!scenesPage && scenesLoading ? (
        <SimpleGrid cols={{ base: 1, md: 2, lg: 3, xl: 4 }}>
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <Skeleton key={i} height={280} radius="md" />
          ))}
        </SimpleGrid>
      ) : !scenesPage || scenesPage.scenes.length === 0 ? (
        <Text c="dimmed">{t('noScenes')}</Text>
      ) : (
        <Stack
          gap="lg"
          opacity={scenesLoading ? 0.5 : 1}
          style={{ transition: 'opacity 0.15s ease' }}
        >
          <SimpleGrid cols={{ base: 1, md: 2, lg: 3, xl: 4 }}>
            {scenesPage.scenes.map((scene) => (
              <SceneCard key={scene.id} scene={scene} currentGrammarPointIds={[grammarPoint.id]} />
            ))}
          </SimpleGrid>
          {scenesPage.totalPages > 1 && (
            <Group justify="center">
              <Pagination
                total={scenesPage.totalPages}
                value={page}
                onChange={(newPage) => updateParams(sourceFilter, newPage)}
              />
            </Group>
          )}
        </Stack>
      )}
    </Stack>
  );
}
