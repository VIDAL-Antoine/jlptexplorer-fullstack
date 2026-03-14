import type { FastifyInstance } from "fastify";
import { prisma } from "../../../lib/prisma.js";
import { source_type } from "../../../generated/prisma/enums.js";
import { flattenSource, flattenGrammarPoint, flattenScene } from "../../../lib/flatten.js";

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
          select: {
            transcript_lines: {
              select: {
                transcript_line_grammar_points: {
                  include: {
                    grammar_points: { include: { translations: { where: { locale } } } },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!source) {
      return reply.status(404).send({ error: "Source not found" });
    }

    const grammarPoints = Array.from(
      new Map(
        source.scenes
          .flatMap((s) => s.transcript_lines)
          .flatMap((l) => l.transcript_line_grammar_points)
          .map((tlgp) => tlgp.grammar_points)
          .filter((gp): gp is NonNullable<typeof gp> => gp !== null)
          .map((gp) => [gp.id, flattenGrammarPoint(gp)])
      ).values()
    );

    const { scenes: _scenes, ...sourceData } = source;
    return {
      ...flattenSource(sourceData as any),
      scenes_count: source.scenes.length,
      grammar_points: grammarPoints,
    };
  });

  server.get<{
    Params: LocaleParams & { slug: string };
    Querystring: { page?: string; limit?: string; grammarPointSlugs?: string };
  }>("/:slug/scenes", async (request, reply) => {
    const { locale, slug } = request.params;
    const page = Math.max(1, parseInt(request.query.page ?? "1") || 1);
    const limit = Math.max(1, Math.min(50, parseInt(request.query.limit ?? "12") || 12));
    const grammarPointSlugs = request.query.grammarPointSlugs
      ?.split(",")
      .map((s) => s.trim())
      .filter(Boolean) ?? [];

    const source = await prisma.sources.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!source) return reply.status(404).send({ error: "Source not found" });

    const sceneInclude = {
      sources: { include: { translations: { where: { locale } } } },
      transcript_lines: {
        orderBy: { position: "asc" as const },
        include: {
          translations: { where: { locale } },
          speakers: { include: { translations: { where: { locale } } } },
          transcript_line_grammar_points: {
            include: {
              grammar_points: { include: { translations: { where: { locale } } } },
            },
          },
        },
      },
    };

    const where = {
      source_id: source.id,
      AND: grammarPointSlugs.map((slug) => ({
        transcript_lines: {
          some: {
            transcript_line_grammar_points: {
              some: { grammar_points: { slug } },
            },
          },
        },
      })),
    };

    const [scenes, total, availableGrammarPoints] = await Promise.all([
      prisma.scenes.findMany({
        where,
        include: sceneInclude,
        orderBy: [{ episode_number: "asc" }, { start_time: "asc" }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.scenes.count({ where }),
      prisma.grammar_points.findMany({
        where: {
          transcript_line_grammar_points: {
            some: { transcript_lines: { scenes: where } },
          },
        },
        include: { translations: { where: { locale } } },
        orderBy: { jlpt_level: "asc" },
      }),
    ]);

    return {
      scenes: scenes.map(flattenScene),
      total,
      page,
      totalPages: Math.ceil(total / limit),
      available_grammar_points: (availableGrammarPoints as any[]).map(flattenGrammarPoint),
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
