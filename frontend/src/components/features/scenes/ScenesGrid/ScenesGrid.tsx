import { Group, Pagination, SimpleGrid, Skeleton, Stack, Text } from '@mantine/core';
import { SceneCard } from '@/components/features/scenes/SceneCard/SceneCard';
import type { SceneWithDetails } from '@/lib/api';

type Props = {
  scenes: SceneWithDetails[] | null;
  totalPages: number;
  page: number;
  onPageChange: (page: number) => void;
  loading: boolean;
  pageSize: number;
  noScenesMessage: string;
  currentGrammarPointIds?: number[];
  hideSourceInfo?: boolean;
};

export function ScenesGrid({
  scenes,
  totalPages,
  page,
  onPageChange,
  loading,
  pageSize,
  noScenesMessage,
  currentGrammarPointIds,
  hideSourceInfo,
}: Props) {
  if (!scenes && loading) {
    return (
      <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }}>
        {Array.from({ length: pageSize }).map((_, i) => (
          <Skeleton key={i} height={280} radius="md" />
        ))}
      </SimpleGrid>
    );
  }

  if (!scenes || scenes.length === 0) {
    return <Text c="dimmed">{noScenesMessage}</Text>;
  }

  return (
    <Stack gap="lg" opacity={loading ? 0.5 : 1} style={{ transition: 'opacity 0.15s ease' }}>
      <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }}>
        {scenes.map((scene) => (
          <SceneCard
            key={scene.id}
            scene={scene}
            currentGrammarPointIds={currentGrammarPointIds}
            hideSourceInfo={hideSourceInfo}
          />
        ))}
      </SimpleGrid>
      {totalPages > 1 && (
        <Group justify="center">
          <Pagination total={totalPages} value={page} onChange={onPageChange} />
        </Group>
      )}
    </Stack>
  );
}
