import { AspectRatio, Badge, Group, Image, Stack, Text, Title } from '@mantine/core';
import { Link } from '@/i18n/navigation';
import { type Source } from '@/lib/api/types';
import { routes } from '@/lib/routes';
import { getSourceTypeIcon } from '@/utils/icons';

type Props = {
  source: Source;
  displayTitle: string;
  scenesCount: number;
  grammarPointsCount: number;
  tTypes: (key: string) => string;
  tScenes: (key: string, values?: Record<string, number>) => string;
};

export function SourceHeader({
  source,
  displayTitle,
  scenesCount,
  grammarPointsCount,
  tTypes,
  tScenes,
}: Props) {
  const SourceTypeIcon = getSourceTypeIcon(source.type);

  return (
    <Group align="flex-start" gap="xl">
      {source.cover_image_url && (
        <AspectRatio ratio={2 / 3} w={120} style={{ flexShrink: 0 }}>
          <Image src={source.cover_image_url} alt={displayTitle} radius="md" fit="cover" />
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
            href={routes.sources.list(source.type)}
            style={{ cursor: 'pointer' }}
          >
            {tTypes(source.type)}
          </Badge>
        </Group>
        <Group gap="xs">
          <Text size="sm" c="dimmed">
            {tScenes('scenesCount', { count: scenesCount })}
          </Text>
          {grammarPointsCount > 0 && (
            <>
              <Text size="sm" c="dimmed">
                ·
              </Text>
              <Text size="sm" c="dimmed">
                {tScenes('grammarPointsCount', { count: grammarPointsCount })}
              </Text>
            </>
          )}
        </Group>
      </Stack>
    </Group>
  );
}
