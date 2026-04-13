import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { jlpt_level } from '@prisma/client';
import { buildSceneInclude } from '../scenes/scenes.repository';

@Injectable()
export class GrammarPointsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findGrammarPoints(
    locale: string,
    filters: { jlpt_level?: jlpt_level; search?: string },
  ) {
    const { jlpt_level: jlptLevel, search } = filters;
    const where = {
      ...(jlptLevel ? { jlpt_level: jlptLevel } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' as const } },
              { romaji: { contains: search, mode: 'insensitive' as const } },
              {
                translations: {
                  some: {
                    locale,
                    meaning: { contains: search, mode: 'insensitive' as const },
                  },
                },
              },
            ],
          }
        : {}),
    };

    return this.prisma.grammar_points.findMany({
      where,
      orderBy: [{ jlpt_level: 'asc' }, { title: 'asc' }],
      include: {
        translations: { where: { locale } },
        _count: { select: { transcript_line_grammar_points: true } },
      },
    });
  }

  findGrammarPointBySlug(slug: string, locale: string) {
    return this.prisma.grammar_points.findUnique({
      where: { slug },
      include: { translations: { where: { locale } } },
    });
  }

  findGrammarPointsBySlugIn(slugs: string[]) {
    return this.prisma.grammar_points.findMany({
      where: { slug: { in: slugs } },
      select: { id: true, slug: true },
    });
  }

  async findGrammarPointMeta(grammarPointId: number, locale: string) {
    const [scenesCount, availableSources] = await Promise.all([
      this.prisma.scenes.count({
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
      this.prisma.sources.findMany({
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
        orderBy: { id: 'asc' },
      }),
    ]);
    return { scenesCount, availableSources };
  }

  async findGrammarPointScenes(
    grammarPointId: number,
    locale: string,
    options: { sourceSlugs: string[]; page: number; limit: number },
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
      this.prisma.scenes.findMany({
        where,
        include: buildSceneInclude(locale),
        orderBy: [
          { source_id: 'asc' },
          { episode_number: 'asc' },
          { start_time: 'asc' },
        ],
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.scenes.count({ where }),
      this.prisma.sources.findMany({
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
        orderBy: { id: 'asc' },
      }),
    ]);

    return { scenes, total, availableSources };
  }

  createGrammarPoint(data: {
    slug: string;
    title: string;
    romaji: string;
    jlpt_level: jlpt_level;
    translations: { locale: string; meaning: string; notes?: string }[];
  }) {
    return this.prisma.grammar_points.create({
      data: {
        slug: data.slug,
        title: data.title,
        romaji: data.romaji,
        jlpt_level: data.jlpt_level,
        translations: { create: data.translations },
      },
      include: { translations: true },
    });
  }

  updateGrammarPoint(
    paramSlug: string,
    grammarPointId: number,
    data: {
      slug: string;
      title: string;
      romaji: string;
      jlpt_level: jlpt_level;
      translations: { locale: string; meaning: string; notes?: string }[];
    },
  ) {
    return this.prisma.grammar_points.update({
      where: { slug: paramSlug },
      data: {
        slug: data.slug,
        title: data.title,
        romaji: data.romaji,
        jlpt_level: data.jlpt_level,
        translations: {
          upsert: data.translations.map(({ locale, meaning, notes }) => ({
            where: {
              grammar_point_id_locale: {
                grammar_point_id: grammarPointId,
                locale,
              },
            },
            create: { locale, meaning, notes },
            update: { meaning, notes },
          })),
        },
      },
      include: { translations: true },
    });
  }

  patchGrammarPoint(
    paramSlug: string,
    grammarPointId: number,
    data: {
      slug?: string;
      title?: string;
      romaji?: string;
      jlpt_level?: jlpt_level;
      translations?: { locale: string; meaning?: string; notes?: string }[];
    },
  ) {
    const { slug, title, romaji, jlpt_level: jlptLevel, translations } = data;
    return this.prisma.grammar_points.update({
      where: { slug: paramSlug },
      data: {
        ...(slug !== undefined ? { slug } : {}),
        ...(title !== undefined ? { title } : {}),
        ...(romaji !== undefined ? { romaji } : {}),
        ...(jlptLevel !== undefined ? { jlpt_level: jlptLevel } : {}),
        ...(translations?.length
          ? {
              translations: {
                upsert: translations.map(({ locale, meaning, notes }) => ({
                  where: {
                    grammar_point_id_locale: {
                      grammar_point_id: grammarPointId,
                      locale,
                    },
                  },
                  create: { locale, meaning: meaning ?? '', notes },
                  update: {
                    ...(meaning !== undefined ? { meaning } : {}),
                    ...(notes !== undefined ? { notes } : {}),
                  },
                })),
              },
            }
          : {}),
      },
      include: { translations: true },
    });
  }

  deleteGrammarPoint(slug: string) {
    return this.prisma.grammar_points.delete({ where: { slug } });
  }
}
