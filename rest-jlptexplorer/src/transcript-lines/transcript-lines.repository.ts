import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTranscriptLineDto } from './dto/create-transcript-line.dto';
import { UpdateTranscriptLineDto } from './dto/update-transcript-line.dto';
import { QueryTranscriptLineDto } from './dto/query-transcript-line.dto';

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

    const include = {
      speakers: { include: { translations: true } },
      translations: true,
      transcript_line_grammar_points: {
        include: { grammar_points: { include: { translations: true } } },
      },
    };

    const [items, total] = await Promise.all([
      this.prisma.transcript_lines.findMany({
        where,
        include,
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
      include: {
        speakers: { include: { translations: true } },
        translations: true,
        transcript_line_grammar_points: {
          include: { grammar_points: { include: { translations: true } } },
        },
      },
    });
  }

  create(dto: CreateTranscriptLineDto) {
    return this.prisma.transcript_lines.create({
      data: {
        scene_id: dto.scene_id,
        start_time: dto.start_time ?? null,
        speaker_id: dto.speaker_id ?? null,
        japanese_text: dto.japanese_text,
        translations: dto.translations
          ? { create: dto.translations }
          : undefined,
      },
      include: {
        speakers: { include: { translations: true } },
        translations: true,
        transcript_line_grammar_points: {
          include: { grammar_points: { include: { translations: true } } },
        },
      },
    });
  }

  update(id: number, dto: UpdateTranscriptLineDto) {
    const { translations, ...fields } = dto;
    return this.prisma.transcript_lines.update({
      where: { id },
      data: {
        ...fields,
        translations: translations
          ? { deleteMany: {}, create: translations }
          : undefined,
      },
      include: {
        speakers: { include: { translations: true } },
        translations: true,
        transcript_line_grammar_points: {
          include: { grammar_points: { include: { translations: true } } },
        },
      },
    });
  }

  remove(id: number) {
    return this.prisma.transcript_lines.delete({ where: { id } });
  }
}
