import { prisma } from '@/config/prisma';
import type { Prisma } from '@/generated/prisma/client';

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
            grammar_points: { include: { translations: { where: { locale } } } },
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

export async function findScenesPage(
  locale: string,
  options: {
    sourceSlugs: string[];
    grammarPointSlugs: string[];
    youtube_video_id?: string;
    start_time?: number;
    end_time?: number;
    page: number;
    limit: number;
  },
) {
  const { sourceSlugs, grammarPointSlugs, youtube_video_id, start_time, end_time, page, limit } =
    options;

  const sourceFilter: Prisma.scenesWhereInput =
    sourceSlugs.length > 0 ? { sources: { slug: { in: sourceSlugs } } } : {};

  const grammarFilter: Prisma.scenesWhereInput =
    grammarPointSlugs.length > 0
      ? {
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

  const where: Prisma.scenesWhereInput = { ...sourceFilter, ...grammarFilter, ...exactFilter };

  const [scenes, total, availableSources, availableGrammarPoints] = await Promise.all([
    prisma.scenes.findMany({
      where,
      include: buildSceneInclude(locale),
      orderBy: [{ source_id: 'asc' }, { episode_number: 'asc' }, { start_time: 'asc' }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.scenes.count({ where }),
    // available_sources filtered only by grammarFilter (not sourceFilter) so all source options remain selectable
    prisma.sources.findMany({
      where: { scenes: { some: grammarFilter } },
      include: { translations: { where: { locale } } },
      orderBy: { id: 'asc' },
    }),
    // available_grammar_points filtered only by sourceFilter (not grammarFilter) so all grammar options remain selectable
    prisma.grammar_points.findMany({
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

export async function findSceneById(id: number, locale: string) {
  return prisma.scenes.findUnique({
    where: { id },
    include: buildSceneInclude(locale),
  });
}

export async function findSceneByIdAll(id: number) {
  return prisma.scenes.findUnique({
    where: { id },
    include: buildSceneIncludeAll(),
  });
}

export async function findTranscriptLinesBySceneId(sceneId: number) {
  return prisma.transcript_lines.findMany({
    where: { scene_id: sceneId },
    select: { id: true },
  });
}

export async function createScene(data: Prisma.scenesUncheckedCreateInput) {
  return prisma.scenes.create({ data, include: buildSceneIncludeAll() });
}

export async function updateScene(id: number, data: Prisma.scenesUncheckedUpdateInput) {
  return prisma.scenes.update({ where: { id }, data, include: buildSceneIncludeAll() });
}

export async function deleteScene(id: number) {
  return prisma.scenes.delete({ where: { id } });
}

export async function upsertTranscriptLineTranslations(
  locale: string,
  lines: { id: number; translation: string }[],
) {
  return prisma.$transaction(
    lines.map(({ id: transcript_line_id, translation }) =>
      prisma.transcript_line_translations.upsert({
        where: { transcript_line_id_locale: { transcript_line_id, locale } },
        create: { transcript_line_id, locale, translation },
        update: { translation },
      }),
    ),
  );
}
