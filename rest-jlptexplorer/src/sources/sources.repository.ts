import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { source_type } from '@prisma/client';
import { buildSceneInclude } from '../scenes/scenes.repository';

@Injectable()
export class SourcesRepository {
  constructor(private readonly prisma: PrismaService) {}

  findSources(locale: string) {
    return this.prisma.sources.findMany({
      where: { scenes: { some: {} } },
      include: { translations: { where: { locale } } },
      orderBy: { id: 'asc' },
    });
  }

  findSourceBySlug(slug: string, locale: string) {
    return this.prisma.sources.findUnique({
      where: { slug },
      include: { translations: { where: { locale } } },
    });
  }

  async findSourceMeta(sourceId: number, locale: string) {
    const [scenesCount, grammarPoints] = await Promise.all([
      this.prisma.scenes.count({ where: { source_id: sourceId } }),
      this.prisma.grammar_points.findMany({
        where: {
          transcript_line_grammar_points: {
            some: { transcript_lines: { scenes: { source_id: sourceId } } },
          },
        },
        include: { translations: { where: { locale } } },
        orderBy: [{ jlpt_level: 'asc' }, { title: 'asc' }],
      }),
    ]);
    return { scenesCount, grammarPoints };
  }

  async findSourceScenes(
    sourceId: number,
    locale: string,
    options: {
      grammarPointSlugs: string[];
      grammarMatch: 'scene' | 'transcript_line';
      page: number;
      limit: number;
    },
  ) {
    const { grammarPointSlugs, grammarMatch, page, limit } = options;

    const grammarFilter =
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

    const where = { source_id: sourceId, ...grammarFilter };

    const [scenes, total, availableGrammarPoints] = await Promise.all([
      this.prisma.scenes.findMany({
        where,
        include: buildSceneInclude(locale),
        orderBy: [{ episode_number: 'asc' }, { start_time: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.scenes.count({ where }),
      this.prisma.grammar_points.findMany({
        where: {
          transcript_line_grammar_points: {
            some: { transcript_lines: { scenes: where } },
          },
        },
        include: { translations: { where: { locale } } },
        orderBy: [{ jlpt_level: 'asc' }, { title: 'asc' }],
      }),
    ]);

    return { scenes, total, availableGrammarPoints };
  }

  createSource(data: {
    slug: string;
    japanese_title?: string;
    type: source_type;
    cover_image_url?: string;
    translations: Record<string, string>;
  }) {
    return this.prisma.sources.create({
      data: {
        slug: data.slug,
        japanese_title: data.japanese_title,
        type: data.type,
        cover_image_url: data.cover_image_url,
        translations: {
          create: Object.entries(data.translations).map(([locale, title]) => ({
            locale,
            title,
          })),
        },
      },
      include: { translations: true },
    });
  }

  updateSource(
    paramSlug: string,
    sourceId: number,
    data: {
      slug: string;
      japanese_title?: string;
      type: source_type;
      cover_image_url?: string;
      translations: Record<string, string>;
    },
  ) {
    return this.prisma.sources.update({
      where: { slug: paramSlug },
      data: {
        slug: data.slug,
        japanese_title: data.japanese_title,
        type: data.type,
        cover_image_url: data.cover_image_url,
        translations: {
          upsert: Object.entries(data.translations).map(([locale, title]) => ({
            where: { source_id_locale: { source_id: sourceId, locale } },
            create: { locale, title },
            update: { title },
          })),
        },
      },
      include: { translations: true },
    });
  }

  patchSource(
    paramSlug: string,
    sourceId: number,
    data: {
      slug?: string;
      japanese_title?: string;
      type?: source_type;
      cover_image_url?: string;
      translations?: Record<string, string>;
    },
  ) {
    return this.prisma.sources.update({
      where: { slug: paramSlug },
      data: {
        ...(data.slug !== undefined ? { slug: data.slug } : {}),
        ...(data.japanese_title !== undefined
          ? { japanese_title: data.japanese_title }
          : {}),
        ...(data.type !== undefined ? { type: data.type } : {}),
        ...(data.cover_image_url !== undefined
          ? { cover_image_url: data.cover_image_url }
          : {}),
        ...(data.translations
          ? {
              translations: {
                upsert: Object.entries(data.translations).map(
                  ([locale, title]) => ({
                    where: {
                      source_id_locale: { source_id: sourceId, locale },
                    },
                    create: { locale, title },
                    update: { title },
                  }),
                ),
              },
            }
          : {}),
      },
      include: { translations: true },
    });
  }

  deleteSource(slug: string) {
    return this.prisma.sources.delete({ where: { slug } });
  }
}
