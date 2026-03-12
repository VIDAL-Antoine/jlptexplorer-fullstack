'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
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
  Box,
  Card,
  Center,
  Chip,
  Group,
  Image,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useSettings } from '../../contexts/SettingsContext';
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
  const { sourceTitleLang } = useSettings();

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
              <Chip key={type} value={type} size="xl" tt="capitalize">
                <Group gap={6} wrap="nowrap">
                  <Icon size={14} />
                  {type}
                </Group>
              </Chip>
            );
          })}
        </Group>
      </Chip.Group>

      <SimpleGrid cols={{ base: 3, sm: 3, md: 4, lg: 8 }}>
        {filtered.map((source) => {
          const TypeIcon = getTypeIcon(source.type);
          return (
            <Card
              key={source.id}
              shadow="sm"
              padding="md"
              radius="md"
              withBorder
              component={Link}
              href={`/sources/${source.slug}`}
            >
              <Card.Section style={{ position: 'relative' }}>
                <AspectRatio ratio={2 / 3}>
                  <Image
                    src={source.cover_image_url}
                    alt={source.title}
                    fit="cover"
                    fallbackSrc="https://placehold.co/400x600?text=No+image"
                  />
                </AspectRatio>
                <Box pos="absolute" top={6} right={6} bg="rgba(0,0,0,0.5)" w={28} h={28} bdrs="50%">
                  <Center w="100%" h="100%">
                    <TypeIcon size={16} color="white" />
                  </Center>
                </Box>
              </Card.Section>
              <Center w="100%">
                <Text fw={600} size="md" mt="sm">
                  {sourceTitleLang === 'japanese'
                    ? (source.japanese_title ?? source.title)
                    : source.title}
                </Text>
              </Center>
            </Card>
          );
        })}
      </SimpleGrid>
    </Stack>
  );
}
