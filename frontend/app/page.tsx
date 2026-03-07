import { Stack, Text, Title } from '@mantine/core';

export default function HomePage() {
  return (
    <Stack mt="xl" gap="sm">
      <Title order={1}>JLPTExplorer</Title>
      <Text c="dimmed">
        Learn Japanese grammar in context — JLPT N5 to N1, illustrated by real clips from video
        games and anime.
      </Text>
    </Stack>
  );
}
