import Link from 'next/link';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import {
  Anchor,
  AspectRatio,
  Badge,
  Box,
  Button,
  Card,
  Collapse,
  Group,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { JLPT_LEVEL_COLORS } from '../../constants/jlpt';
import { useSettings } from '../../contexts/SettingsContext';
import { type SceneWithDetails } from '../../lib/api';
import { YoutubePlayer } from '../YoutubePlayer/YoutubePlayer';

interface SceneCardProps {
  scene: SceneWithDetails;
  currentGrammarPointId?: number;
  hideSourceInfo?: boolean;
}

export function SceneCard({
  scene,
  currentGrammarPointId,
  hideSourceInfo = false,
}: SceneCardProps) {
  const [opened, { toggle }] = useDisclosure(false);
  const { speakerNameLang, sourceTitleLang, showDialogueTranslations } = useSettings();

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

      {!hideSourceInfo && (
        <Group mb="xs" align="center">
          <Anchor
            component={Link}
            href={`/sources/${scene.sources.slug}`}
            underline="never"
            c="inherit"
          >
            <Title order={4}>
              {sourceTitleLang === 'japanese'
                ? (scene.sources.japanese_title ?? scene.sources.title)
                : scene.sources.title}
            </Title>
          </Anchor>
          <Badge size="sm" variant="light">
            {scene.sources.type}
          </Badge>
        </Group>
      )}

      <Button
        variant="subtle"
        size="xs"
        onClick={toggle}
        rightSection={opened ? <IconChevronUp size={14} /> : <IconChevronDown size={14} />}
        mb="xs"
      >
        Transcript
      </Button>

      <Collapse in={opened}>
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
                    backgroundColor:
                      'light-dark(var(--mantine-color-yellow-0), rgba(255, 212, 59, 0.08))',
                    borderLeft: '3px solid var(--mantine-color-yellow-5)',
                  }),
                }}
              >
                {line.speakers && (
                  <Text size="xs" fw={700} c="dimmed" mb={2}>
                    {speakerNameLang === 'japanese'
                      ? (line.speakers.name_japanese ?? line.speakers.name_english)
                      : line.speakers.name_english}
                  </Text>
                )}
                <Text size="md" fw={hasGrammar ? 600 : 400} lang="ja">
                  {line.text}
                </Text>
                {showDialogueTranslations && line.translation && (
                  <Text size="sm" c="dimmed" mt={2}>
                    {line.translation}
                  </Text>
                )}
                {grammarPoints.length > 0 && (
                  <Group gap="xs" mt="xs">
                    {[...grammarPoints]
                      .sort((a, b) =>
                        (b.grammar_points?.jlpt_level ?? 'N5').localeCompare(
                          a.grammar_points?.jlpt_level ?? 'N5'
                        )
                      )
                      .map((tlgp) =>
                        tlgp.grammar_points ? (
                          <Badge
                            key={tlgp.grammar_point_id}
                            size="xs"
                            color={JLPT_LEVEL_COLORS[tlgp.grammar_points.jlpt_level]}
                            variant={
                              tlgp.grammar_point_id === currentGrammarPointId ? 'filled' : 'light'
                            }
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
      </Collapse>
    </Card>
  );
}
