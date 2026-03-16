import {
  IconChevronDown,
  IconChevronUp,
  IconDeviceGamepad2,
  IconDeviceTv,
  IconMovie,
  IconMusic,
  IconTag,
} from '@tabler/icons-react';
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
import { useRef } from 'react';
import { JLPT_LEVEL_COLORS } from '../../../../constants/jlpt';
import { useSettings } from '../../../../contexts/SettingsContext';
import { Link } from '../../../../i18n/navigation';
import { type SceneWithDetails } from '../../../../lib/api';
import { AnnotatedText } from '../../grammar/AnnotatedText/AnnotatedText';
import { YoutubePlayer, type YoutubePlayerHandle } from '../YoutubePlayer/YoutubePlayer';

type SourceType = SceneWithDetails['sources']['type'];
type IconComponent = React.ComponentType<{ size?: number; color?: string }>;

const SOURCE_TYPE_ICONS: Partial<Record<SourceType, IconComponent>> = {
  game: IconDeviceGamepad2,
  anime: IconDeviceTv,
  series: IconDeviceTv,
  movie: IconMovie,
  music: IconMusic,
};

function getSourceTypeIcon(type: SourceType): IconComponent {
  return SOURCE_TYPE_ICONS[type] ?? IconTag;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

interface SceneCardProps {
  scene: SceneWithDetails;
  currentGrammarPointIds?: number[];
  hideSourceInfo?: boolean;
}

export function SceneCard({
  scene,
  currentGrammarPointIds,
  hideSourceInfo = false,
}: SceneCardProps) {
  const t = useTranslations('SceneCard');
  const [opened, { toggle }] = useDisclosure(false);
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
            <Title order={4}>
              {sourceTitleLang === 'japanese'
                ? (scene.sources.japanese_title ?? scene.sources.title)
                : scene.sources.title}
            </Title>
          </Anchor>
          <Anchor
            component={Link}
            href={`/sources?type=${scene.sources.type}`}
            mt={4}
            style={{ flexShrink: 0, lineHeight: 0 }}
          >
            <SourceTypeIcon size={16} color="gray" />
          </Anchor>
        </Group>
      )}

      <Button
        variant="subtle"
        size="xs"
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
                style={{
                  borderRadius: 'var(--mantine-radius-sm)',
                  ...(hasGrammar && {
                    backgroundColor:
                      'light-dark(var(--mantine-color-yellow-0), rgba(255, 212, 59, 0.08))',
                    borderLeft: '3px solid var(--mantine-color-yellow-5)',
                  }),
                }}
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
                      {speakerNameLang === 'japanese'
                        ? (line.speakers.name_japanese ?? line.speakers.name)
                        : line.speakers.name}
                    </Text>
                  )}
                </Group>
                <Text size="md" fw={hasGrammar ? 600 : 400} lang="ja">
                  <AnnotatedText
                    text={line.text}
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
                    {[...grammarPoints]
                      .filter((tlgp, i, arr) => arr.findIndex((x) => x.grammar_point_id === tlgp.grammar_point_id) === i)
                      .sort((a, b) =>
                        (b.grammar_points?.jlpt_level ?? 'N5').localeCompare(
                          a.grammar_points?.jlpt_level ?? 'N5'
                        )
                      )
                      .map((tlgp) =>
                        tlgp.grammar_points ? (
                          <Badge
                            key={tlgp.id}
                            size="xs"
                            color={JLPT_LEVEL_COLORS[tlgp.grammar_points.jlpt_level]}
                            variant={
                              currentGrammarPointIds?.includes(tlgp.grammar_point_id) ? 'filled' : 'light'
                            }
                            tt="lowercase"
                            component={Link}
                            href={`/grammar-points/${tlgp.grammar_points.slug}`}
                            style={{ cursor: 'pointer' }}
                          >
                            {grammarPointTranscriptScript === 'romaji'
                              ? (tlgp.grammar_points.romaji ?? tlgp.grammar_points.title)
                              : tlgp.grammar_points.title}
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
