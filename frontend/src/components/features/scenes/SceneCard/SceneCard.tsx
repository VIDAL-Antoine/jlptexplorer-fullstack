import { useRef } from 'react';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
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
  Tooltip,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { AnnotatedText } from '@/components/features/grammar/AnnotatedText/AnnotatedText';
import {
  YoutubePlayer,
  type YoutubePlayerHandle,
} from '@/components/features/scenes/YoutubePlayer/YoutubePlayer';
import { JLPT_LEVEL_COLORS } from '@/constants/jlpt';
import { useSettings } from '@/contexts/SettingsContext';
import { Link } from '@/i18n/navigation';
import { type SceneWithDetails } from '@/lib/api';
import { deduplicateAndSortGrammarPoints } from '@/utils/grammarPoints';
import { getLocalizedName, getLocalizedTitle } from '@/utils/i18n';
import { getSourceTypeIcon } from '@/utils/icons';
import { formatTime } from '@/utils/time';

interface SceneCardProps {
  scene: SceneWithDetails;
  currentGrammarPointIds?: number[];
  hideSourceInfo?: boolean;
  defaultOpened?: boolean;
}

export function SceneCard({
  scene,
  currentGrammarPointIds,
  hideSourceInfo = false,
  defaultOpened = false,
}: SceneCardProps) {
  const t = useTranslations('SceneCard');
  const [opened, { toggle }] = useDisclosure(defaultOpened);
  const {
    speakerNameLang,
    sourceTitleLang,
    showDialogueTranslations,
    grammarPointTranscriptScript,
  } = useSettings();

  const SourceTypeIcon = getSourceTypeIcon(scene.sources.type);
  const playerRef = useRef<YoutubePlayerHandle>(null);

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder>
      <Card.Section mb="md">
        <AspectRatio ratio={16 / 9}>
          <YoutubePlayer
            ref={playerRef}
            videoId={scene.youtube_video_id}
            startTime={scene.start_time}
            endTime={scene.end_time}
          />
        </AspectRatio>
      </Card.Section>

      {!hideSourceInfo && (
        <Group mb="xs" align="flex-start" justify="space-between" wrap="nowrap">
          <Anchor
            component={Link}
            href={`/sources/${scene.sources.slug}`}
            underline="never"
            c="inherit"
          >
            <Title order={4}>{getLocalizedTitle(scene.sources, sourceTitleLang)}</Title>
          </Anchor>
          <Anchor
            component={Link}
            href={`/sources?type=${scene.sources.type}`}
            mt={4}
            lh={0}
            style={{ flexShrink: 0 }}
          >
            <SourceTypeIcon size={16} color="gray" />
          </Anchor>
        </Group>
      )}

      <Button
        variant="subtle"
        onClick={toggle}
        rightSection={opened ? <IconChevronUp size={14} /> : <IconChevronDown size={14} />}
        mb="xs"
      >
        {t('transcript')}
      </Button>

      <Collapse in={opened}>
        <Stack gap="xs">
          {scene.transcript_lines.map((line) => {
            const grammarPoints = line.transcript_line_grammar_points;
            const hasGrammar = currentGrammarPointIds
              ? grammarPoints.some((tlgp) => currentGrammarPointIds.includes(tlgp.grammar_point_id))
              : grammarPoints.length > 0;

            return (
              <Box
                key={line.id}
                p="xs"
                bdrs="var(--mantine-radius-sm)"
                bg={
                  hasGrammar
                    ? 'light-dark(var(--mantine-color-yellow-0), rgba(255, 212, 59, 0.08))'
                    : undefined
                }
                style={
                  hasGrammar ? { borderLeft: '3px solid var(--mantine-color-yellow-5)' } : undefined
                }
              >
                <Group gap="xs" align="baseline" mb={2}>
                  {line.start_time !== null && line.start_time !== undefined && (
                    <Tooltip label={t('seekTo', { time: formatTime(line.start_time) })} withArrow>
                      <Text
                        size="xs"
                        c="dimmed"
                        ff="monospace"
                        style={{ cursor: 'pointer', flexShrink: 0 }}
                        onClick={() => playerRef.current?.seekTo(line.start_time!)}
                      >
                        {formatTime(line.start_time)}
                      </Text>
                    </Tooltip>
                  )}
                  {line.speakers && (
                    <Text size="xs" fw={700} c="dimmed">
                      {getLocalizedName(line.speakers, speakerNameLang)}
                    </Text>
                  )}
                </Group>
                <Text size="md" fw={hasGrammar ? 600 : 400} lang="ja">
                  <AnnotatedText
                    text={line.japanese_text}
                    annotations={line.transcript_line_grammar_points}
                    currentGrammarPointIds={currentGrammarPointIds}
                    script={grammarPointTranscriptScript}
                  />
                </Text>
                {showDialogueTranslations && line.translation && (
                  <Text size="sm" c="dimmed" mt={2}>
                    {line.translation}
                  </Text>
                )}
                {grammarPoints.length > 0 && (
                  <Group gap="xs" mt="xs">
                    {(() => {
                      const currentSpans = currentGrammarPointIds
                        ? new Set(
                            grammarPoints
                              .filter(
                                (t) =>
                                  currentGrammarPointIds.includes(t.grammar_point_id) &&
                                  t.start_index !== null &&
                                  t.end_index !== null
                              )
                              .map((t) => `${t.start_index}:${t.end_index}`)
                          )
                        : new Set<string>();

                      const siblingIds = new Set(
                        grammarPoints
                          .filter(
                            (t) =>
                              !currentGrammarPointIds?.includes(t.grammar_point_id) &&
                              t.start_index !== null &&
                              t.end_index !== null &&
                              currentSpans.has(`${t.start_index}:${t.end_index}`)
                          )
                          .map((t) => t.grammar_point_id)
                      );

                      return deduplicateAndSortGrammarPoints(grammarPoints).map((tlgp) => {
                        if (!tlgp.grammar_points) { return null; }
                        const isPrimary = currentGrammarPointIds?.includes(tlgp.grammar_point_id);
                        const isSibling = !isPrimary && siblingIds.has(tlgp.grammar_point_id);
                        const variant = isPrimary ? 'filled' : isSibling ? 'outline' : 'light';

                        return (
                          <Badge
                            key={tlgp.id}
                            size="xs"
                            color={JLPT_LEVEL_COLORS[tlgp.grammar_points.jlpt_level]}
                            variant={variant}
                            tt="lowercase"
                            component={Link}
                            href={`/grammar-points/${tlgp.grammar_points.slug}`}
                            style={{ cursor: 'pointer' }}
                          >
                            {grammarPointTranscriptScript === 'romaji'
                              ? (tlgp.grammar_points.romaji ?? tlgp.grammar_points.title)
                              : tlgp.grammar_points.title}
                          </Badge>
                        );
                      });
                    })()}
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
