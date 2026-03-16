'use client';

import { useEffect, useState } from 'react';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  IconDeviceGamepad2,
  IconDeviceTv,
  IconMovie,
  IconMusic,
  IconTag,
} from '@tabler/icons-react';
import { useLocale, useTranslations } from 'next-intl';
import {
  AspectRatio,
  Badge,
  Group,
  Image,
  MultiSelect,
  Pagination,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { PageLoader } from '../../../../components/ui/PageLoader/PageLoader';
import { SceneCard } from '../../../../components/features/scenes/SceneCard/SceneCard';
import { useSettings } from '../../../../contexts/SettingsContext';
import { Link } from '../../../../i18n/navigation';
import { api, type SourceDetail, type SourceScenesPage } from '../../../../lib/api';
import NotFound from '../../not-found';

type SourceType = SourceDetail['type'];
type IconComponent = React.ComponentType<{ size?: number }>;

const SOURCE_TYPE_ICONS: Partial<Record<SourceType, IconComponent>> = {
  game: IconDeviceGamepad2,
  anime: IconDeviceTv,
  series: IconDeviceTv,
  movie: IconMovie,
  music: IconMusic,
};

function getSourceTypeIcon(type: SourceType): IconComponent {
  return SOURCE_TYPE_ICONS[type] ?? IconTag;
}

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
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1') || 1);

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
  }, [slug, locale, page, grammarFilterRaw]); // grammarFilterRaw is a stable string, not a new array each render

  function updateParams(grammar: string[], newPage: number) {
    const params = new URLSearchParams();
    if (grammar.length > 0) params.set('grammar_points', grammar.join(','));
    if (newPage > 1) params.set('page', String(newPage));
    const qs = params.toString();
    router.replace(`${pathname}${qs ? `?${qs}` : ''}`);
  }

  if (sourceLoading) return <PageLoader />;
  if (!source) return <NotFound />;

  const SourceTypeIcon = getSourceTypeIcon(source.type);
  const displayTitle =
    sourceTitleLang === 'japanese' ? (source.japanese_title ?? source.title) : source.title;

  // Merge available grammar points (from current filter) with already-selected ones
  // so selected items remain deselectable even if they're no longer in available list
  const selectedGrammarPoints = source.grammar_points.filter((gp) =>
    grammarFilter.includes(gp.slug)
  );
  const availableGrammarPoints = scenesPage?.available_grammar_points ?? source.grammar_points;
  const mergedGrammarPoints = [
    ...availableGrammarPoints,
    ...selectedGrammarPoints.filter((gp) => !availableGrammarPoints.some((a) => a.id === gp.id)),
  ];

  const toItem = (gp: { slug: string; title: string; romaji: string; meaning: string | null }) => ({
    value: gp.slug,
    label: [gp.romaji ? `${gp.title} (${gp.romaji})` : gp.title, gp.meaning].filter(Boolean).join(' — '),
  });

  const selectData = (['N5', 'N4', 'N3', 'N2', 'N1'] as const).flatMap((level) => {
    const items = mergedGrammarPoints.filter((gp) => gp.jlpt_level === level).map(toItem);
    return items.length ? [{ group: level, items }] : [];
  });

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
                <Text size="sm" c="dimmed">
                  ·
                </Text>
                <Text size="sm" c="dimmed">
                  {t('grammarPointsCount', { count: source.grammar_points.length })}
                </Text>
              </>
            )}
          </Group>
        </Stack>
      </Group>

      {source.grammar_points.length > 0 && (
        <MultiSelect
          size="lg"
          placeholder={t('filterPlaceholder')}
          data={selectData}
          value={grammarFilter}
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
          style={{ opacity: scenesLoading ? 0.5 : 1, transition: 'opacity 0.15s ease' }}
        >
          <SimpleGrid cols={{ base: 1, md: 2, lg: 3, xl: 4 }}>
            {scenesPage.scenes.map((scene) => (
              <SceneCard
                key={scene.id}
                scene={scene}
                hideSourceInfo
                currentGrammarPointIds={
                  grammarFilter.length > 0
                    ? mergedGrammarPoints
                        .filter((gp) => grammarFilter.includes(gp.slug))
                        .map((gp) => gp.id)
                    : undefined
                }
              />
            ))}
          </SimpleGrid>
          {scenesPage.totalPages > 1 && (
            <Group justify="center">
              <Pagination
                total={scenesPage.totalPages}
                value={page}
                onChange={(newPage) => updateParams(grammarFilter, newPage)}
              />
            </Group>
          )}
        </Stack>
      )}
    </Stack>
  );
}
