import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

export function buildSceneInclude(locale: string) {
  return {
    sources: { include: { translations: { where: { locale } } } },
    transcript_lines: {
      orderBy: { start_time: 'asc' } as const,
      include: {
        translations: { where: { locale } },
        speakers: { include: { translations: { where: { locale } } } },
        transcript_line_grammar_points: {
          include: {
            grammar_points: {
              include: { translations: { where: { locale } } },
            },
          },
        },
      },
    },
  };
}

export function buildSceneIncludeAll() {
  return {
    sources: true,
    transcript_lines: {
      orderBy: { start_time: 'asc' } as const,
      include: {
        translations: true,
        speakers: true,
        transcript_line_grammar_points: {
          include: { grammar_points: true },
        },
      },
    },
  };
}

@Injectable()
export class ScenesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findScenesPage(
    locale: string,
    options: {
      sourceSlugs: string[];
      grammarPointSlugs: string[];
      grammarMatch: 'scene' | 'transcript_line';
      youtube_video_id?: string;
      start_time?: number;
      end_time?: number;
      page: number;
      limit: number;
    },
  ) {
    const {
      sourceSlugs,
      grammarPointSlugs,
      grammarMatch,
      youtube_video_id,
      start_time,
      end_time,
      page,
      limit,
    } = options;

    const sourceFilter: Prisma.scenesWhereInput =
      sourceSlugs.length > 0 ? { sources: { slug: { in: sourceSlugs } } } : {};

    const grammarFilter: Prisma.scenesWhereInput =
      grammarPointSlugs.length > 0
        ? grammarMatch === 'transcript_line'
          ? {
              transcript_lines: {
                some: {
                  AND: grammarPointSlugs.map((slug) => ({
                    transcript_line_grammar_points: {
                      some: { grammar_points: { slug } },
                    },
                  })),
                },
              },
            }
          : {
              AND: grammarPointSlugs.map((slug) => ({
                transcript_lines: {
                  some: {
                    transcript_line_grammar_points: {
                      some: { grammar_points: { slug } },
                    },
                  },
                },
              })),
            }
        : {};

    const exactFilter: Prisma.scenesWhereInput = {
      ...(youtube_video_id !== undefined ? { youtube_video_id } : {}),
      ...(start_time !== undefined ? { start_time } : {}),
      ...(end_time !== undefined ? { end_time } : {}),
    };

    const where: Prisma.scenesWhereInput = {
      ...sourceFilter,
      ...grammarFilter,
      ...exactFilter,
    };

    const [scenes, total, availableSources, availableGrammarPoints] =
      await Promise.all([
        this.prisma.scenes.findMany({
          where,
          include: buildSceneInclude(locale),
          orderBy: [{ id: 'desc' }],
          skip: (page - 1) * limit,
          take: limit,
        }),
        this.prisma.scenes.count({ where }),
        this.prisma.sources.findMany({
          where: { scenes: { some: grammarFilter } },
          include: { translations: { where: { locale } } },
          orderBy: { id: 'asc' },
        }),
        this.prisma.grammar_points.findMany({
          where: {
            transcript_line_grammar_points: {
              some: { transcript_lines: { scenes: sourceFilter } },
            },
          },
          include: { translations: { where: { locale } } },
          orderBy: [{ jlpt_level: 'asc' }, { title: 'asc' }],
        }),
      ]);

    return { scenes, total, availableSources, availableGrammarPoints };
  }

  findSceneById(id: number, locale: string) {
    return this.prisma.scenes.findUnique({
      where: { id },
      include: buildSceneInclude(locale),
    });
  }

  findSceneByIdAll(id: number) {
    return this.prisma.scenes.findUnique({
      where: { id },
      include: buildSceneIncludeAll(),
    });
  }

  findTranscriptLinesBySceneId(sceneId: number) {
    return this.prisma.transcript_lines.findMany({
      where: { scene_id: sceneId },
      select: { id: true },
    });
  }

  createScene(data: Prisma.scenesUncheckedCreateInput) {
    return this.prisma.scenes.create({ data, include: buildSceneIncludeAll() });
  }

  updateScene(id: number, data: Prisma.scenesUncheckedUpdateInput) {
    return this.prisma.scenes.update({
      where: { id },
      data,
      include: buildSceneIncludeAll(),
    });
  }

  deleteScene(id: number) {
    return this.prisma.scenes.delete({ where: { id } });
  }

  upsertTranscriptLineTranslations(
    locale: string,
    lines: { id: number; translation: string }[],
  ) {
    return this.prisma.$transaction(
      lines.map(({ id: transcript_line_id, translation }) =>
        this.prisma.transcript_line_translations.upsert({
          where: { transcript_line_id_locale: { transcript_line_id, locale } },
          create: { transcript_line_id, locale, translation },
          update: { translation },
        }),
      ),
    );
  }
}
