import { Injectable } from '@nestjs/common';
import { source_type } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSourceDto } from './dto/create-source.dto';
import { UpdateSourceDto } from './dto/update-source.dto';

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
export class SourcesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: { type?: source_type; page: number; limit: number }) {
    const where = {
      scenes: { some: {} },
      ...(query.type ? { type: query.type } : {}),
    };

    const [items, total] = await Promise.all([
      this.prisma.sources.findMany({
        where,
        include: { translations: true },
        orderBy: { slug: 'asc' },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      this.prisma.sources.count({ where }),
    ]);

    return { items, total };
  }

  findBySlug(slug: string) {
    return this.prisma.sources.findUnique({
      where: { slug },
      include: { translations: true },
    });
  }

  async findScenesBySlug(
    sourceId: number,
    query: {
      grammarPointSlugs: string[];
      grammarMatch: 'scene' | 'transcript_line';
      page: number;
      limit: number;
    },
  ) {
    const grammarFilter =
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

    const where = { source_id: sourceId, ...grammarFilter };

    const [items, total, availableGrammarPoints] = await Promise.all([
      this.prisma.scenes.findMany({
        where,
        include: sceneInclude,
        orderBy: [{ episode_number: 'asc' }, { start_time: 'asc' }],
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      this.prisma.scenes.count({ where }),
      this.prisma.grammar_points.findMany({
        where: {
          transcript_line_grammar_points: {
            some: { transcript_lines: { scenes: { source_id: sourceId } } },
          },
        },
        include: { translations: true },
        orderBy: [{ jlpt_level: 'asc' }, { slug: 'asc' }],
      }),
    ]);

    return { items, total, availableGrammarPoints };
  }

  create(dto: CreateSourceDto) {
    return this.prisma.sources.create({
      data: {
        slug: dto.slug,
        type: dto.type,
        cover_image_url: dto.cover_image_url ?? null,
        japanese_title: dto.japanese_title ?? null,
        translations: dto.translations
          ? { create: dto.translations }
          : undefined,
      },
      include: { translations: true },
    });
  }

  update(id: number, dto: UpdateSourceDto) {
    const { translations, ...fields } = dto;
    return this.prisma.sources.update({
      where: { id },
      data: {
        ...fields,
        translations: translations
          ? {
              upsert: translations.map((t) => ({
                where: {
                  source_id_locale: {
                    source_id: id,
                    locale: t.locale,
                  },
                },
                update: { title: t.title },
                create: { locale: t.locale, title: t.title },
              })),
            }
          : undefined,
      },
      include: { translations: true },
    });
  }

  remove(id: number) {
    return this.prisma.sources.delete({ where: { id } });
  }
}
