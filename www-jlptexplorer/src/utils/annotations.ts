import { type TranscriptLineGrammarPoint } from '@/lib/api';

export type Segment =
  | { type: 'plain'; text: string }
  | { type: 'annotated'; text: string; annotations: TranscriptLineGrammarPoint[] };

export function buildSegments(text: string, annotations: TranscriptLineGrammarPoint[]): Segment[] {
  const withSpans = annotations.filter((a) => a.start_index !== null && a.end_index !== null);

  if (!withSpans.length) {
    return [{ type: 'plain', text }];
  }

  // Collect all unique boundary points from every annotation start/end
  const boundarySet = new Set<number>([0, text.length]);
  for (const a of withSpans) {
    boundarySet.add(a.start_index!);
    boundarySet.add(a.end_index!);
  }
  const boundaries = Array.from(boundarySet).sort((a, b) => a - b);

  // For each sub-interval [boundaries[i], boundaries[i+1]], collect annotations that fully cover it
  const segments: Segment[] = [];
  for (let i = 0; i < boundaries.length - 1; i++) {
    const start = boundaries[i];
    const end = boundaries[i + 1];
    const segmentText = text.slice(start, end);
    if (!segmentText.length) {
      continue;
    }

    const covering = withSpans.filter((a) => a.start_index! <= start && a.end_index! >= end);

    if (covering.length > 0) {
      segments.push({ type: 'annotated', text: segmentText, annotations: covering });
    } else {
      // Merge consecutive plain segments
      const last = segments[segments.length - 1];
      if (last?.type === 'plain') {
        last.text += segmentText;
      } else {
        segments.push({ type: 'plain', text: segmentText });
      }
    }
  }

  return segments;
}
