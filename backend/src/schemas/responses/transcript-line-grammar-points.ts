import { z } from 'zod';
import { errorResponse } from './primitives.js';

export { errorResponse };

// create/patch: raw junction record, no nested grammar_points
export const tlgpWriteResponse = z.object({
  id: z.number().int(),
  transcript_line_id: z.number().int(),
  grammar_point_id: z.number().int(),
  start_index: z.number().int().nullable(),
  end_index: z.number().int().nullable(),
  matched_form: z.string().nullable(),
});
