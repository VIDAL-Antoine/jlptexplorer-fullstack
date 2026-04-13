import { Card, Group, SimpleGrid, Skeleton } from '@mantine/core';

export function GrammarPointsListSkeleton() {
  return (
    <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }}>
      {Array.from({ length: 24 }).map((_, i) => (
        <Card key={i} shadow="sm" padding="md" radius="md" withBorder>
          <Group justify="space-between" wrap="nowrap" align="flex-start" mb="xs">
            <Skeleton height={28} width="60%" radius="sm" />
            <Skeleton height={20} width={40} radius="xl" />
          </Group>
          <Skeleton height={14} width="40%" radius="sm" mb="xs" />
          <Skeleton height={14} width="80%" radius="sm" />
        </Card>
      ))}
    </SimpleGrid>
  );
}
