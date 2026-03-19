import { prisma } from '@/config/prisma';
import type { Prisma } from '@/generated/prisma/client';

export function buildTranscriptLineInclude(locale: string) {
  return {
    translations: { where: { locale } },
    speakers: { include: { translations: { where: { locale } } } },
    transcript_line_grammar_points: {
      include: {
        grammar_points: { include: { translations: { where: { locale } } } },
      },
    },
  };
}

export function buildTranscriptLineIncludeAll() {
  return {
    translations: true,
    speakers: { include: { translations: true } },
    transcript_line_grammar_points: {
      include: { grammar_points: true },
    },
  };
}

export async function findTranscriptLines(
  locale: string,
  filters: {
    sceneId?: number;
    speakerSlug?: string;
    startTime?: number;
    grammarPointSlugs?: string[];
    page: number;
    limit: number;
  },
) {
  const { sceneId, speakerSlug, startTime, grammarPointSlugs, page, limit } = filters;
  const where = {
    ...(sceneId !== undefined ? { scene_id: sceneId } : {}),
    ...(speakerSlug !== undefined ? { speakers: { slug: speakerSlug } } : {}),
    ...(startTime !== undefined ? { start_time: startTime } : {}),
    ...(grammarPointSlugs?.length
      ? {
          transcript_line_grammar_points: {
            some: { grammar_points: { slug: { in: grammarPointSlugs } } },
          },
        }
      : {}),
  };
  const [lines, total] = await Promise.all([
    prisma.transcript_lines.findMany({
      where,
      orderBy: [{ scene_id: 'asc' }, { start_time: 'asc' }],
      skip: (page - 1) * limit,
      take: limit,
      include: buildTranscriptLineInclude(locale),
    }),
    prisma.transcript_lines.count({ where }),
  ]);
  return { lines, total };
}

export async function findTranscriptLineById(id: number, locale: string) {
  return prisma.transcript_lines.findUnique({
    where: { id },
    include: buildTranscriptLineInclude(locale),
  });
}

export async function findTranscriptLineByIdAll(id: number) {
  return prisma.transcript_lines.findUnique({
    where: { id },
    include: buildTranscriptLineIncludeAll(),
  });
}

export async function createTranscriptLine(data: Prisma.transcript_linesUncheckedCreateInput) {
  return prisma.transcript_lines.create({
    data,
    include: buildTranscriptLineIncludeAll(),
  });
}

export async function updateTranscriptLine(
  id: number,
  data: Prisma.transcript_linesUncheckedUpdateInput,
) {
  return prisma.transcript_lines.update({
    where: { id },
    data,
    include: buildTranscriptLineIncludeAll(),
  });
}

export async function replaceTranscriptLine(
  id: number,
  data: Prisma.transcript_linesUncheckedUpdateInput,
  grammarPoints: Array<{
    grammar_point_id: number;
    start_index?: number;
    end_index?: number;
    matched_form?: string;
  }>,
) {
  return prisma.$transaction(async (tx) => {
    await tx.transcript_line_grammar_points.deleteMany({ where: { transcript_line_id: id } });
    return tx.transcript_lines.update({
      where: { id },
      data: {
        ...data,
        ...(grammarPoints.length
          ? { transcript_line_grammar_points: { create: grammarPoints } }
          : {}),
      },
      include: buildTranscriptLineIncludeAll(),
    });
  });
}

export async function upsertTranscriptLineTranslations(
  id: number,
  translations: Record<string, string>,
) {
  return prisma.$transaction(
    Object.entries(translations).map(([locale, translation]) =>
      prisma.transcript_line_translations.upsert({
        where: { transcript_line_id_locale: { transcript_line_id: id, locale } },
        create: { transcript_line_id: id, locale, translation },
        update: { translation },
      }),
    ),
  );
}

export async function deleteTranscriptLine(id: number) {
  return prisma.transcript_lines.delete({ where: { id } });
}
