'use client';

import { useEffect, useState } from 'react';
import { IconDeviceGamepad2, IconDeviceTv, IconMovie, IconMusic } from '@tabler/icons-react';
import { AspectRatio, Card, Group, Image, SimpleGrid, Text } from '@mantine/core';
import { api, type Source } from '../../lib/api';
import { PageLoader } from '../PageLoader/PageLoader';

const TYPE_ICONS: Record<Source['type'], React.ComponentType<{ size?: number; color?: string }>> = {
  game: IconDeviceGamepad2,
  anime: IconDeviceTv,
  series: IconDeviceTv,
  movie: IconMovie,
  music: IconMusic,
};

export function SourcesList() {
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    api.sources.list().then((data) => {
      setSources(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <PageLoader />;

  return (
    <SimpleGrid cols={{ base: 3, sm: 3, md: 4, lg: 8 }} mt="xl">
      {sources.map((source) => {
        const TypeIcon = TYPE_ICONS[source.type];
        return (
          <Card key={source.id} shadow="sm" padding="md" radius="md" withBorder>
            <Card.Section>
              <AspectRatio ratio={2 / 3}>
                <Image
                  src={source.cover_image_url}
                  alt={source.title}
                  fit="cover"
                  fallbackSrc="https://placehold.co/400x600?text=No+image"
                />
              </AspectRatio>
            </Card.Section>
            <Group justify="space-between" mt="sm">
              <div>
                <Text fw={600} size="sm">
                  {source.title}
                </Text>
                {source.japanese_title && (
                  <Text size="xs" c="dimmed">
                    {source.japanese_title}
                  </Text>
                )}
              </div>
              <TypeIcon size={20} color="gray" />
            </Group>
          </Card>
        );
      })}
    </SimpleGrid>
  );
}
