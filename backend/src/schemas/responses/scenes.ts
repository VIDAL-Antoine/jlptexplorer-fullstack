import { z } from 'zod';
import { jlptLevel } from '@/schemas/grammar-points.schema';
import { sourceType } from '@/schemas/sources.schema';
import { grammarPointResponse, sourceResponse, sceneResponse, errorResponse } from './primitives';

export { errorResponse, sceneResponse };

// ─── Public read ──────────────────────────────────────────────────────────────

export const listScenesResponse = z.object({
  scenes: z.array(sceneResponse),
  total: z.number().int(),
  page: z.number().int(),
  totalPages: z.number().int(),
  available_sources: z.array(sourceResponse),
  available_grammar_points: z.array(grammarPointResponse),
});

// ─── Admin write (flattenSceneAll) ────────────────────────────────────────────
// buildSceneIncludeAll: sources/speakers without translations, grammar_points without translations
// transcript_lines.translations -> Record<locale, string | null>

const rawSourceInScene = z.object({
  id: z.number().int(),
  slug: z.string(),
  type: sourceType,
  cover_image_url: z.string().nullable(),
  japanese_title: z.string().nullable(),
});

const rawSpeakerInScene = z
  .object({
    id: z.number().int(),
    slug: z.string(),
    name_japanese: z.string().nullable(),
    image_url: z.string().nullable(),
  })
  .nullable();

const rawGrammarPointInScene = z
  .object({
    id: z.number().int(),
    slug: z.string(),
    title: z.string(),
    romaji: z.string(),
    jlpt_level: jlptLevel,
  })
  .nullable();

const rawTlgpInScene = z.object({
  id: z.number().int(),
  transcript_line_id: z.number().int(),
  grammar_point_id: z.number().int(),
  start_index: z.number().int().nullable(),
  end_index: z.number().int().nullable(),
  matched_form: z.string().nullable(),
  grammar_points: rawGrammarPointInScene,
});

const rawTranscriptLineInScene = z.object({
  id: z.number().int(),
  scene_id: z.number().int(),
  start_time: z.number().int().nullable(),
  speaker_id: z.number().int().nullable(),
  japanese_text: z.string(),
  translations: z.record(z.string(), z.string().nullable()),
  speakers: rawSpeakerInScene,
  transcript_line_grammar_points: z.array(rawTlgpInScene),
});

export const sceneWriteResponse = z.object({
  id: z.number().int(),
  source_id: z.number().int(),
  youtube_video_id: z.string(),
  start_time: z.number().int(),
  end_time: z.number().int(),
  episode_number: z.number().int(),
  notes: z.string().nullable(),
  sources: rawSourceInScene,
  transcript_lines: z.array(rawTranscriptLineInScene),
});
