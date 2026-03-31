import { z } from 'zod';
import { grammarPointResponse, sourceResponse, sceneResponse, errorResponse } from './primitives.js';
import { jlptLevel } from '@/schemas/grammar-points.schema.js';

export { errorResponse, grammarPointResponse };

// ─── Admin write ──────────────────────────────────────────────────────────────
// translations: locale -> { meaning, notes }

export const grammarPointAdminResponse = z.object({
  id: z.number().int(),
  slug: z.string(),
  title: z.string(),
  romaji: z.string(),
  jlpt_level: jlptLevel,
  translations: z.record(
    z.string(),
    z.object({ meaning: z.string(), notes: z.string().nullable() }),
  ),
});

export const listGrammarPointsResponse = z.object({
  grammar_points: z.array(grammarPointResponse.extend({ has_scenes: z.boolean() })),
  total: z.number().int(),
  page: z.number().int(),
  totalPages: z.number().int(),
});

export const getGrammarPointResponse = grammarPointResponse.extend({
  scenes_count: z.number().int(),
  available_sources: z.array(sourceResponse),
});

export const getGrammarPointScenesResponse = z.object({
  scenes: z.array(sceneResponse),
  total: z.number().int(),
  page: z.number().int(),
  totalPages: z.number().int(),
  available_sources: z.array(sourceResponse),
});
