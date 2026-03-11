'use client';

import { useEffect, useState } from 'react';
import {
  IconDeviceGamepad2,
  IconDeviceTv,
  IconMovie,
  IconMusic,
  IconSearch,
  IconTag,
} from '@tabler/icons-react';
import {
  AspectRatio,
  Card,
  Chip,
  Group,
  Image,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import Link from 'next/link';
import { api, type Source } from '../../lib/api';
import { PageLoader } from '../PageLoader/PageLoader';

type IconComponent = React.ComponentType<{ size?: number; color?: string }>;

const TYPE_ICONS: Partial<Record<Source['type'], IconComponent>> = {
  game: IconDeviceGamepad2,
  anime: IconDeviceTv,
  series: IconDeviceTv,
  movie: IconMovie,
  music: IconMusic,
};

function getTypeIcon(type: Source['type']): IconComponent {
  return TYPE_ICONS[type] ?? IconTag;
}

export function SourcesList() {
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeType, setActiveType] = useState<string>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.sources.list().then((data) => {
      setSources(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <PageLoader />;

  const availableTypes = Array.from(new Set(sources.map((s) => s.type))) as Source['type'][];
  const filtered = sources.filter((s) => {
    const matchesType = activeType === 'all' || s.type === activeType;
    const q = search.toLowerCase();
    const matchesSearch =
      s.title.toLowerCase().includes(q) || (s.japanese_title ?? '').toLowerCase().includes(q);
    return matchesType && matchesSearch;
  });

  return (
    <Stack mt="xl">
      <TextInput
        placeholder="Search..."
        leftSection={<IconSearch size={16} />}
        value={search}
        size="lg"
        onChange={(e) => setSearch(e.currentTarget.value)}
      />
      <Chip.Group value={activeType} onChange={(v) => setActiveType(v as string)}>
        <Group gap="xs">
          <Chip value="all" size="xl">
            All
          </Chip>
          {availableTypes.map((type) => {
            const Icon = getTypeIcon(type);
            return (
              <Chip key={type} value={type} size="xl" tt="capitalize" icon={<Icon size={14} />}>
                {type}
              </Chip>
            );
          })}
        </Group>
      </Chip.Group>

      <SimpleGrid cols={{ base: 3, sm: 3, md: 4, lg: 8 }}>
        {filtered.map((source) => {
          const TypeIcon = getTypeIcon(source.type);
          return (
            <Card key={source.id} shadow="sm" padding="md" radius="md" withBorder component={Link} href={`/sources/${source.slug}`} style={{ textDecoration: 'none', cursor: 'pointer' }}>
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
                  <Text fw={600} size="md">
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
    </Stack>
  );
}
