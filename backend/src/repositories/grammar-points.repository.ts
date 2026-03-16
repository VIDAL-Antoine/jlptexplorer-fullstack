import { prisma } from "../config/prisma.js";
import { buildSceneInclude } from "./scenes.repository.js";
import type { jlpt_level } from "../generated/prisma/enums.js";

export async function findGrammarPoints(
  locale: string,
  filters: { jlpt_level?: jlpt_level; search?: string }
) {
  const { jlpt_level: jlptLevel, search } = filters;
  const where = {
    ...(jlptLevel ? { jlpt_level: jlptLevel } : {}),
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" as const } },
            { romaji: { contains: search, mode: "insensitive" as const } },
            {
              translations: {
                some: {
                  locale,
                  meaning: { contains: search, mode: "insensitive" as const },
                },
              },
            },
          ],
        }
      : {}),
  };

  return prisma.grammar_points.findMany({
    where,
    orderBy: [{ jlpt_level: "asc" }, { title: "asc" }],
    include: {
      translations: { where: { locale } },
      _count: { select: { transcript_line_grammar_points: true } },
    },
  });
}

export async function findGrammarPointBySlug(slug: string, locale: string) {
  return prisma.grammar_points.findUnique({
    where: { slug },
    include: { translations: { where: { locale } } },
  });
}

export async function findGrammarPointIdBySlug(slug: string) {
  return prisma.grammar_points.findUnique({ where: { slug }, select: { id: true } });
}

export async function findGrammarPointsBySlugIn(slugs: string[]) {
  return prisma.grammar_points.findMany({
    where: { slug: { in: slugs } },
    select: { id: true, slug: true },
  });
}

export async function findGrammarPointMeta(grammarPointId: number, locale: string) {
  const [scenesCount, availableSources] = await Promise.all([
    prisma.scenes.count({
      where: {
        transcript_lines: {
          some: {
            transcript_line_grammar_points: {
              some: { grammar_point_id: grammarPointId },
            },
          },
        },
      },
    }),
    prisma.sources.findMany({
      where: {
        scenes: {
          some: {
            transcript_lines: {
              some: {
                transcript_line_grammar_points: {
                  some: { grammar_point_id: grammarPointId },
                },
              },
            },
          },
        },
      },
      include: { translations: { where: { locale } } },
      orderBy: { id: "asc" },
    }),
  ]);

  return { scenesCount, availableSources };
}

export async function findGrammarPointScenes(
  grammarPointId: number,
  locale: string,
  options: { sourceSlugs: string[]; page: number; limit: number }
) {
  const { sourceSlugs, page, limit } = options;
  const where = {
    transcript_lines: {
      some: {
        transcript_line_grammar_points: {
          some: { grammar_point_id: grammarPointId },
        },
      },
    },
    ...(sourceSlugs.length > 0 && { sources: { slug: { in: sourceSlugs } } }),
  };

  const [scenes, total, availableSources] = await Promise.all([
    prisma.scenes.findMany({
      where,
      include: buildSceneInclude(locale),
      orderBy: [{ source_id: "asc" }, { episode_number: "asc" }, { start_time: "asc" }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.scenes.count({ where }),
    prisma.sources.findMany({
      where: {
        scenes: {
          some: {
            transcript_lines: {
              some: {
                transcript_line_grammar_points: {
                  some: { grammar_point_id: grammarPointId },
                },
              },
            },
          },
        },
      },
      include: { translations: { where: { locale } } },
      orderBy: { id: "asc" },
    }),
  ]);

  return { scenes, total, availableSources };
}

export async function createGrammarPoint(data: {
  slug: string;
  title: string;
  romaji: string;
  jlpt_level: jlpt_level;
  locale: string;
  meaning: string;
  notes?: string;
}) {
  return prisma.grammar_points.create({
    data: {
      slug: data.slug,
      title: data.title,
      romaji: data.romaji,
      jlpt_level: data.jlpt_level,
      translations: { create: { locale: data.locale, meaning: data.meaning, notes: data.notes } },
    },
    include: { translations: { where: { locale: data.locale } } },
  });
}

export async function updateGrammarPoint(
  paramSlug: string,
  grammarPointId: number,
  data: {
    slug: string;
    title: string;
    romaji: string;
    jlpt_level: jlpt_level;
    locale: string;
    meaning: string;
    notes?: string;
  }
) {
  return prisma.grammar_points.update({
    where: { slug: paramSlug },
    data: {
      slug: data.slug,
      title: data.title,
      romaji: data.romaji,
      jlpt_level: data.jlpt_level,
      translations: {
        upsert: {
          where: {
            grammar_point_id_locale: { grammar_point_id: grammarPointId, locale: data.locale },
          },
          create: { locale: data.locale, meaning: data.meaning, notes: data.notes },
          update: { meaning: data.meaning, notes: data.notes },
        },
      },
    },
    include: { translations: { where: { locale: data.locale } } },
  });
}

export async function deleteGrammarPoint(slug: string) {
  return prisma.grammar_points.delete({ where: { slug } });
}
