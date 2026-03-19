import { z } from 'zod';
import { localeParams, idParams } from './common.schema';
import { grammarPointAnnotation, transcriptLineInput } from './scenes.schema';

export const transcriptLineCreateBody = transcriptLineInput.extend({
  scene_id: z.number().int().positive(),
  start_time: z.union([z.number(), z.string()]),
});

export const transcriptLineUpdateBody = transcriptLineInput.extend({
  start_time: z.union([z.number(), z.string()]),
});

export const transcriptLinePatchBody = z.object({
  text: z.string().optional(),
  start_time: z.union([z.number(), z.string()]).optional(),
  speaker_slug: z.string().optional(),
  translations: z.record(z.string(), z.string()).optional(),
});

export const transcriptLineParams = localeParams.extend({ id: z.string() });
export const transcriptLineAdminParams = idParams;

export const listTranscriptLinesQuery = z.object({
  scene_id: z.string(),
  speaker_slug: z.string().optional(),
  start_time: z.string().optional(),
  grammar_points: z.string().optional(),
});

export type TranscriptLineCreateBody = z.infer<typeof transcriptLineCreateBody>;
export type TranscriptLineUpdateBody = z.infer<typeof transcriptLineUpdateBody>;
export type TranscriptLinePatchBody = z.infer<typeof transcriptLinePatchBody>;
export type TranscriptLineParams = z.infer<typeof transcriptLineParams>;
export type ListTranscriptLinesQuery = z.infer<typeof listTranscriptLinesQuery>;

// Re-export for convenience
export { grammarPointAnnotation };
