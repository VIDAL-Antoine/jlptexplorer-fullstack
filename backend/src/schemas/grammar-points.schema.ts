import { z } from "zod";
import { localeParams, paginationQuery } from "./common.schema";

export const jlptLevel = z.enum(["N5", "N4", "N3", "N2", "N1", "Other"]);

export const listGrammarPointsQuery = z.object({
  jlpt_level: jlptLevel.optional(),
  search: z.string().max(100).optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
});

export const grammarPointBody = z.object({
  slug: z.string().max(100),
  title: z.string().max(100),
  romaji: z.string().max(100),
  meaning: z.string(),
  jlpt_level: jlptLevel,
  notes: z.string().optional(),
});

export const grammarPointParams = localeParams.extend({ slug: z.string() });

export const grammarPointScenesQuery = paginationQuery.extend({
  sources: z.string().optional(),
});

export type GrammarPointBody = z.infer<typeof grammarPointBody>;
export type ListGrammarPointsQuery = z.infer<typeof listGrammarPointsQuery>;
export type GrammarPointParams = z.infer<typeof grammarPointParams>;
export type GrammarPointScenesQuery = z.infer<typeof grammarPointScenesQuery>;
