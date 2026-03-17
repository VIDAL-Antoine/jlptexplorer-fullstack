import { Box, Tooltip } from '@mantine/core';
import { JLPT_LEVEL_COLORS } from '@/constants/jlpt';
import { type TranscriptLineGrammarPoint } from '@/lib/api';
import { buildSegments } from '@/utils/annotations';

interface AnnotatedTextProps {
  text: string;
  annotations: TranscriptLineGrammarPoint[];
  currentGrammarPointIds?: number[];
  script?: 'romaji' | 'kana';
}

export function AnnotatedText({
  text,
  annotations,
  currentGrammarPointIds,
  script = 'kana',
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

        const primary = activeAnnotations[0];
        const level = primary.grammar_points?.jlpt_level ?? 'N5';
        const color = `var(--mantine-color-${JLPT_LEVEL_COLORS[level]}-6)`;

        const lines = activeAnnotations
          .map((a) =>
            script === 'romaji'
              ? (a.grammar_points?.romaji ?? a.grammar_points?.title)
              : a.grammar_points?.title
          )
          .filter(Boolean);

        const label =
          lines.length > 1 ? (
            <span style={{ whiteSpace: 'pre-line' }}>{lines.join('\n')}</span>
          ) : (
            lines[0]
          );

        return (
          <Tooltip key={i} label={label} withArrow>
            <Box
              component="span"
              style={{
                textDecoration: 'underline',
                textDecorationColor: color,
                textDecorationThickness: '1.5px',
                textUnderlineOffset: '3px',
                cursor: 'default',
              }}
            >
              {segment.text}
            </Box>
          </Tooltip>
        );
      })}
    </>
  );
}
