import { prisma } from "@/config/prisma";

export async function findSpeakers(locale: string) {
  return prisma.speakers.findMany({
    include: { translations: { where: { locale } } },
    orderBy: { id: "asc" },
  });
}

export async function findSpeakerBySlug(slug: string, locale: string) {
  return prisma.speakers.findUnique({
    where: { slug },
    include: {
      translations: { where: { locale } },
      transcript_lines: {
        include: {
          scenes: {
            include: { sources: { include: { translations: { where: { locale } } } } },
          },
          transcript_line_grammar_points: {
            include: {
              grammar_points: { include: { translations: { where: { locale } } } },
            },
          },
        },
        orderBy: { id: "asc" },
      },
    },
  });
}

export async function findSpeakerIdBySlug(slug: string) {
  return prisma.speakers.findUnique({ where: { slug }, select: { id: true } });
}

export async function findSpeakersBySlugIn(slugs: string[]) {
  return prisma.speakers.findMany({
    where: { slug: { in: slugs } },
    select: { id: true, slug: true },
  });
}

export async function createSpeaker(data: {
  slug: string;
  name_japanese?: string;
  image_url?: string;
  translations: Record<string, string>;
  descriptions?: Record<string, string>;
}) {
  return prisma.speakers.create({
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

export async function updateSpeaker(
  paramSlug: string,
  speakerId: number,
  data: {
    slug: string;
    name_japanese?: string;
    image_url?: string;
    translations: Record<string, string>;
    descriptions?: Record<string, string>;
  }
) {
  return prisma.speakers.update({
    where: { slug: paramSlug },
    data: {
      slug: data.slug,
      name_japanese: data.name_japanese,
      image_url: data.image_url,
      translations: {
        upsert: Object.entries(data.translations).map(([locale, name]) => ({
          where: { speaker_id_locale: { speaker_id: speakerId, locale } },
          create: { locale, name, description: data.descriptions?.[locale] ?? null },
          update: { name, description: data.descriptions?.[locale] ?? null },
        })),
      },
    },
    include: { translations: true },
  });
}

export async function deleteSpeaker(slug: string) {
  return prisma.speakers.delete({ where: { slug } });
}
