import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryTranscriptLineDto } from './dto/query-transcript-line.dto';

type TranscriptLineTranslation = {
  locale: string;
  translation?: string | null;
};

type CreateTranscriptLineData = {
  scene_id: number;
  start_time: number | null;
  speaker_id: number | null;
  japanese_text: string;
  translations?: TranscriptLineTranslation[];
};

type UpdateTranscriptLineData = {
  scene_id?: number;
  start_time?: number | null;
  speaker_id?: number | null;
  japanese_text?: string;
  translations?: TranscriptLineTranslation[];
};

const transcriptLineInclude = {
  speakers: { include: { translations: true } },
  translations: true,
  transcript_line_grammar_points: {
    include: { grammar_points: { include: { translations: true } } },
  },
};

@Injectable()
export class TranscriptLinesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryTranscriptLineDto) {
    const {
      scene_id,
      speaker_slug,
      grammar_points,
      page = 1,
      limit = 20,
    } = query;
    const grammarSlugs = grammar_points
      ? grammar_points
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : undefined;

    const where = {
      ...(scene_id ? { scene_id } : {}),
      ...(speaker_slug ? { speakers: { slug: speaker_slug } } : {}),
      ...(grammarSlugs?.length
        ? {
            transcript_line_grammar_points: {
              some: { grammar_points: { slug: { in: grammarSlugs } } },
            },
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      this.prisma.transcript_lines.findMany({
        where,
        include: transcriptLineInclude,
        orderBy: { id: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.transcript_lines.count({ where }),
    ]);
    return { items, total };
  }

  findOne(id: number) {
    return this.prisma.transcript_lines.findUnique({
      where: { id },
      include: transcriptLineInclude,
    });
  }

  create(data: CreateTranscriptLineData) {
    return this.prisma.transcript_lines.create({
      data: {
        scene_id: data.scene_id,
        start_time: data.start_time,
        speaker_id: data.speaker_id,
        japanese_text: data.japanese_text,
        translations: data.translations
          ? { create: data.translations }
          : undefined,
      },
      include: transcriptLineInclude,
    });
  }

  update(id: number, data: UpdateTranscriptLineData) {
    const { translations, ...fields } = data;
    return this.prisma.transcript_lines.update({
      where: { id },
      data: {
        scene_id: fields.scene_id,
        start_time: fields.start_time,
        speaker_id: fields.speaker_id,
        japanese_text: fields.japanese_text,
        translations: translations
          ? {
              upsert: translations.map((t) => ({
                where: {
                  transcript_line_id_locale: {
                    transcript_line_id: id,
                    locale: t.locale,
                  },
                },
                update: { translation: t.translation },
                create: { locale: t.locale, translation: t.translation },
              })),
            }
          : undefined,
      },
      include: transcriptLineInclude,
    });
  }

  remove(id: number) {
    return this.prisma.transcript_lines.delete({ where: { id } });
  }
}
