'use client';

import { useEffect, useState } from 'react';
import { SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { SceneCard } from '../components/SceneCard/SceneCard';
import { PageLoader } from '../components/PageLoader/PageLoader';
import { api, type SceneWithDetails } from '../lib/api';

export default function HomePage() {
  const [scenes, setScenes] = useState<SceneWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.scenes.list().then((data) => {
      setScenes(data as SceneWithDetails[]);
      setLoading(false);
    });
  }, []);

  return (
    <Stack mt="xl" gap="lg">
      <div>
        <Title order={1}>JLPTExplorer</Title>
        <Text c="dimmed">
          Learn Japanese grammar in context — JLPT N5 to N1, illustrated by real scenes from video
          games and anime.
        </Text>
      </div>

      {loading ? (
        <PageLoader />
      ) : (
        <SimpleGrid cols={{ base: 1, md: 2 }}>
          {scenes.map((scene) => (
            <SceneCard key={scene.id} scene={scene} />
          ))}
        </SimpleGrid>
      )}
    </Stack>
  );
}
