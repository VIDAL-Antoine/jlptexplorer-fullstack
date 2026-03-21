'use client';

import { useState } from 'react';
import { IconSearch } from '@tabler/icons-react';
import { useLocale, useTranslations } from 'next-intl';
import {
  AspectRatio,
  Box,
  Card,
  Center,
  Chip,
  Group,
  Image,
  Pagination,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useSettings } from '@/contexts/SettingsContext';
import { useApiData } from '@/hooks/useApiData';
import { useQueryParam } from '@/hooks/useQueryParam';
import { Link } from '@/i18n/navigation';
import { api } from '@/lib/api';
import { getLocalizedTitle } from '@/utils/i18n';
import { getSourceTypeIcon } from '@/utils/icons';

const VALID_SOURCE_TYPES = new Set(['game', 'anime', 'movie', 'series', 'music']);
const PAGE_SIZE = 24;

export function SourcesList() {
  const t = useTranslations('SourcesList');
  const tTypes = useTranslations('SourceTypes');
  const locale = useLocale();
  const { setParam, searchParams } = useQueryParam();
  const rawType = searchParams.get('type');
  const [activeType, setActiveType] = useState<string>(
    rawType && VALID_SOURCE_TYPES.has(rawType) ? rawType : 'all'
  );
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const { sourceTitleLang } = useSettings();

  const handleTypeChange = (v: string) => {
    setActiveType(v);
    setPage(1);
    setParam('type', v === 'all' ? null : v);
  };

  const { data, loading } = useApiData(
    () =>
      api.sources.list(locale, {
        type: activeType !== 'all' ? activeType : undefined,
        page,
        limit: PAGE_SIZE,
      }),
    [locale, activeType, page]
  );

  if (!data) {
    return (
      <Stack mt="xl">
        <Skeleton height={46} radius="sm" />
        <Group gap="xs">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} height={38} width={80} radius="xl" />
          ))}
        </Group>
        <SimpleGrid cols={{ base: 3, sm: 3, md: 4, lg: 8 }}>
          {Array.from({ length: 16 }).map((_, i) => (
            <Card key={i} shadow="sm" padding="md" radius="md" withBorder>
              <Card.Section>
                <AspectRatio ratio={2 / 3}>
                  <Skeleton height="100%" radius={0} />
                </AspectRatio>
              </Card.Section>
              <Skeleton height={14} mt="sm" radius="sm" />
            </Card>
          ))}
        </SimpleGrid>
      </Stack>
    );
  }

  const filtered = data.sources.filter((s) => {
    const q = search.toLowerCase();
    return (
      (s.title ?? '').toLowerCase().includes(q) ||
      (s.japanese_title ?? '').toLowerCase().includes(q)
    );
  });

  return (
    <Stack mt="xl">
      <TextInput
        placeholder={t('searchPlaceholder')}
        leftSection={<IconSearch size={16} />}
        value={search}
        size="lg"
        onChange={(e) => setSearch(e.currentTarget.value)}
      />
      <Chip.Group value={activeType} onChange={(v) => handleTypeChange(v as string)}>
        <Group gap="xs">
          <Chip value="all" size="xl">
            {t('all')}
          </Chip>
          {data.available_types.map((type) => {
            const Icon = getSourceTypeIcon(type);
            return (
              <Chip key={type} value={type} size="xl">
                <Group gap={6} wrap="nowrap">
                  <Icon size={14} />
                  {tTypes(type)}
                </Group>
              </Chip>
            );
          })}
        </Group>
      </Chip.Group>

      <SimpleGrid
        cols={{ base: 3, sm: 3, md: 4, lg: 8 }}
        style={{ opacity: loading ? 0.6 : 1, transition: 'opacity 0.15s' }}
      >
        {filtered.map((source) => {
          const TypeIcon = getSourceTypeIcon(source.type);
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
              <Card.Section pos="relative">
                <AspectRatio ratio={2 / 3}>
                  <Image
                    src={source.cover_image_url}
                    alt={source.title ?? ''}
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
                  {getLocalizedTitle(source, sourceTitleLang)}
                </Text>
              </Center>
            </Card>
          );
        })}
      </SimpleGrid>

      {data.totalPages > 1 && (
        <Center>
          <Pagination total={data.totalPages} value={page} onChange={setPage} />
        </Center>
      )}
    </Stack>
  );
}
