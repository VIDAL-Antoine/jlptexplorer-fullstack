import { Injectable } from '@nestjs/common';
import { jlpt_level } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGrammarPointDto } from './dto/create-grammar-point.dto';
import { UpdateGrammarPointDto } from './dto/update-grammar-point.dto';

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
export class GrammarPointsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: {
    jlpt_level?: jlpt_level;
    search?: string;
    page: number;
    limit: number;
  }) {
    const where = {
      ...(query.jlpt_level ? { jlpt_level: query.jlpt_level } : {}),
      ...(query.search
        ? {
            OR: [
              {
                title: { contains: query.search, mode: 'insensitive' as const },
              },
              {
                romaji: {
                  contains: query.search,
                  mode: 'insensitive' as const,
                },
              },
              {
                translations: {
                  some: {
                    meaning: {
                      contains: query.search,
                      mode: 'insensitive' as const,
                    },
                  },
                },
              },
            ],
          }
        : {}),
    };

    const levelOrder = Object.values(jlpt_level);

    const rawItems = await this.prisma.grammar_points.findMany({
      where,
      include: {
        translations: true,
        _count: { select: { transcript_line_grammar_points: true } },
      },
    });

    const sorted = rawItems
      .map(({ _count, ...gp }) => ({
        ...gp,
        has_scenes: _count.transcript_line_grammar_points > 0,
      }))
      .sort((a, b) => {
        if (a.has_scenes !== b.has_scenes) return a.has_scenes ? -1 : 1;
        const levelDiff = levelOrder.indexOf(a.jlpt_level) - levelOrder.indexOf(b.jlpt_level);
        if (levelDiff !== 0) return levelDiff;
        return a.slug.localeCompare(b.slug);
      });

    const total = sorted.length;
    const items = sorted.slice(
      (query.page - 1) * query.limit,
      query.page * query.limit,
    );

    return { items, total };
  }

  findBySlug(slug: string) {
    return this.prisma.grammar_points.findUnique({
      where: { slug },
      include: { translations: true },
    });
  }

  findManyBySlugs(slugs: string[]) {
    return this.prisma.grammar_points.findMany({
      where: { slug: { in: slugs } },
    });
  }

  async findScenesBySlug(
    slug: string,
    query: { sourceSlugs: string[]; page: number; limit: number },
  ) {
    const baseWhere = {
      transcript_lines: {
        some: {
          transcript_line_grammar_points: {
            some: { grammar_points: { slug } },
          },
        },
      },
    };

    const where = {
      ...baseWhere,
      ...(query.sourceSlugs.length > 0
        ? { sources: { slug: { in: query.sourceSlugs } } }
        : {}),
    };

    const [items, total, availableSources] = await Promise.all([
      this.prisma.scenes.findMany({
        where,
        include: sceneInclude,
        orderBy: [
          { source_id: 'asc' },
          { episode_number: 'asc' },
          { start_time: 'asc' },
        ],
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      this.prisma.scenes.count({ where }),
      this.prisma.sources.findMany({
        where: { scenes: { some: baseWhere } },
        include: { translations: true },
        orderBy: { slug: 'asc' },
      }),
    ]);

    return { items, total, availableSources };
  }

  create(dto: CreateGrammarPointDto) {
    return this.prisma.grammar_points.create({
      data: {
        slug: dto.slug,
        title: dto.title,
        romaji: dto.romaji,
        jlpt_level: dto.jlpt_level,
        translations: dto.translations
          ? { create: dto.translations }
          : undefined,
      },
      include: { translations: true },
    });
  }

  update(id: number, dto: UpdateGrammarPointDto) {
    const { translations, ...fields } = dto;
    return this.prisma.grammar_points.update({
      where: { id },
      data: {
        ...fields,
        translations: translations
          ? { deleteMany: {}, create: translations }
          : undefined,
      },
      include: { translations: true },
    });
  }

  remove(id: number) {
    return this.prisma.grammar_points.delete({ where: { id } });
  }
}
