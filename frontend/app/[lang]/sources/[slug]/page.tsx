'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import NotFound from '../../../not-found';
import { Link } from '../../../../i18n/navigation';
import {
  AspectRatio,
  Badge,
  Group,
  Image,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { PageLoader } from '../../../../components/PageLoader/PageLoader';
import { SceneCard } from '../../../../components/SceneCard/SceneCard';
import { JLPT_LEVEL_COLORS } from '../../../../constants/jlpt';
import { api, type GrammarPoint, type SourceWithScenes } from '../../../../lib/api';

export default function SourcePage() {
  const { slug } = useParams<{ lang: string; slug: string }>();
  const [source, setSource] = useState<SourceWithScenes | null>(null);
  const [loading, setLoading] = useState(true);
  const t = useTranslations('SourcePage');
  const locale = useLocale();

  useEffect(() => {
    api.sources.get(locale, slug).then((data) => {
      setSource(data);
    }).catch(() => {
      setSource(null);
    }).finally(() => {
      setLoading(false);
    });
  }, [slug, locale]);

  if (loading) return <PageLoader />;
  if (!source) return <NotFound />;

  const grammarPoints = Array.from(
    new Map(
      source.scenes
        .flatMap((scene) => scene.transcript_lines)
        .flatMap((line) => line.transcript_line_grammar_points)
        .map((tlgp) => tlgp.grammar_points)
        .filter((gp): gp is GrammarPoint => gp !== null)
        .map((gp) => [gp.id, gp])
    ).values()
  );

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
            <Title order={1}>{source.title}</Title>
            <Badge variant="light" size="lg" tt="capitalize">
              {source.type}
            </Badge>
          </Group>
          {source.japanese_title && <Text c="dimmed">{source.japanese_title}</Text>}
          <Group gap="xs">
            <Text size="sm" c="dimmed">
              {t('scenesCount', { count: source.scenes.length })}
            </Text>
            {grammarPoints.length > 0 && (
              <>
                <Text size="sm" c="dimmed">·</Text>
                <Text size="sm" c="dimmed">
                  {t('grammarPointsCount', { count: grammarPoints.length })}
                </Text>
              </>
            )}
          </Group>
        </Stack>
      </Group>

      {grammarPoints.length > 0 && (
        <Stack gap="xs">
          <Text fw={600}>{t('grammarPointsTitle')}</Text>
          <Group gap="xs">
            {grammarPoints.map((gp) => (
              <Badge
                key={gp.id}
                color={JLPT_LEVEL_COLORS[gp.jlpt_level]}
                variant="light"
                component={Link}
                href={`/grammar-points/${gp.slug}`}
                style={{ cursor: 'pointer' }}
              >
                {gp.title}
              </Badge>
            ))}
          </Group>
        </Stack>
      )}

      {source.scenes.length === 0 ? (
        <Text c="dimmed">{t('noScenes')}</Text>
      ) : (
        <SimpleGrid cols={{ base: 1, md: 2, lg: 3, xl: 4 }}>
          {source.scenes.map((scene) => (
            <SceneCard key={scene.id} scene={scene} hideSourceInfo />
          ))}
        </SimpleGrid>
      )}
    </Stack>
  );
}
