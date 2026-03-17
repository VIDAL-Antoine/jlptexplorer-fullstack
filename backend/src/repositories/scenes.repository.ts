import { prisma } from '@/config/prisma';
import type { Prisma } from '@/generated/prisma/client';
import type { jlpt_level } from '@/generated/prisma/enums';

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

export async function findScenes(
  locale: string,
  filters: { source_id?: number; jlpt_level?: jlpt_level },
) {
  return prisma.scenes.findMany({
    where: {
      ...(filters.source_id ? { source_id: filters.source_id } : {}),
      ...(filters.jlpt_level
        ? {
            transcript_lines: {
              some: {
                transcript_line_grammar_points: {
                  some: { grammar_points: { jlpt_level: filters.jlpt_level } },
                },
              },
            },
          }
        : {}),
    },
    include: buildSceneInclude(locale),
    orderBy: [{ episode_number: 'asc' }, { start_time: 'asc' }],
  });
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
