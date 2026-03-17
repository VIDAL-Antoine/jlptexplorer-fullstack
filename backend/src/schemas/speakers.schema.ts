import { z } from 'zod';

export const speakerBody = z.object({
  slug: z.string().max(100),
  name_japanese: z.string().max(100).optional(),
  image_url: z.string().max(500).optional(),
  translations: z.record(z.string(), z.string()),
  descriptions: z.record(z.string(), z.string()).optional(),
});

export type SpeakerBody = z.infer<typeof speakerBody>;
