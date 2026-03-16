import type { FastifyInstance } from "fastify";
import { prisma } from "../../../lib/prisma.js";
import { source_type } from "../../../generated/prisma/enums.js";
import { flattenSource, flattenGrammarPoint, flattenScene } from "../../../lib/flatten.js";

export async function sourcesAdminRoutes(server: FastifyInstance) {
  server.post<{
    Body: {
      slug: string;
      japanese_title?: string;
      type: source_type;
      cover_image_url?: string;
      translations: Record<string, string>;
    };
  }>("/", async (request, reply) => {
    const { slug, japanese_title, type, cover_image_url, translations } = request.body;

    const source = await prisma.sources.create({
      data: {
        slug,
        japanese_title,
        type,
        cover_image_url,
        translations: {
          create: Object.entries(translations).map(([locale, title]) => ({ locale, title })),
        },
      },
      include: { translations: true },
    });

    return reply.status(201).send({
      ...source,
      translations: Object.fromEntries(source.translations.map((t) => [t.locale, t.title])),
    });
  });

  server.put<{
    Params: { slug: string };
    Body: {
      slug: string;
      japanese_title?: string;
      type: source_type;
      cover_image_url?: string;
      translations: Record<string, string>;
    };
  }>("/:slug", async (request, reply) => {
    const { slug: paramSlug } = request.params;
    const { slug, japanese_title, type, cover_image_url, translations } = request.body;

    const existing = await prisma.sources.findUnique({ where: { slug: paramSlug }, select: { id: true } });
    if (!existing) return reply.status(404).send({ error: "Source not found" });

    const source = await prisma.sources.update({
      where: { slug: paramSlug },
      data: {
        slug,
        japanese_title,
        type,
        cover_image_url,
        translations: {
          upsert: Object.entries(translations).map(([locale, title]) => ({
            where: { source_id_locale: { source_id: existing.id, locale } },
            create: { locale, title },
            update: { title },
          })),
        },
      },
      include: { translations: true },
    });

    return {
      ...source,
      translations: Object.fromEntries(source.translations.map((t) => [t.locale, t.title])),
    };
  });

  server.delete<{ Params: { slug: string } }>("/:slug", async (request, reply) => {
    await prisma.sources.delete({ where: { slug: request.params.slug } });
    return reply.status(204).send();
  });
}

type LocaleParams = { locale: string };

export async function sourcesRoutes(server: FastifyInstance) {
  server.get<{ Params: LocaleParams; Querystring: { type?: source_type } }>(
    "/",
    {
      schema: {
        querystring: {
          type: "object",
          properties: {
            type: { type: "string", enum: ["game", "anime", "movie", "series", "music"] },
          },
          additionalProperties: false,
        },
      },
    },
    async (request) => {
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
    Querystring: { page?: string; limit?: string; grammar_points?: string };
  }>("/:slug/scenes", async (request, reply) => {
    const { locale, slug } = request.params;
    const page = Math.max(1, parseInt(request.query.page ?? "1") || 1);
    const limit = Math.max(1, Math.min(50, parseInt(request.query.limit ?? "12") || 12));
    const grammarPointSlugs = request.query.grammar_points
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
        orderBy: { start_time: "asc" as const },
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

}
