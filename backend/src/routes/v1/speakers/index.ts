import type { FastifyInstance } from "fastify";
import { prisma } from "../../../lib/prisma.js";
import { flattenSpeaker, flattenSource, flattenGrammarPoint } from "../../../lib/flatten.js";

type LocaleParams = { locale: string };

export async function speakersRoutes(server: FastifyInstance) {
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

  server.post<{
    Params: LocaleParams;
    Body: { slug: string; name: string; name_japanese?: string; description?: string; image_url?: string };
  }>("/", async (request, reply) => {
    const { locale } = request.params;
    const { slug, name, name_japanese, description, image_url } = request.body;

    const speaker = await prisma.speakers.create({
      data: {
        slug,
        name_japanese,
        image_url,
        translations: { create: { locale, name, description } },
      },
      include: { translations: { where: { locale } } },
    });

    return reply.status(201).send(flattenSpeaker(speaker));
  });

  server.put<{
    Params: LocaleParams & { slug: string };
    Body: { slug: string; name: string; name_japanese?: string; description?: string; image_url?: string };
  }>("/:slug", async (request, reply) => {
    const { locale, slug: paramSlug } = request.params;
    const { slug, name, name_japanese, description, image_url } = request.body;

    const existing = await prisma.speakers.findUnique({ where: { slug: paramSlug }, select: { id: true } });
    if (!existing) return reply.status(404).send({ error: "Speaker not found" });

    const speaker = await prisma.speakers.update({
      where: { slug: paramSlug },
      data: {
        slug,
        name_japanese,
        image_url,
        translations: {
          upsert: {
            where: { speaker_id_locale: { speaker_id: existing.id, locale } },
            create: { locale, name, description },
            update: { name, description },
          },
        },
      },
      include: { translations: { where: { locale } } },
    });

    return reply.status(200).send(flattenSpeaker(speaker));
  });

  server.delete<{ Params: LocaleParams & { slug: string } }>("/:slug", async (request, reply) => {
    await prisma.speakers.delete({ where: { slug: request.params.slug } });
    return reply.status(204).send();
  });
}
