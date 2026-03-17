import { type TranscriptLineGrammarPoint } from '../lib/api';

export type Segment =
  | { type: 'plain'; text: string }
  | { type: 'annotated'; text: string; annotations: TranscriptLineGrammarPoint[] };

export function buildSegments(text: string, annotations: TranscriptLineGrammarPoint[]): Segment[] {
  const withSpans = annotations.filter((a) => a.start_index !== null && a.end_index !== null);

  if (!withSpans.length) { return [{ type: 'plain', text }]; }

  // Group overlapping annotations by their span
  const spanMap = new Map<string, TranscriptLineGrammarPoint[]>();
  for (const annotation of withSpans) {
    const key = `${annotation.start_index}:${annotation.end_index}`;
    if (!spanMap.has(key)) { spanMap.set(key, []); }
    spanMap.get(key)!.push(annotation);
  }

  // Collect unique spans sorted by start_index, largest span first for same start
  const spans = Array.from(spanMap.entries())
    .map(([key, anns]) => {
      const [start, end] = key.split(':').map(Number);
      return { start, end, annotations: anns };
    })
    .sort((a, b) => a.start - b.start || b.end - a.end);

  const segments: Segment[] = [];
  let cursor = 0;

  for (const span of spans) {
    if (span.start >= cursor) {
      if (span.start > cursor) {
        segments.push({ type: 'plain', text: text.slice(cursor, span.start) });
      }
      segments.push({
        type: 'annotated',
        text: text.slice(span.start, span.end),
        annotations: span.annotations,
      });
      cursor = span.end;
    } else {
      // Overlapping span: merge its annotations into the last annotated segment
      const last = segments[segments.length - 1];
      if (last?.type === 'annotated') {
        last.annotations.push(...span.annotations);
      }
      if (span.end > cursor) { cursor = span.end; }
    }
  }

  if (cursor < text.length) {
    segments.push({ type: 'plain', text: text.slice(cursor) });
  }

  return segments;
}
