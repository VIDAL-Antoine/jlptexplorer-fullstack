import { type TranscriptLineGrammarPoint } from '@/lib/api';

export function deduplicateAndSortGrammarPoints(
  points: TranscriptLineGrammarPoint[]
): TranscriptLineGrammarPoint[] {
  return [...points]
    .filter(
      (tlgp, i, arr) => arr.findIndex((x) => x.grammar_point_id === tlgp.grammar_point_id) === i
    )
    .sort((a, b) =>
      (b.grammar_points?.jlpt_level ?? 'N5').localeCompare(a.grammar_points?.jlpt_level ?? 'N5')
    );
}
