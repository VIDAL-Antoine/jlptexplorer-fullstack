import { AspectRatio, Badge, Box, Card, Group, Stack, Text, Title } from '@mantine/core';
import { JLPT_LEVEL_COLORS } from '../../constants/jlpt';
import { type SceneWithDetails } from '../../lib/api';
import { YoutubePlayer } from '../YoutubePlayer/YoutubePlayer';
import classes from './SceneCard.module.css';

interface SceneCardProps {
  scene: SceneWithDetails;
}

export function SceneCard({ scene }: SceneCardProps) {
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
          const hasGrammar = grammarPoints.length > 0;

          return (
            <Box
              key={line.id}
              className={hasGrammar ? classes.highlightedLine : classes.line}
              p="xs"
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
              {hasGrammar && (
                <Group gap="xs" mt="xs">
                  {grammarPoints.map((tlgp) => (
                    <Badge
                      key={tlgp.grammar_point_id}
                      size="xs"
                      color={JLPT_LEVEL_COLORS[tlgp.grammar_points.jlpt_level]}
                      variant="light"
                    >
                      {tlgp.grammar_points.title}
                    </Badge>
                  ))}
                </Group>
              )}
            </Box>
          );
        })}
      </Stack>
    </Card>
  );
}
