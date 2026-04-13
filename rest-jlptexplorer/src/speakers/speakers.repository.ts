import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SpeakersRepository {
  constructor(private readonly prisma: PrismaService) {}

  findSpeakers(locale: string) {
    return this.prisma.speakers.findMany({
      include: { translations: { where: { locale } } },
      orderBy: { id: 'asc' },
    });
  }

  findSpeakerBySlug(slug: string, locale: string) {
    return this.prisma.speakers.findUnique({
      where: { slug },
      include: {
        translations: { where: { locale } },
        transcript_lines: {
          include: {
            scenes: {
              include: {
                sources: { include: { translations: { where: { locale } } } },
              },
            },
            transcript_line_grammar_points: {
              include: {
                grammar_points: {
                  include: { translations: { where: { locale } } },
                },
              },
            },
          },
          orderBy: { id: 'asc' },
        },
      },
    });
  }

  findSpeakersBySlugIn(slugs: string[]) {
    return this.prisma.speakers.findMany({
      where: { slug: { in: slugs } },
      select: { id: true, slug: true },
    });
  }

  createSpeaker(data: {
    slug: string;
    name_japanese?: string;
    image_url?: string;
    translations: Record<string, string>;
    descriptions?: Record<string, string>;
  }) {
    return this.prisma.speakers.create({
      data: {
        slug: data.slug,
        name_japanese: data.name_japanese,
        image_url: data.image_url,
        translations: {
          create: Object.entries(data.translations).map(([locale, name]) => ({
            locale,
            name,
            description: data.descriptions?.[locale] ?? null,
          })),
        },
      },
      include: { translations: true },
    });
  }

  updateSpeaker(
    paramSlug: string,
    speakerId: number,
    data: {
      slug: string;
      name_japanese?: string;
      image_url?: string;
      translations: Record<string, string>;
      descriptions?: Record<string, string>;
    },
  ) {
    return this.prisma.speakers.update({
      where: { slug: paramSlug },
      data: {
        slug: data.slug,
        name_japanese: data.name_japanese,
        image_url: data.image_url,
        translations: {
          upsert: Object.entries(data.translations).map(([locale, name]) => ({
            where: { speaker_id_locale: { speaker_id: speakerId, locale } },
            create: {
              locale,
              name,
              description: data.descriptions?.[locale] ?? null,
            },
            update: { name, description: data.descriptions?.[locale] ?? null },
          })),
        },
      },
      include: { translations: true },
    });
  }

  patchSpeaker(
    paramSlug: string,
    speakerId: number,
    data: {
      slug?: string;
      name_japanese?: string;
      image_url?: string;
      translations?: Record<string, string>;
      descriptions?: Record<string, string>;
    },
  ) {
    return this.prisma.speakers.update({
      where: { slug: paramSlug },
      data: {
        ...(data.slug !== undefined ? { slug: data.slug } : {}),
        ...(data.name_japanese !== undefined
          ? { name_japanese: data.name_japanese }
          : {}),
        ...(data.image_url !== undefined ? { image_url: data.image_url } : {}),
        ...(data.translations
          ? {
              translations: {
                upsert: Object.entries(data.translations).map(
                  ([locale, name]) => ({
                    where: {
                      speaker_id_locale: { speaker_id: speakerId, locale },
                    },
                    create: {
                      locale,
                      name,
                      description: data.descriptions?.[locale] ?? null,
                    },
                    update: {
                      name,
                      ...(data.descriptions?.[locale] !== undefined
                        ? { description: data.descriptions[locale] }
                        : {}),
                    },
                  }),
                ),
              },
            }
          : {}),
      },
      include: { translations: true },
    });
  }

  deleteSpeaker(slug: string) {
    return this.prisma.speakers.delete({ where: { slug } });
  }
}
