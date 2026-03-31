import { z } from 'zod';
import { slugField } from './common.schema.js';

export const listSpeakersQuery = z.object({
  slug: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
});

export const speakerBody = z.object({
  slug: slugField,
  name_japanese: z.string().max(100).optional(),
  image_url: z.string().max(500).optional(),
  translations: z.record(z.string(), z.string()),
  descriptions: z.record(z.string(), z.string()).optional(),
});

export const speakerPatchBody = z.object({
  slug: slugField.optional(),
  name_japanese: z.string().max(100).optional(),
  image_url: z.string().max(500).optional(),
  translations: z.record(z.string(), z.string()).optional(),
  descriptions: z.record(z.string(), z.string()).optional(),
});

export type SpeakerBody = z.infer<typeof speakerBody>;
export type SpeakerPatchBody = z.infer<typeof speakerPatchBody>;
export type ListSpeakersQuery = z.infer<typeof listSpeakersQuery>;
