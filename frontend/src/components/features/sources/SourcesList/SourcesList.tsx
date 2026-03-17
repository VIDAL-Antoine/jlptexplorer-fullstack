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
  SimpleGrid,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useApiData } from '@/hooks/useApiData';
import { useQueryParam } from '@/hooks/useQueryParam';
import { useSettings } from '@/hooks/useSettings';
import { Link } from '@/i18n/navigation';
import { api, type Source } from '@/lib/api';
import { getLocalizedTitle } from '@/utils/i18n';
import { getSourceTypeIcon } from '@/utils/icons';
import { PageLoader } from '@/components/ui/PageLoader/PageLoader';

const VALID_SOURCE_TYPES = new Set(['game', 'anime', 'movie', 'series', 'music']);

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
  const { sourceTitleLang } = useSettings();

  const { data: sources, loading } = useApiData(() => api.sources.list(locale), [locale]);

  const handleTypeChange = (v: string) => {
    setActiveType(v);
    setParam('type', v === 'all' ? null : v);
  };

  if (loading || !sources) { return <PageLoader />; }

  const availableTypes = Array.from(new Set(sources.map((s) => s.type))) as Source['type'][];
  const filtered = sources.filter((s) => {
    const matchesType = activeType === 'all' || s.type === activeType;
    const q = search.toLowerCase();
    const matchesSearch =
      (s.title ?? '').toLowerCase().includes(q) ||
      (s.japanese_title ?? '').toLowerCase().includes(q);
    return matchesType && matchesSearch;
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
          {availableTypes.map((type) => {
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

      <SimpleGrid cols={{ base: 3, sm: 3, md: 4, lg: 8 }}>
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
              <Card.Section style={{ position: 'relative' }}>
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
    </Stack>
  );
}
