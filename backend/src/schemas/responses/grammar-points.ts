import { z } from 'zod';
import { grammarPointResponse, sourceResponse, sceneResponse, errorResponse } from './primitives';

export { errorResponse, grammarPointResponse };

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
