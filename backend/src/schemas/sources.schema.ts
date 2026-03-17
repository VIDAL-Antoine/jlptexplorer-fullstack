import { z } from "zod";
import { paginationQuery } from "./common.schema";

export const sourceType = z.enum(["game", "anime", "movie", "series", "music"]);

export const listSourcesQuery = z.object({
  type: sourceType.optional(),
});

export const sourceSceneQuery = paginationQuery.extend({
  grammar_points: z.string().optional(),
});

export const sourceBody = z.object({
  slug: z.string().max(100),
  japanese_title: z.string().max(255).optional(),
  type: sourceType,
  cover_image_url: z.string().max(500).optional(),
  translations: z.record(z.string(), z.string()),
});

export type SourceBody = z.infer<typeof sourceBody>;
export type ListSourcesQuery = z.infer<typeof listSourcesQuery>;
export type SourceSceneQuery = z.infer<typeof sourceSceneQuery>;
