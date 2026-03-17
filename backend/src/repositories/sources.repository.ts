import { prisma } from "@/config/prisma";
import { buildSceneInclude } from "@/repositories/scenes.repository";
import type { source_type } from "@/generated/prisma/enums";

export async function findSources(locale: string, type?: source_type) {
  return prisma.sources.findMany({
    where: { ...(type ? { type } : {}), scenes: { some: {} } },
    include: { translations: { where: { locale } } },
    orderBy: { id: "asc" },
  });
}

export async function findSourceBySlug(slug: string, locale: string) {
  return prisma.sources.findUnique({
    where: { slug },
    include: {
      translations: { where: { locale } },
      scenes: {
        select: {
          transcript_lines: {
            select: {
              transcript_line_grammar_points: {
                include: {
                  grammar_points: { include: { translations: { where: { locale } } } },
                },
              },
            },
          },
        },
      },
    },
  });
}

export async function findSourceIdBySlug(slug: string) {
  return prisma.sources.findUnique({ where: { slug }, select: { id: true } });
}

export async function findSourceScenes(
  sourceId: number,
  locale: string,
  options: { grammarPointSlugs: string[]; page: number; limit: number }
) {
  const { grammarPointSlugs, page, limit } = options;
  const where = {
    source_id: sourceId,
    AND: grammarPointSlugs.map((slug) => ({
      transcript_lines: {
        some: {
          transcript_line_grammar_points: {
            some: { grammar_points: { slug } },
          },
        },
      },
    })),
  };

  const [scenes, total, availableGrammarPoints] = await Promise.all([
    prisma.scenes.findMany({
      where,
      include: buildSceneInclude(locale),
      orderBy: [{ episode_number: "asc" }, { start_time: "asc" }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.scenes.count({ where }),
    prisma.grammar_points.findMany({
      where: {
        transcript_line_grammar_points: {
          some: { transcript_lines: { scenes: where } },
        },
      },
      include: { translations: { where: { locale } } },
      orderBy: { jlpt_level: "asc" },
    }),
  ]);

  return { scenes, total, availableGrammarPoints };
}

export async function createSource(data: {
  slug: string;
  japanese_title?: string;
  type: source_type;
  cover_image_url?: string;
  translations: Record<string, string>;
}) {
  return prisma.sources.create({
    data: {
      slug: data.slug,
      japanese_title: data.japanese_title,
      type: data.type,
      cover_image_url: data.cover_image_url,
      translations: {
        create: Object.entries(data.translations).map(([locale, title]) => ({ locale, title })),
      },
    },
    include: { translations: true },
  });
}

export async function updateSource(
  paramSlug: string,
  sourceId: number,
  data: {
    slug: string;
    japanese_title?: string;
    type: source_type;
    cover_image_url?: string;
    translations: Record<string, string>;
  }
) {
  return prisma.sources.update({
    where: { slug: paramSlug },
    data: {
      slug: data.slug,
      japanese_title: data.japanese_title,
      type: data.type,
      cover_image_url: data.cover_image_url,
      translations: {
        upsert: Object.entries(data.translations).map(([locale, title]) => ({
          where: { source_id_locale: { source_id: sourceId, locale } },
          create: { locale, title },
          update: { title },
        })),
      },
    },
    include: { translations: true },
  });
}

export async function deleteSource(slug: string) {
  return prisma.sources.delete({ where: { slug } });
}
