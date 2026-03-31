import { z } from 'zod';
import { speakerResponse, sourceResponse, grammarPointResponse, errorResponse } from './primitives.js';

export { errorResponse, speakerResponse };

// ─── Public read ──────────────────────────────────────────────────────────────

export const listSpeakersResponse = z.object({
  speakers: z.array(speakerResponse),
  total: z.number().int(),
  page: z.number().int(),
  totalPages: z.number().int(),
});

// getSpeaker: speaker + transcript_lines with their scene and grammar_points
const speakerTlgpResponse = z.object({
  id: z.number().int(),
  transcript_line_id: z.number().int(),
  grammar_point_id: z.number().int(),
  start_index: z.number().int().nullable(),
  end_index: z.number().int().nullable(),
  matched_form: z.string().nullable(),
  grammar_points: grammarPointResponse, // FK required, never null
});

const speakerSceneResponse = z.object({
  id: z.number().int(),
  source_id: z.number().int(),
  youtube_video_id: z.string(),
  start_time: z.number().int(),
  end_time: z.number().int(),
  episode_number: z.number().int(),
  notes: z.string().nullable(),
  sources: sourceResponse,
});

const speakerTranscriptLineResponse = z.object({
  id: z.number().int(),
  scene_id: z.number().int(),
  start_time: z.number().int().nullable(),
  speaker_id: z.number().int().nullable(),
  japanese_text: z.string(),
  scenes: speakerSceneResponse,
  transcript_line_grammar_points: z.array(speakerTlgpResponse),
});

export const getSpeakerResponse = speakerResponse.extend({
  transcript_lines: z.array(speakerTranscriptLineResponse),
});

// ─── Admin write ──────────────────────────────────────────────────────────────
// translations: locale -> { name, description }

export const speakerWriteResponse = z.object({
  id: z.number().int(),
  slug: z.string(),
  name_japanese: z.string().nullable(),
  image_url: z.string().nullable(),
  translations: z.record(
    z.string(),
    z.object({ name: z.string(), description: z.string().nullable() }),
  ),
});
