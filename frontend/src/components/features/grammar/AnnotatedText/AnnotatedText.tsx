import { Box } from '@mantine/core';
import { JLPT_LEVEL_COLORS } from '@/constants/jlpt';
import { type TranscriptLineGrammarPoint } from '@/lib/api';
import { buildSegments } from '@/utils/annotations';

interface AnnotatedTextProps {
  text: string;
  annotations: TranscriptLineGrammarPoint[];
  currentGrammarPointIds?: number[];
  script?: 'romaji' | 'kana';
}

export function AnnotatedText({ text, annotations, currentGrammarPointIds }: AnnotatedTextProps) {
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

        return (
          <Box key={i} component="span" c={color}>
            {segment.text}
          </Box>
        );
      })}
    </>
  );
}
