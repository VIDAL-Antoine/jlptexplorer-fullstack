import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

const sceneInclude = {
  sources: { include: { translations: true } },
  transcript_lines: {
    include: {
      speakers: { include: { translations: true } },
      translations: true,
      transcript_line_grammar_points: {
        include: { grammar_points: { include: { translations: true } } },
      },
    },
    orderBy: { start_time: 'asc' as const },
  },
};

@Injectable()
export class ScenesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: {
    sourceSlugs: string[];
    grammarPointSlugs: string[];
    grammarMatch: 'scene' | 'transcript_line';
    youtube_video_id?: string;
    start_time?: number;
    end_time?: number;
    page: number;
    limit: number;
  }) {
    const sourceFilter: Prisma.scenesWhereInput =
      query.sourceSlugs.length > 0
        ? { sources: { slug: { in: query.sourceSlugs } } }
        : {};

    const grammarFilter: Prisma.scenesWhereInput =
      query.grammarPointSlugs.length > 0
        ? query.grammarMatch === 'transcript_line'
          ? {
              transcript_lines: {
                some: {
                  AND: query.grammarPointSlugs.map((slug) => ({
                    transcript_line_grammar_points: {
                      some: { grammar_points: { slug } },
                    },
                  })),
                },
              },
            }
          : {
              AND: query.grammarPointSlugs.map((slug) => ({
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
      ...(query.youtube_video_id !== undefined
        ? { youtube_video_id: query.youtube_video_id }
        : {}),
      ...(query.start_time !== undefined
        ? { start_time: query.start_time }
        : {}),
      ...(query.end_time !== undefined ? { end_time: query.end_time } : {}),
    };

    const where: Prisma.scenesWhereInput = {
      ...sourceFilter,
      ...grammarFilter,
      ...exactFilter,
    };

    const [items, total, availableSources, availableGrammarPoints] =
      await Promise.all([
        this.prisma.scenes.findMany({
          where,
          include: sceneInclude,
          orderBy: [{ id: 'desc' }],
          skip: (query.page - 1) * query.limit,
          take: query.limit,
        }),
        this.prisma.scenes.count({ where }),
        // available sources: filtered by grammarFilter only (not sourceFilter) so all options remain visible
        this.prisma.sources.findMany({
          where: { scenes: { some: { ...grammarFilter, ...exactFilter } } },
          include: { translations: true },
          orderBy: { slug: 'asc' },
        }),
        // available grammar points: filtered by sourceFilter only (not grammarFilter) so all options remain visible
        this.prisma.grammar_points.findMany({
          where: {
            transcript_line_grammar_points: {
              some: {
                transcript_lines: {
                  scenes: { ...sourceFilter, ...exactFilter },
                },
              },
            },
          },
          include: { translations: true },
          orderBy: [{ jlpt_level: 'asc' }, { slug: 'asc' }],
        }),
      ]);

    return { items, total, availableSources, availableGrammarPoints };
  }

  findOne(id: number) {
    return this.prisma.scenes.findUnique({
      where: { id },
      include: sceneInclude,
    });
  }

  create(data: {
    source_id: number;
    youtube_video_id: string;
    start_time: number;
    end_time: number;
    episode_number: number;
    notes: string | null;
    transcript_lines: Array<{
      start_time: number | null;
      speaker_id: number | null;
      japanese_text: string;
      translations: Array<{ locale: string; translation: string | null }>;
      grammar_point_annotations: Array<{
        grammar_point_id: number;
        start_index: number | null;
        end_index: number | null;
        matched_form: string | null;
      }>;
    }>;
  }) {
    return this.prisma.scenes.create({
      data: {
        source_id: data.source_id,
        youtube_video_id: data.youtube_video_id,
        start_time: data.start_time,
        end_time: data.end_time,
        episode_number: data.episode_number,
        notes: data.notes,
        transcript_lines: {
          create: data.transcript_lines.map((line) => ({
            start_time: line.start_time,
            speaker_id: line.speaker_id,
            japanese_text: line.japanese_text,
            translations: { create: line.translations },
            transcript_line_grammar_points: {
              create: line.grammar_point_annotations,
            },
          })),
        },
      },
      include: sceneInclude,
    });
  }

  update(
    id: number,
    data: {
      source_id?: number;
      youtube_video_id?: string;
      start_time?: number;
      end_time?: number;
      episode_number?: number;
      notes?: string | null;
      transcript_lines?: Array<{
        start_time: number | null;
        speaker_id: number | null;
        japanese_text: string;
        translations: Array<{ locale: string; translation: string | null }>;
        grammar_point_annotations: Array<{
          grammar_point_id: number;
          start_index: number | null;
          end_index: number | null;
          matched_form: string | null;
        }>;
      }>;
    },
  ) {
    const { transcript_lines, ...fields } = data;
    return this.prisma.scenes.update({
      where: { id },
      data: {
        ...fields,
        transcript_lines: transcript_lines
          ? {
              deleteMany: {},
              create: transcript_lines.map((line) => ({
                start_time: line.start_time,
                speaker_id: line.speaker_id,
                japanese_text: line.japanese_text,
                translations: { create: line.translations },
                transcript_line_grammar_points: {
                  create: line.grammar_point_annotations,
                },
              })),
            }
          : undefined,
      },
      include: sceneInclude,
    });
  }

  remove(id: number) {
    return this.prisma.scenes.delete({ where: { id } });
  }
}
