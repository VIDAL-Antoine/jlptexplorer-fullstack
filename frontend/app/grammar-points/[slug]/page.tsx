'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Badge, Group, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { PageLoader } from '../../../components/PageLoader/PageLoader';
import { SceneCard } from '../../../components/SceneCard/SceneCard';
import { JLPT_LEVEL_COLORS } from '../../../constants/jlpt';
import { useSettings } from '../../../contexts/SettingsContext';
import { api, type GrammarPointWithScenes } from '../../../lib/api';

export default function GrammarPointPage() {
  const { slug } = useParams<{ slug: string }>();
  const [grammarPoint, setGrammarPoint] = useState<GrammarPointWithScenes | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.grammarPoints.get(slug).then((data) => {
      setGrammarPoint(data);
      setLoading(false);
    });
  }, [slug]);

  const { showGrammarPointRomaji } = useSettings();

  if (loading) return <PageLoader />;
  if (!grammarPoint) return <Text mt="xl">Grammar point not found.</Text>;

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
        <Text c="dimmed">No scenes yet for this grammar point.</Text>
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
