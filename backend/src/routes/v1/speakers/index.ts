import type { FastifyInstance } from "fastify";
import { prisma } from "../../../lib/prisma.js";
import { flattenSpeaker, flattenSource, flattenGrammarPoint } from "../../../lib/flatten.js";

type LocaleParams = { locale: string };

export async function speakersLocaleRoutes(server: FastifyInstance) {
  server.get<{ Params: LocaleParams }>("/", async (request) => {
    const { locale } = request.params;

    const speakers = await prisma.speakers.findMany({
      include: { translations: { where: { locale } } },
      orderBy: { id: "asc" },
    });

    return speakers.map(flattenSpeaker);
  });

  server.get<{ Params: LocaleParams & { slug: string } }>("/:slug", async (request, reply) => {
    const { locale, slug } = request.params;

    const speaker = await prisma.speakers.findUnique({
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

    if (!speaker) {
      return reply.status(404).send({ error: "Speaker not found" });
    }

    return {
      ...flattenSpeaker(speaker),
      transcript_lines: speaker.transcript_lines.map((line) => ({
        ...line,
        scenes: {
          ...line.scenes,
          sources: flattenSource(line.scenes.sources),
        },
        transcript_line_grammar_points: line.transcript_line_grammar_points.map((tlgp) => ({
          ...tlgp,
          grammar_points: flattenGrammarPoint(tlgp.grammar_points),
        })),
      })),
    };
  });
}

export async function speakersAdminRoutes(server: FastifyInstance) {
  server.post<{
    Body: {
      slug: string;
      name_japanese?: string;
      image_url?: string;
      translations: Record<string, string>;
      descriptions?: Record<string, string>;
    };
  }>("/", async (request, reply) => {
    const { slug, name_japanese, image_url, translations, descriptions } = request.body;

    const speaker = await prisma.speakers.create({
      data: {
        slug,
        name_japanese,
        image_url,
        translations: {
          create: Object.entries(translations).map(([locale, name]) => ({
            locale,
            name,
            description: descriptions?.[locale] ?? null,
          })),
        },
      },
      include: { translations: true },
    });

    return reply.status(201).send({
      ...speaker,
      translations: Object.fromEntries(
        speaker.translations.map((t) => [t.locale, { name: t.name, description: t.description }])
      ),
    });
  });

  server.put<{
    Params: { slug: string };
    Body: {
      slug: string;
      name_japanese?: string;
      image_url?: string;
      translations: Record<string, string>;
      descriptions?: Record<string, string>;
    };
  }>("/:slug", async (request, reply) => {
    const { slug: paramSlug } = request.params;
    const { slug, name_japanese, image_url, translations, descriptions } = request.body;

    const existing = await prisma.speakers.findUnique({
      where: { slug: paramSlug },
      select: { id: true },
    });
    if (!existing) return reply.status(404).send({ error: "Speaker not found" });

    const speaker = await prisma.speakers.update({
      where: { slug: paramSlug },
      data: {
        slug,
        name_japanese,
        image_url,
        translations: {
          upsert: Object.entries(translations).map(([locale, name]) => ({
            where: { speaker_id_locale: { speaker_id: existing.id, locale } },
            create: { locale, name, description: descriptions?.[locale] ?? null },
            update: { name, description: descriptions?.[locale] ?? null },
          })),
        },
      },
      include: { translations: true },
    });

    return {
      ...speaker,
      translations: Object.fromEntries(
        speaker.translations.map((t) => [t.locale, { name: t.name, description: t.description }])
      ),
    };
  });

  server.delete<{ Params: { slug: string } }>("/:slug", async (request, reply) => {
    await prisma.speakers.delete({ where: { slug: request.params.slug } });
    return reply.status(204).send();
  });
}
