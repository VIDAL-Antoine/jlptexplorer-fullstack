import { AspectRatio, Badge, Group, Image, Stack, Text, Title } from '@mantine/core';
import { Link } from '@/i18n/navigation';
import { type SourceDetail } from '@/lib/api/types';
import { getSourceTypeIcon } from '@/utils/icons';

type Props = {
  source: SourceDetail;
  displayTitle: string;
  tTypes: (key: string) => string;
  tScenes: (key: string, values?: Record<string, number>) => string;
};

export function SourceHeader({ source, displayTitle, tTypes, tScenes }: Props) {
  const SourceTypeIcon = getSourceTypeIcon(source.type);

  return (
    <Group align="flex-start" gap="xl">
      {source.cover_image_url && (
        <AspectRatio ratio={2 / 3} w={120} style={{ flexShrink: 0 }}>
          <Image src={source.cover_image_url} alt={source.title ?? ''} radius="md" fit="cover" />
        </AspectRatio>
      )}
      <Stack gap="xs">
        <Group align="center" gap="sm">
          <Title order={1}>{displayTitle}</Title>
          <Badge
            variant="light"
            size="lg"
            leftSection={<SourceTypeIcon size={12} />}
            component={Link}
            href={`/sources?type=${source.type}`}
            style={{ cursor: 'pointer' }}
          >
            {tTypes(source.type)}
          </Badge>
        </Group>
        <Group gap="xs">
          <Text size="sm" c="dimmed">
            {tScenes('scenesCount', { count: source.scenes_count })}
          </Text>
          {source.grammar_points.length > 0 && (
            <>
              <Text size="sm" c="dimmed">
                ·
              </Text>
              <Text size="sm" c="dimmed">
                {tScenes('grammarPointsCount', { count: source.grammar_points.length })}
              </Text>
            </>
          )}
        </Group>
      </Stack>
    </Group>
  );
}
