import { IconExternalLink } from '@tabler/icons-react';
import { Anchor, Badge, Box, Group, HoverCard, Stack, Text } from '@mantine/core';
import { JLPT_LEVEL_COLORS } from '@/constants/jlpt';
import { Link } from '@/i18n/navigation';
import { type TranscriptLineGrammarPoint } from '@/lib/api';
import { buildSegments } from '@/utils/annotations';

interface AnnotatedTextProps {
  text: string;
  annotations: TranscriptLineGrammarPoint[];
  currentGrammarPointIds?: number[];
  script?: 'romaji' | 'kana';
}

const JLPT_ORDER = ['N5', 'N4', 'N3', 'N2', 'N1'];

export function AnnotatedText({
  text,
  annotations,
  currentGrammarPointIds,
  script,
}: AnnotatedTextProps) {
  const segments = buildSegments(text, annotations);

  return (
    <>
      {segments.map((segment, i) => {
        if (segment.type === 'plain') {
          return <span key={i}>{segment.text}</span>;
        }

        const activeAnnotations =
          currentGrammarPointIds !== undefined
            ? segment.annotations.filter((a) => currentGrammarPointIds.includes(a.grammar_point_id))
            : [];

        if (activeAnnotations.length === 0) {
          return <span key={i}>{segment.text}</span>;
        }

        const primary = activeAnnotations.reduce((best, a) =>
          JLPT_ORDER.indexOf(a.grammar_points?.jlpt_level ?? 'N5') >
          JLPT_ORDER.indexOf(best.grammar_points?.jlpt_level ?? 'N5')
            ? a
            : best
        );
        const level = primary.grammar_points?.jlpt_level ?? 'N5';
        const color = `var(--mantine-color-${JLPT_LEVEL_COLORS[level]}-6)`;

        const allAnnotations = segment.annotations
          .filter(
            (a, idx, arr) => arr.findIndex((b) => b.grammar_point_id === a.grammar_point_id) === idx
          )
          .sort((a, b) => {
            const aIdx = JLPT_ORDER.indexOf(a.grammar_points?.jlpt_level ?? 'N5');
            const bIdx = JLPT_ORDER.indexOf(b.grammar_points?.jlpt_level ?? 'N5');
            return aIdx - bIdx;
          });

        const coloredSpan = (
          <Box component="span" c={color} style={{ cursor: 'default' }}>
            {segment.text}
          </Box>
        );

        return (
          <HoverCard key={i} position="top" withArrow shadow="sm" openDelay={150} closeDelay={100}>
            <HoverCard.Target>{coloredSpan}</HoverCard.Target>
            <HoverCard.Dropdown p="xs">
              <Stack gap={4}>
                {allAnnotations.map((a) => {
                  const gp = a.grammar_points;
                  if (!gp) {
                    return null;
                  }
                  const gpColor = JLPT_LEVEL_COLORS[gp.jlpt_level];
                  const label = script === 'romaji' ? (gp.romaji ?? gp.title) : gp.title;
                  return (
                    <Group key={a.grammar_point_id} gap={6} wrap="nowrap" align="center">
                      <Badge
                        size="xs"
                        color={gpColor}
                        variant="light"
                        component={Link}
                        href={`/grammar-points?jlpt_level=${gp.jlpt_level}`}
                        style={{ cursor: 'pointer', flexShrink: 0 }}
                      >
                        {gp.jlpt_level}
                      </Badge>
                      <Anchor
                        component={Link}
                        href={`/grammar-points/${gp.slug}`}
                        c={`var(--mantine-color-${gpColor}-6)`}
                        underline="hover"
                        style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                      >
                        <Text size="sm" component="span">
                          {label}
                        </Text>
                        {gp.meaning && (
                          <Text size="xs" c="dimmed" component="span">
                            {' '}
                            — {gp.meaning}
                          </Text>
                        )}
                        <IconExternalLink size={11} style={{ flexShrink: 0 }} />
                      </Anchor>
                    </Group>
                  );
                })}
              </Stack>
            </HoverCard.Dropdown>
          </HoverCard>
        );
      })}
    </>
  );
}
