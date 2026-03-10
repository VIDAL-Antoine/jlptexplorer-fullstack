import Link from 'next/link';
import { AspectRatio, Badge, Box, Card, Group, Stack, Text, Title } from '@mantine/core';
import { JLPT_LEVEL_COLORS } from '../../constants/jlpt';
import { type SceneWithDetails } from '../../lib/api';
import { YoutubePlayer } from '../YoutubePlayer/YoutubePlayer';

interface SceneCardProps {
  scene: SceneWithDetails;
  currentGrammarPointId?: number;
}

export function SceneCard({ scene, currentGrammarPointId }: SceneCardProps) {
  return (
    <Card shadow="sm" padding="md" radius="md" withBorder>
      <Card.Section mb="md">
        <AspectRatio ratio={16 / 9}>
          <YoutubePlayer
            videoId={scene.youtube_video_id}
            startTime={scene.start_time}
            endTime={scene.end_time}
          />
        </AspectRatio>
      </Card.Section>

      <Group mb="xs" align="center">
        <Title order={4}>{scene.sources.title}</Title>
        {scene.sources.japanese_title && (
          <Text size="sm" c="dimmed">
            {scene.sources.japanese_title}
          </Text>
        )}
        <Badge size="sm" variant="light">
          {scene.sources.type}
        </Badge>
      </Group>

      <Stack gap="xs">
        {scene.transcript_lines.map((line) => {
          const grammarPoints = line.transcript_line_grammar_points;
          const hasGrammar = currentGrammarPointId
            ? grammarPoints.some((tlgp) => tlgp.grammar_point_id === currentGrammarPointId)
            : grammarPoints.length > 0;

          return (
            <Box
              key={line.id}
              p="xs"
              style={{
                borderRadius: 'var(--mantine-radius-sm)',
                ...(hasGrammar && {
                  backgroundColor: 'light-dark(var(--mantine-color-yellow-0), rgba(255, 212, 59, 0.08))',
                  borderLeft: '3px solid var(--mantine-color-yellow-5)',
                }),
              }}
            >
              {line.speaker && (
                <Text size="xs" fw={700} c="dimmed" mb={2}>
                  {line.speaker}
                </Text>
              )}
              <Text size="md" fw={hasGrammar ? 600 : 400} lang="ja">
                {line.text}
              </Text>
              {line.translation && (
                <Text size="sm" c="dimmed" mt={2}>
                  {line.translation}
                </Text>
              )}
              {grammarPoints.length > 0 && (
                <Group gap="xs" mt="xs">
                  {grammarPoints.map((tlgp) =>
                    tlgp.grammar_points ? (
                      <Badge
                        key={tlgp.grammar_point_id}
                        size="xs"
                        color={JLPT_LEVEL_COLORS[tlgp.grammar_points.jlpt_level]}
                        variant={tlgp.grammar_point_id === currentGrammarPointId ? 'filled' : 'light'}
                        component={Link}
                        href={`/grammar-points/${tlgp.grammar_points.slug}`}
                        style={{ cursor: 'pointer' }}
                      >
                        {tlgp.grammar_points.title}
                      </Badge>
                    ) : null
                  )}
                </Group>
              )}
            </Box>
          );
        })}
      </Stack>
    </Card>
  );
}
