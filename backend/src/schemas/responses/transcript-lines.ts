import { z } from 'zod';
import { jlptLevel } from '@/schemas/grammar-points.schema';
import { errorResponse } from './primitives';

export { errorResponse };

// ─── Public read (flattenTranscriptLine) ──────────────────────────────────────

export const transcriptLineReadResponse = z.object({
  id: z.number().int(),
  scene_id: z.number().int(),
  start_time: z.number().int().nullable(),
  speaker_id: z.number().int().nullable(),
  japanese_text: z.string(),
  translation: z.string().nullable(),
});

export const listTranscriptLinesResponse = z.object({
  lines: z.array(transcriptLineReadResponse),
  total: z.number().int(),
  page: z.number().int(),
  totalPages: z.number().int(),
});

// ─── Admin write (flattenTranscriptLineAll) ───────────────────────────────────
// buildTranscriptLineIncludeAll: speakers WITH their translations array, grammar_points without translations
// transcript_line.translations -> Record<locale, string | null>

const rawSpeakerTranslation = z.object({
  id: z.number().int(),
  speaker_id: z.number().int(),
  locale: z.string(),
  name: z.string(),
  description: z.string().nullable(),
});

const rawSpeakerInLine = z
  .object({
    id: z.number().int(),
    slug: z.string(),
    name_japanese: z.string().nullable(),
    image_url: z.string().nullable(),
    created_at: z.date(),
    translations: z.array(rawSpeakerTranslation),
  })
  .nullable();

const rawGrammarPointInLine = z
  .object({
    id: z.number().int(),
    slug: z.string(),
    title: z.string(),
    romaji: z.string(),
    jlpt_level: jlptLevel,
    created_at: z.date(),
  })
  .nullable();

const rawTlgpInLine = z.object({
  id: z.number().int(),
  transcript_line_id: z.number().int(),
  grammar_point_id: z.number().int(),
  start_index: z.number().int().nullable(),
  end_index: z.number().int().nullable(),
  matched_form: z.string().nullable(),
  grammar_points: rawGrammarPointInLine,
});

export const transcriptLineWriteResponse = z.object({
  id: z.number().int(),
  scene_id: z.number().int(),
  start_time: z.number().int().nullable(),
  speaker_id: z.number().int().nullable(),
  japanese_text: z.string(),
  translations: z.record(z.string(), z.string().nullable()),
  speakers: rawSpeakerInLine,
  transcript_line_grammar_points: z.array(rawTlgpInLine),
});
