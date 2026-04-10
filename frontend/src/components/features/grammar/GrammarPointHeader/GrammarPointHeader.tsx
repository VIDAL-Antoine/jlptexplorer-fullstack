import { Badge, Group, Stack, Text, Title } from '@mantine/core';
import { JLPT_LEVEL_COLORS } from '@/constants/jlpt';
import { Link } from '@/i18n/navigation';
import { type GrammarPointDetail } from '@/lib/api/types';
import { routes } from '@/lib/routes';

type Props = {
  grammarPoint: GrammarPointDetail;
  tScenes: (key: string, values?: Record<string, number>) => string;
};

export function GrammarPointHeader({ grammarPoint, tScenes }: Props) {
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
      <Text mt="xs">
        {grammarPoint.meaning
          ? grammarPoint.meaning.charAt(0).toUpperCase() + grammarPoint.meaning.slice(1)
          : ''}
      </Text>
      {grammarPoint.notes && (
        <Text size="sm" c="dimmed" mt="xs">
          {grammarPoint.notes}
        </Text>
      )}
      <Text size="sm" c="dimmed" mt="xs">
        {tScenes('scenesCount', { count: grammarPoint.scenes_count })}
      </Text>
    </Stack>
  );
}
