import { z } from "zod";

export const localeParams = z.object({ locale: z.string().min(2).max(10) });
export const slugParams = z.object({ slug: z.string() });
export const idParams = z.object({ id: z.string() });
export const paginationQuery = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
});

export type LocaleParams = z.infer<typeof localeParams>;
