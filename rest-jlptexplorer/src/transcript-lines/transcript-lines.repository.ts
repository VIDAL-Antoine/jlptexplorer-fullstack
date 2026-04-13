import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

export function buildTranscriptLineInclude(locale: string) {
  return {
    translations: { where: { locale } },
    speakers: { include: { translations: { where: { locale } } } },
    transcript_line_grammar_points: {
      include: {
        grammar_points: { include: { translations: { where: { locale } } } },
      },
    },
    scenes: {
      include: {
        sources: { include: { translations: { where: { locale } } } },
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

@Injectable()
export class TranscriptLinesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findTranscriptLines(
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
    const { sceneId, speakerSlug, startTime, grammarPointSlugs, page, limit } =
      filters;
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
      this.prisma.transcript_lines.findMany({
        where,
        orderBy: [{ scene_id: 'asc' }, { start_time: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
        include: buildTranscriptLineInclude(locale),
      }),
      this.prisma.transcript_lines.count({ where }),
    ]);
    return { lines, total };
  }

  findTranscriptLineById(id: number, locale: string) {
    return this.prisma.transcript_lines.findUnique({
      where: { id },
      include: buildTranscriptLineInclude(locale),
    });
  }

  findTranscriptLineByIdAll(id: number) {
    return this.prisma.transcript_lines.findUnique({
      where: { id },
      include: buildTranscriptLineIncludeAll(),
    });
  }

  createTranscriptLine(data: Prisma.transcript_linesUncheckedCreateInput) {
    return this.prisma.transcript_lines.create({
      data,
      include: buildTranscriptLineIncludeAll(),
    });
  }

  updateTranscriptLine(
    id: number,
    data: Prisma.transcript_linesUncheckedUpdateInput,
  ) {
    return this.prisma.transcript_lines.update({
      where: { id },
      data,
      include: buildTranscriptLineIncludeAll(),
    });
  }

  replaceTranscriptLine(
    id: number,
    data: Prisma.transcript_linesUncheckedUpdateInput,
    grammarPoints: Array<{
      grammar_point_id: number;
      start_index?: number;
      end_index?: number;
      matched_form?: string;
    }>,
  ) {
    return this.prisma.$transaction(async (tx) => {
      await tx.transcript_line_grammar_points.deleteMany({
        where: { transcript_line_id: id },
      });
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

  upsertTranscriptLineTranslations(
    id: number,
    translations: Record<string, string>,
  ) {
    return this.prisma.$transaction(
      Object.entries(translations).map(([locale, translation]) =>
        this.prisma.transcript_line_translations.upsert({
          where: {
            transcript_line_id_locale: { transcript_line_id: id, locale },
          },
          create: { transcript_line_id: id, locale, translation },
          update: { translation },
        }),
      ),
    );
  }

  deleteTranscriptLine(id: number) {
    return this.prisma.transcript_lines.delete({ where: { id } });
  }
}
