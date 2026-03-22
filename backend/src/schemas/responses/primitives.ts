import { z } from 'zod';
import { jlptLevel } from '@/schemas/grammar-points.schema';
import { sourceType } from '@/schemas/sources.schema';

export const errorResponse = z.object({ error: z.string() });

export const grammarPointResponse = z.object({
  id: z.number().int(),
  slug: z.string(),
  title: z.string(),
  romaji: z.string(),
  jlpt_level: jlptLevel,
  meaning: z.string().nullable(),
  notes: z.string().nullable(),
});

export const sourceResponse = z.object({
  id: z.number().int(),
  slug: z.string(),
  type: sourceType,
  cover_image_url: z.string().nullable(),
  japanese_title: z.string().nullable(),
  title: z.string().nullable(),
});

export const speakerResponse = z.object({
  id: z.number().int(),
  slug: z.string(),
  name_japanese: z.string().nullable(),
  image_url: z.string().nullable(),
  name: z.string().nullable(),
  description: z.string().nullable(),
});

export const transcriptLineGrammarPointResponse = z.object({
  id: z.number().int(),
  transcript_line_id: z.number().int(),
  grammar_point_id: z.number().int(),
  start_index: z.number().int().nullable(),
  end_index: z.number().int().nullable(),
  matched_form: z.string().nullable(),
  grammar_points: grammarPointResponse.nullable(),
});

export const transcriptLineResponse = z.object({
  id: z.number().int(),
  scene_id: z.number().int(),
  start_time: z.number().int().nullable(),
  speaker_id: z.number().int().nullable(),
  japanese_text: z.string(),
  translation: z.string().nullable(),
  speakers: speakerResponse.nullable(),
  transcript_line_grammar_points: z.array(transcriptLineGrammarPointResponse),
});

export const sceneResponse = z.object({
  id: z.number().int(),
  source_id: z.number().int(),
  youtube_video_id: z.string(),
  start_time: z.number().int(),
  end_time: z.number().int(),
  episode_number: z.number().int(),
  notes: z.string().nullable(),
  sources: sourceResponse,
  transcript_lines: z.array(transcriptLineResponse),
});
