'use client';

import { useLocale } from 'next-intl';
import { Badge, Group, Stack, Text, Title } from '@mantine/core';
import { JLPT_LEVEL_COLORS } from '@/constants/jlpt';
import { Link } from '@/i18n/navigation';
import { type GrammarPoint } from '@/lib/api/types';
import { routes } from '@/lib/routes';
import { getLocalizedMeaning } from '@/utils/i18n';

type Props = {
  grammarPoint: GrammarPoint;
  scenesCount: number;
  tScenes: (key: string, values?: Record<string, number>) => string;
};

export function GrammarPointHeader({ grammarPoint, scenesCount, tScenes }: Props) {
  const locale = useLocale();
  const meaning = getLocalizedMeaning(grammarPoint.translations, locale);
  const notes =
    grammarPoint.translations.find((t) => t.locale === locale)?.notes ??
    grammarPoint.translations[0]?.notes ??
    null;

  return (
    <Stack gap={0}>
      <Group align="center" gap="sm">
        <Title order={1}>{grammarPoint.title}</Title>
        <Badge
          color={JLPT_LEVEL_COLORS[grammarPoint.jlpt_level]}
          size="lg"
          component={Link}
          href={routes.grammarPoints.list(grammarPoint.jlpt_level)}
          style={{ cursor: 'pointer' }}
        >
          {grammarPoint.jlpt_level}
        </Badge>
      </Group>
      <Text c="dimmed">{grammarPoint.romaji}</Text>
      <Text mt="xs">{meaning ? meaning.charAt(0).toUpperCase() + meaning.slice(1) : ''}</Text>
      {notes && (
        <Text size="sm" c="dimmed" mt="xs">
          {notes}
        </Text>
      )}
      <Text size="sm" c="dimmed" mt="xs">
        {tScenes('scenesCount', { count: scenesCount })}
      </Text>
    </Stack>
  );
}
