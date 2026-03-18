import { z } from 'zod';
import { localeParams, idParams } from './common.schema';

export const listScenesQuery = z.object({
  sources: z.string().optional(),
  grammar_points: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
});

export const grammarPointAnnotation = z.object({
  slug: z.string(),
  start_index: z.number().int().nonnegative().optional(),
  end_index: z.number().int().nonnegative().optional(),
  matched_form: z.string().optional(),
});

export const transcriptLineInput = z.object({
  start_time: z.union([z.number(), z.string()]).optional(),
  speaker_slug: z.string().optional(),
  text: z.string(),
  translations: z.record(z.string(), z.string()).optional(),
  grammar_points: z.array(grammarPointAnnotation).optional(),
});

export const sceneBody = z.object({
  source_slug: z.string(),
  youtube_video_id: z.string().max(20),
  start_time: z.union([z.number(), z.string()]),
  end_time: z.union([z.number(), z.string()]),
  episode_number: z.number().int().positive().optional(),
  notes: z.string().optional(),
  transcript_lines: z.array(transcriptLineInput),
});

export const sceneParams = localeParams.extend({ id: z.string() });
export const adminSceneParams = idParams;

export const updateTranslationsParams = localeParams.extend({ id: z.string() });
export const updateTranslationsBody = z.object({
  transcript_lines: z.array(
    z.object({
      id: z.number().int().positive(),
      translation: z.string(),
    }),
  ),
});

export type SceneBody = z.infer<typeof sceneBody>;
export type TranscriptLineInput = z.infer<typeof transcriptLineInput>;
export type GrammarPointAnnotation = z.infer<typeof grammarPointAnnotation>;
export type UpdateTranslationsBody = z.infer<typeof updateTranslationsBody>;
export type ListScenesQuery = z.infer<typeof listScenesQuery>;
