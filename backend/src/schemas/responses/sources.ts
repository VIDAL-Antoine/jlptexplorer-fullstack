import { z } from 'zod';
import { sourceType } from '@/schemas/sources.schema';
import { grammarPointResponse, sourceResponse, sceneResponse, errorResponse } from './primitives';

export { errorResponse, sourceResponse };

export const listSourcesResponse = z.object({
  sources: z.array(sourceResponse),
  total: z.number().int(),
  page: z.number().int(),
  totalPages: z.number().int(),
  available_types: z.array(sourceType),
});

export const getSourceResponse = sourceResponse.extend({
  scenes_count: z.number().int(),
  grammar_points: z.array(grammarPointResponse),
});

export const getSourceScenesResponse = z.object({
  scenes: z.array(sceneResponse),
  total: z.number().int(),
  page: z.number().int(),
  totalPages: z.number().int(),
  available_grammar_points: z.array(grammarPointResponse),
});

// Admin write response: translations returned as locale->title Record
export const sourceWriteResponse = z.object({
  id: z.number().int(),
  slug: z.string(),
  type: sourceType,
  cover_image_url: z.string().nullable(),
  japanese_title: z.string().nullable(),
  created_at: z.date(),
  translations: z.record(z.string(), z.string()),
});
