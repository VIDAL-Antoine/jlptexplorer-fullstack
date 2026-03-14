'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import NotFound from '../../not-found';
import { Badge, Group, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { PageLoader } from '../../../../components/PageLoader/PageLoader';
import { SceneCard } from '../../../../components/SceneCard/SceneCard';
import { JLPT_LEVEL_COLORS } from '../../../../constants/jlpt';
import { useSettings } from '../../../../contexts/SettingsContext';
import { api, type GrammarPointWithScenes } from '../../../../lib/api';

export default function GrammarPointPage() {
  const { slug } = useParams<{ lang: string; slug: string }>();
  const [grammarPoint, setGrammarPoint] = useState<GrammarPointWithScenes | null>(null);
  const [loading, setLoading] = useState(true);

  const t = useTranslations('GrammarPointPage');
  const locale = useLocale();
  const { showGrammarPointRomaji } = useSettings();

  useEffect(() => {
    api.grammarPoints.get(locale, slug).then((data) => {
      setGrammarPoint(data);
    }).catch(() => {
      setGrammarPoint(null);
    }).finally(() => {
      setLoading(false);
    });
  }, [slug, locale]);

  if (loading) return <PageLoader />;
  if (!grammarPoint) return <NotFound />;

  return (
    <Stack mt="xl" gap="lg">
      <div>
        <Group align="center" gap="sm">
          <Title order={1}>{grammarPoint.title}</Title>
          <Badge color={JLPT_LEVEL_COLORS[grammarPoint.jlpt_level]} size="lg">
            {grammarPoint.jlpt_level}
          </Badge>
        </Group>
        {showGrammarPointRomaji && <Text c="dimmed">{grammarPoint.romaji}</Text>}
        <Text mt="xs">{grammarPoint.meaning}</Text>
        {grammarPoint.notes && (
          <Text size="sm" c="dimmed" mt="xs">
            {grammarPoint.notes}
          </Text>
        )}
      </div>

      {grammarPoint.scenes.length === 0 ? (
        <Text c="dimmed">{t('noScenes')}</Text>
      ) : (
        <SimpleGrid cols={{ base: 1, md: 2, lg: 3, xl: 4 }}>
          {grammarPoint.scenes.map((scene) => (
            <SceneCard key={scene.id} scene={scene} currentGrammarPointId={grammarPoint.id} />
          ))}
        </SimpleGrid>
      )}
    </Stack>
  );
}
