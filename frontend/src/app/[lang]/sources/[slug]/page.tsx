'use client';

import { useEffect, useState } from 'react';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { AspectRatio, Badge, Group, Image, Skeleton, Stack, Text, Title } from '@mantine/core';
import NotFound from '@/app/[lang]/not-found';
import { GrammarPointsMultiSelect } from '@/components/features/grammar/GrammarPointsMultiSelect/GrammarPointsMultiSelect';
import { ScenesGrid } from '@/components/features/scenes/ScenesGrid/ScenesGrid';
import { useSettings } from '@/contexts/SettingsContext';
import { Link } from '@/i18n/navigation';
import { api, type SourceDetail, type SourceScenesPage } from '@/lib/api';
import { getSourceTypeIcon } from '@/utils/icons';

const PAGE_SIZE = 12;

export default function SourcePage() {
  const { slug } = useParams<{ lang: string; slug: string }>();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations('SourcePage');
  const tTypes = useTranslations('SourceTypes');
  const { sourceTitleLang } = useSettings();

  const grammarFilterRaw = searchParams.get('grammar_points') ?? '';
  const grammarFilter = grammarFilterRaw ? grammarFilterRaw.split(',') : [];
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10) || 1);

  const [source, setSource] = useState<SourceDetail | null>(null);
  const [sourceLoading, setSourceLoading] = useState(true);
  const [scenesPage, setScenesPage] = useState<SourceScenesPage | null>(null);
  const [scenesLoading, setScenesLoading] = useState(true);

  useEffect(() => {
    setSourceLoading(true);
    api.sources
      .get(locale, slug)
      .then(setSource)
      .catch(() => setSource(null))
      .finally(() => setSourceLoading(false));
  }, [slug, locale]);

  useEffect(() => {
    setScenesLoading(true);
    api.sources
      .scenes(locale, slug, { page, limit: PAGE_SIZE, grammarPoints: grammarFilter })
      .then(setScenesPage)
      .catch(() => setScenesPage(null))
      .finally(() => setScenesLoading(false));
  }, [slug, locale, page, grammarFilterRaw]); // eslint-disable-line react-hooks/exhaustive-deps -- grammarFilter is a new array each render; grammarFilterRaw is the stable string dep

  function updateParams(grammar: string[], newPage: number) {
    const params = new URLSearchParams();
    if (grammar.length > 0) params.set('grammar_points', grammar.join(','));
    if (newPage > 1) params.set('page', String(newPage));
    const qs = params.toString();
    router.replace(`${pathname}${qs ? `?${qs}` : ''}`);
  }

  if (sourceLoading) {
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
          loading={true}
          pageSize={PAGE_SIZE}
          noScenesMessage=""
        />
      </Stack>
    );
  }
  if (!source) return <NotFound />;

  const SourceTypeIcon = getSourceTypeIcon(source.type);
  const displayTitle =
    sourceTitleLang === 'japanese' ? (source.japanese_title ?? source.title) : source.title;

  const selectedGrammarPoints = source.grammar_points.filter((gp) =>
    grammarFilter.includes(gp.slug)
  );
  const availableGrammarPoints = scenesPage?.available_grammar_points ?? source.grammar_points;
  const mergedGrammarPoints = [
    ...availableGrammarPoints,
    ...selectedGrammarPoints.filter((gp) => !availableGrammarPoints.some((a) => a.id === gp.id)),
  ];

  const currentGrammarPointIds =
    grammarFilter.length > 0
      ? mergedGrammarPoints.filter((gp) => grammarFilter.includes(gp.slug)).map((gp) => gp.id)
      : undefined;

  return (
    <Stack mt="xl" gap="lg">
      <Group align="flex-start" gap="xl">
        {source.cover_image_url && (
          <AspectRatio ratio={2 / 3} w={120} style={{ flexShrink: 0 }}>
            <Image src={source.cover_image_url} alt={source.title ?? ''} radius="md" fit="cover" />
          </AspectRatio>
        )}
        <Stack gap="xs">
          <Group align="center" gap="sm">
            <Title order={1}>{displayTitle}</Title>
            <Badge
              variant="light"
              size="lg"
              leftSection={<SourceTypeIcon size={12} />}
              component={Link}
              href={`/sources?type=${source.type}`}
              style={{ cursor: 'pointer' }}
            >
              {tTypes(source.type)}
            </Badge>
          </Group>
          <Group gap="xs">
            <Text size="sm" c="dimmed">
              {t('scenesCount', { count: source.scenes_count })}
            </Text>
            {source.grammar_points.length > 0 && (
              <>
                <Text size="sm" c="dimmed">·</Text>
                <Text size="sm" c="dimmed">
                  {t('grammarPointsCount', { count: source.grammar_points.length })}
                </Text>
              </>
            )}
          </Group>
        </Stack>
      </Group>

      {source.grammar_points.length > 0 && (
        <GrammarPointsMultiSelect
          grammarPoints={mergedGrammarPoints}
          value={grammarFilter}
          onChange={(value) => updateParams(value, 1)}
          placeholder={t('filterPlaceholder')}
        />
      )}

      <ScenesGrid
        scenes={scenesPage?.scenes ?? null}
        totalPages={scenesPage?.totalPages ?? 0}
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
