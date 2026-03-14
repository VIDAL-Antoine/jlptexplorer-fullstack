import type { FastifyInstance } from "fastify";
import { prisma } from "../../../lib/prisma.js";
import { source_type } from "../../../generated/prisma/enums.js";
import { flattenSource, flattenSpeaker, flattenTranscriptLine, flattenGrammarPoint } from "../../../lib/flatten.js";

type LocaleParams = { locale: string };

export async function sourcesRoutes(server: FastifyInstance) {
  server.get<{ Params: LocaleParams; Querystring: { type?: source_type } }>("/", async (request) => {
    const { locale } = request.params;
    const { type } = request.query;

    const sources = await prisma.sources.findMany({
      where: type ? { type } : undefined,
      include: { translations: { where: { locale } } },
      orderBy: { id: "asc" },
    });

    return sources.map(flattenSource);
  });

  server.get<{ Params: LocaleParams & { slug: string } }>("/:slug", async (request, reply) => {
    const { locale, slug } = request.params;

    const source = await prisma.sources.findUnique({
      where: { slug },
      include: {
        translations: { where: { locale } },
        scenes: {
          include: {
            sources: { include: { translations: { where: { locale } } } },
            transcript_lines: {
              include: {
                translations: { where: { locale } },
                speakers: { include: { translations: { where: { locale } } } },
                transcript_line_grammar_points: {
                  include: {
                    grammar_points: { include: { translations: { where: { locale } } } },
                  },
                },
              },
              orderBy: { position: "asc" },
            },
          },
          orderBy: [{ episode_number: "asc" }, { start_time: "asc" }],
        },
      },
    });

    if (!source) {
      return reply.status(404).send({ error: "Source not found" });
    }

    return {
      ...flattenSource(source),
      scenes: source.scenes.map((scene) => ({
        ...scene,
        sources: flattenSource(scene.sources),
        transcript_lines: scene.transcript_lines.map((line) => ({
          ...flattenTranscriptLine(line),
          speakers: line.speakers ? flattenSpeaker(line.speakers) : null,
          transcript_line_grammar_points: line.transcript_line_grammar_points.map((tlgp) => ({
            ...tlgp,
            grammar_points: flattenGrammarPoint(tlgp.grammar_points),
          })),
        })),
      })),
    };
  });

  server.post<{
    Params: LocaleParams;
    Body: { title: string; japanese_title?: string; type: source_type; cover_image_url?: string; slug: string };
  }>("/", async (request, reply) => {
    const { locale } = request.params;
    const { title, japanese_title, type, cover_image_url, slug } = request.body;

    const source = await prisma.sources.create({
      data: {
        japanese_title,
        type,
        cover_image_url,
        slug,
        translations: { create: { locale, title } },
      },
      include: { translations: { where: { locale } } },
    });

    return reply.status(201).send(flattenSource(source));
  });

  server.put<{
    Params: LocaleParams & { slug: string };
    Body: { title: string; japanese_title?: string; type: source_type; cover_image_url?: string; slug: string };
  }>("/:slug", async (request, reply) => {
    const { locale, slug: paramSlug } = request.params;
    const { title, japanese_title, type, cover_image_url, slug } = request.body;

    const existing = await prisma.sources.findUnique({ where: { slug: paramSlug }, select: { id: true } });
    if (!existing) return reply.status(404).send({ error: "Source not found" });

    const source = await prisma.sources.update({
      where: { slug: paramSlug },
      data: {
        japanese_title,
        type,
        cover_image_url,
        slug,
        translations: {
          upsert: {
            where: { source_id_locale: { source_id: existing.id, locale } },
            create: { locale, title },
            update: { title },
          },
        },
      },
      include: { translations: { where: { locale } } },
    });

    return flattenSource(source);
  });

  server.delete<{ Params: LocaleParams & { slug: string } }>("/:slug", async (request, reply) => {
    await prisma.sources.delete({ where: { slug: request.params.slug } });
    return reply.status(204).send();
  });
}
