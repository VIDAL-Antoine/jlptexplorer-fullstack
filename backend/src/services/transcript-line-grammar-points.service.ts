import * as repo from '@/repositories/transcript-line-grammar-points.repository.js';
import { findGrammarPointsBySlugIn } from '@/repositories/grammar-points.repository.js';
import { findTranscriptLineByIdAll } from '@/repositories/transcript-lines.repository.js';
import type {
  TranscriptLineGrammarPointCreateBody,
  TranscriptLineGrammarPointPatchBody,
} from '@/schemas/transcript-line-grammar-points.schema.js';

async function resolveGrammarPointSlug(slug: string): Promise<number> {
  const points = await findGrammarPointsBySlugIn([slug]);
  if (!points.length) {
    throw Object.assign(new Error(`Unknown grammar point slug: ${slug}`), { statusCode: 400 });
  }
  return points[0].id;
}

export async function listTranscriptLineGrammarPoints(filters: { transcriptLineId?: number }) {
  return repo.findAllTranscriptLineGrammarPoints(filters);
}

export async function getTranscriptLineGrammarPointById(id: number) {
  return repo.findTranscriptLineGrammarPointById(id);
}

export async function createTranscriptLineGrammarPoint(body: TranscriptLineGrammarPointCreateBody) {
  const { transcript_line_id, grammar_point_slug, start_index, end_index, matched_form } = body;

  const lineExists = await findTranscriptLineByIdAll(transcript_line_id);
  if (!lineExists) {
    throw Object.assign(new Error(`Unknown transcript line id: ${transcript_line_id}`), {
      statusCode: 400,
    });
  }

  const grammarPointId = await resolveGrammarPointSlug(grammar_point_slug);

  return repo.createTranscriptLineGrammarPoint({
    transcript_line_id,
    grammar_point_id: grammarPointId,
    start_index,
    end_index,
    ...(matched_form !== undefined ? { matched_form } : {}),
  });
}

export async function patchTranscriptLineGrammarPoint(
  id: number,
  body: TranscriptLineGrammarPointPatchBody,
) {
  const existing = await repo.findTranscriptLineGrammarPointById(id);
  if (!existing) {
    return null;
  }

  const { grammar_point_slug, start_index, end_index, matched_form } = body;

  const grammarPointId = grammar_point_slug
    ? await resolveGrammarPointSlug(grammar_point_slug)
    : undefined;

  return repo.updateTranscriptLineGrammarPoint(id, {
    ...(grammarPointId !== undefined ? { grammar_point_id: grammarPointId } : {}),
    ...(start_index !== undefined ? { start_index } : {}),
    ...(end_index !== undefined ? { end_index } : {}),
    ...(matched_form !== undefined ? { matched_form } : {}),
  });
}

export async function deleteTranscriptLineGrammarPoint(id: number) {
  const existing = await repo.findTranscriptLineGrammarPointById(id);
  if (!existing) {
    return null;
  }
  await repo.deleteTranscriptLineGrammarPoint(id);
  return true;
}
