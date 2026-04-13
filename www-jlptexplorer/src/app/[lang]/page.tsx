'use client';

import Link from 'next/link';
import { IconBook } from '@tabler/icons-react';
import { useLocale, useTranslations } from 'next-intl';
import { Box, Button, Card, Group, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { SceneCard } from '@/components/features/scenes/SceneCard/SceneCard';
import { JLPT_LEVEL_COLORS, type JlptLevel } from '@/constants/jlpt';
import { useApiData } from '@/hooks/useApiData';
import { api } from '@/lib/api';

const JLPT_LEVELS = Object.keys(JLPT_LEVEL_COLORS) as JlptLevel[];

export default function HomePage() {
  const t = useTranslations('HomePage');
  const locale = useLocale();

  const { data: featuredScene } = useApiData(
    () => api.scenes.list(locale, { limit: 1 }).then((page) => page.scenes[0] ?? null),
    [locale]
  );

  const firstGrammarPointId =
    featuredScene?.transcript_lines[0]?.transcript_line_grammar_points[0]?.grammar_point_id;

  return (
    <Stack gap={48} maw={1024} mx="auto">
      <Stack pt="sm" align="center" ta="center">
        <Title
          order={1}
          fw={900}
          lh={1.1}
          style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
            background:
              'linear-gradient(135deg, var(--mantine-color-indigo-6), var(--mantine-color-violet-5))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          JLPTExplorer
        </Title>
        <Text c="dimmed" fz="lg">
          {t('tagline')}
        </Text>
      </Stack>

      {featuredScene && (
        <Box>
          <Text c="dimmed" mb="xl" ta="center" fz="xl">
            {t('demoExplainer')}
          </Text>
          <SceneCard
            scene={featuredScene}
            currentGrammarPointIds={firstGrammarPointId !== undefined ? [firstGrammarPointId] : []}
            defaultOpened
          />
          <Group justify="flex-end" mt="xs">
            <Link href={`/${locale}/scenes`} style={{ textDecoration: 'none' }}>
              <Button variant="subtle" size="xs">
                {t('allScenes')}
              </Button>
            </Link>
          </Group>
        </Box>
      )}

      <Box>
        <Group justify="space-between" align="center" mb="md">
          <Title order={3}>{t('browseLevels')}</Title>
          <Link href={`/${locale}/grammar-points`} style={{ textDecoration: 'none' }}>
            <Button size="sm" variant="light" leftSection={<IconBook size={14} />}>
              {t('ctaGrammar')}
            </Button>
          </Link>
        </Group>
        <SimpleGrid cols={{ base: 2, sm: 5 }} spacing="sm">
          {JLPT_LEVELS.map((level) => (
            <Link
              key={level}
              href={`/${locale}/grammar-points?jlpt_level=${level}`}
              style={{ textDecoration: 'none' }}
            >
              <Card
                withBorder
                radius="md"
                p="lg"
                style={{ textAlign: 'center', cursor: 'pointer' }}
              >
                <Text fw={800} fz="1.75rem" c={`${JLPT_LEVEL_COLORS[level]}.6`}>
                  {level}
                </Text>
                <Text c="dimmed" fz="xs" mt={4}>
                  {t('levelLabel')}
                </Text>
              </Card>
            </Link>
          ))}
        </SimpleGrid>
      </Box>
    </Stack>
  );
}
