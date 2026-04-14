'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Badge, Card, Group, Text, Title } from '@mantine/core';
import { JLPT_LEVEL_COLORS } from '@/constants/jlpt';
import { Link } from '@/i18n/navigation';
import { type GrammarPoint } from '@/lib/api';
import { routes } from '@/lib/routes';
import { getLocalizedMeaning } from '@/utils/i18n';

interface GrammarPointCardProps {
  gp: GrammarPoint;
  hasScenes: boolean;
}

export function GrammarPointCard({ gp, hasScenes }: GrammarPointCardProps) {
  const t = useTranslations('GrammarPointsList');
  const locale = useLocale();
  const meaning = getLocalizedMeaning(gp.translations, locale);
  const displayMeaning = meaning ? meaning.charAt(0).toUpperCase() + meaning.slice(1) : '';

  if (hasScenes) {
    return (
      <Card
        shadow="sm"
        padding="md"
        radius="md"
        withBorder
        component={Link}
        href={routes.grammarPoints.detail(gp.slug)}
        td="none"
      >
        <Group justify="space-between" wrap="nowrap" align="flex-start">
          <Title order={1} flex={1}>
            {gp.title}
          </Title>
          <Badge color={JLPT_LEVEL_COLORS[gp.jlpt_level]}>{gp.jlpt_level}</Badge>
        </Group>
        <Text size="md" c="dimmed">
          {gp.romaji}
        </Text>
        <Text size="md" mt="xs">
          {displayMeaning}
        </Text>
      </Card>
    );
  }

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder opacity={0.45}>
      <Group justify="space-between" wrap="nowrap" align="flex-start">
        <Title order={1} flex={1}>
          {gp.title}
        </Title>
        <Badge color={JLPT_LEVEL_COLORS[gp.jlpt_level]}>{gp.jlpt_level}</Badge>
      </Group>
      <Text size="md" c="dimmed">
        {gp.romaji}
      </Text>
      <Text size="md" mt="xs">
        {displayMeaning}
      </Text>
      <Badge mt="xs" color="gray" variant="light">
        {t('comingSoon')}
      </Badge>
    </Card>
  );
}
