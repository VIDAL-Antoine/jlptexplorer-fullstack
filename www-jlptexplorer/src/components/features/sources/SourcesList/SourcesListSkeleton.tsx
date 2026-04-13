import { AspectRatio, Card, Group, SimpleGrid, Skeleton, Stack } from '@mantine/core';

export function SourcesListSkeleton() {
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
