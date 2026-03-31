import { z } from 'zod';
import { localeParams, paginationQuery, slugField, slugParams } from './common.schema.js';

export const jlptLevel = z.enum(['N5', 'N4', 'N3', 'N2', 'N1', 'Other']);

export const listGrammarPointsQuery = z.object({
  jlpt_level: jlptLevel.optional(),
  search: z.string().max(100).optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
});

export const grammarPointTranslationBody = z.object({
  locale: z.string().min(2).max(10),
  meaning: z.string(),
  notes: z.string().optional(),
});

export const grammarPointTranslationPatchBody = z.object({
  locale: z.string().min(2).max(10),
  meaning: z.string().optional(),
  notes: z.string().optional(),
});

export const grammarPointBody = z.object({
  slug: slugField,
  title: z.string().max(100),
  romaji: z.string().max(100),
  jlpt_level: jlptLevel,
  translations: z.array(grammarPointTranslationBody).min(1),
});

export const grammarPointParams = localeParams.extend({ slug: z.string() });
export const grammarPointAdminParams = slugParams;

export const grammarPointScenesQuery = paginationQuery.extend({
  sources: z.string().optional(),
});

export const grammarPointPatchBody = z.object({
  slug: slugField.optional(),
  title: z.string().max(100).optional(),
  romaji: z.string().max(100).optional(),
  jlpt_level: jlptLevel.optional(),
  translations: z.array(grammarPointTranslationPatchBody).optional(),
});

export type GrammarPointBody = z.infer<typeof grammarPointBody>;
export type GrammarPointPatchBody = z.infer<typeof grammarPointPatchBody>;
export type GrammarPointTranslationBody = z.infer<typeof grammarPointTranslationBody>;
export type GrammarPointTranslationPatchBody = z.infer<typeof grammarPointTranslationPatchBody>;
export type ListGrammarPointsQuery = z.infer<typeof listGrammarPointsQuery>;
export type GrammarPointParams = z.infer<typeof grammarPointParams>;
export type GrammarPointAdminParams = z.infer<typeof grammarPointAdminParams>;
export type GrammarPointScenesQuery = z.infer<typeof grammarPointScenesQuery>;
