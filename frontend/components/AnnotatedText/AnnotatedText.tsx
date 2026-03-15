import { Tooltip } from '@mantine/core';
import { JLPT_LEVEL_COLORS } from '../../constants/jlpt';
import { type TranscriptLineGrammarPoint } from '../../lib/api';

interface AnnotatedTextProps {
  text: string;
  annotations: TranscriptLineGrammarPoint[];
  currentGrammarPointIds?: number[];
  script?: 'romaji' | 'kana';
}

type Segment =
  | { type: 'plain'; text: string }
  | { type: 'annotated'; text: string; annotations: TranscriptLineGrammarPoint[] };

function buildSegments(text: string, annotations: TranscriptLineGrammarPoint[], currentGrammarPointIds?: number[]): Segment[] {
  const withSpans = annotations.filter(
    (a) =>
      a.start_index !== null &&
      a.end_index !== null &&
      (currentGrammarPointIds === undefined || currentGrammarPointIds.includes(a.grammar_point_id))
  );

  if (!withSpans.length) return [{ type: 'plain', text }];

  // Group overlapping annotations by their span
  const spanMap = new Map<string, TranscriptLineGrammarPoint[]>();
  for (const annotation of withSpans) {
    const key = `${annotation.start_index}:${annotation.end_index}`;
    if (!spanMap.has(key)) spanMap.set(key, []);
    spanMap.get(key)!.push(annotation);
  }

  // Collect unique spans sorted by start_index
  const spans = Array.from(spanMap.entries())
    .map(([key, anns]) => {
      const [start, end] = key.split(':').map(Number);
      return { start, end, annotations: anns };
    })
    .sort((a, b) => a.start - b.start);

  const segments: Segment[] = [];
  let cursor = 0;

  for (const span of spans) {
    if (span.start > cursor) {
      segments.push({ type: 'plain', text: text.slice(cursor, span.start) });
    }
    segments.push({
      type: 'annotated',
      text: text.slice(span.start, span.end),
      annotations: span.annotations,
    });
    cursor = span.end;
  }

  if (cursor < text.length) {
    segments.push({ type: 'plain', text: text.slice(cursor) });
  }

  return segments;
}

export function AnnotatedText({
  text,
  annotations,
  currentGrammarPointIds,
  script = 'kana',
}: AnnotatedTextProps) {
  const segments = buildSegments(text, annotations, currentGrammarPointIds);

  return (
    <>
      {segments.map((segment, i) => {
        if (segment.type === 'plain') {
          return <span key={i}>{segment.text}</span>;
        }

        const primary = segment.annotations[0];
        const level = primary.grammar_points?.jlpt_level ?? 'N5';
        const color = `var(--mantine-color-${JLPT_LEVEL_COLORS[level]}-6)`;

        const label = segment.annotations
          .map((a) =>
            script === 'romaji'
              ? (a.grammar_points?.romaji ?? a.grammar_points?.title)
              : a.grammar_points?.title
          )
          .filter(Boolean)
          .join(' · ');

        return (
          <Tooltip key={i} label={label} withArrow>
            <span
              style={{
                borderBottom: `2px solid ${color}`,
                paddingBottom: 1,
                cursor: 'default',
              }}
            >
              {segment.text}
            </span>
          </Tooltip>
        );
      })}
    </>
  );
}
