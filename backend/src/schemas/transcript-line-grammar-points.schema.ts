import { z } from 'zod';
import { idParams } from './common.schema.js';

export const transcriptLineGrammarPointCreateBody = z.object({
  transcript_line_id: z.number().int().positive(),
  grammar_point_slug: z.string(),
  start_index: z.number().int().nonnegative(),
  end_index: z.number().int().nonnegative(),
  matched_form: z.string().optional(),
});

export const transcriptLineGrammarPointPatchBody = z.object({
  grammar_point_slug: z.string().optional(),
  start_index: z.number().int().nonnegative().optional(),
  end_index: z.number().int().nonnegative().optional(),
  matched_form: z.string().optional(),
});

export const transcriptLineGrammarPointParams = idParams;

export type TranscriptLineGrammarPointCreateBody = z.infer<
  typeof transcriptLineGrammarPointCreateBody
>;
export type TranscriptLineGrammarPointPatchBody = z.infer<
  typeof transcriptLineGrammarPointPatchBody
>;
