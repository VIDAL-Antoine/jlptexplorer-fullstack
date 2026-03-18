import Link from 'next/link';
import { IconBook, IconDeviceGamepad2, IconPlayerPlay, IconSparkles } from '@tabler/icons-react';
import { useLocale, useTranslations } from 'next-intl';
import { Box, Button, Card, Group, SimpleGrid, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import { JLPT_LEVEL_COLORS, type JlptLevel } from '@/constants/jlpt';

const JLPT_LEVELS = Object.keys(JLPT_LEVEL_COLORS) as JlptLevel[];

export default function HomePage() {
  const t = useTranslations('HomePage');
  const locale = useLocale();

  return (
    <Stack gap={48}>
      {/* Hero */}
      <Box pt="xl">
        <Title
          order={1}
          fw={900}
          lh={1.1}
          mb="md"
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
        <Text c="dimmed" fz="lg" mb="xl" maw={520}>
          {t('tagline')}
        </Text>
        <Group>
          <Link href={`/${locale}/grammar-points`} style={{ textDecoration: 'none' }}>
            <Button size="md" leftSection={<IconBook size={16} />}>
              {t('ctaGrammar')}
            </Button>
          </Link>
          <Link href={`/${locale}/sources`} style={{ textDecoration: 'none' }}>
            <Button size="md" variant="outline" leftSection={<IconPlayerPlay size={16} />}>
              {t('ctaSources')}
            </Button>
          </Link>
        </Group>
      </Box>

      {/* Feature highlights */}
      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
        <Card withBorder radius="md" p="lg">
          <ThemeIcon variant="light" color="indigo" size={48} radius="md" mb="md">
            <IconSparkles size={24} />
          </ThemeIcon>
          <Title order={4}>{t('feature1Title')}</Title>
          <Text c="dimmed" fz="sm" mt="xs">
            {t('feature1Desc')}
          </Text>
        </Card>
        <Card withBorder radius="md" p="lg">
          <ThemeIcon variant="light" color="violet" size={48} radius="md" mb="md">
            <IconBook size={24} />
          </ThemeIcon>
          <Title order={4}>{t('feature2Title')}</Title>
          <Text c="dimmed" fz="sm" mt="xs">
            {t('feature2Desc')}
          </Text>
        </Card>
        <Card withBorder radius="md" p="lg">
          <ThemeIcon variant="light" color="grape" size={48} radius="md" mb="md">
            <IconDeviceGamepad2 size={24} />
          </ThemeIcon>
          <Title order={4}>{t('feature3Title')}</Title>
          <Text c="dimmed" fz="sm" mt="xs">
            {t('feature3Desc')}
          </Text>
        </Card>
      </SimpleGrid>

      {/* Browse by JLPT level */}
      <Box>
        <Title order={3} mb="md">
          {t('browseLevels')}
        </Title>
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
