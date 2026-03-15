import type { FastifyInstance } from "fastify";
import { prisma } from "../../../lib/prisma.js";
import { jlpt_level } from "../../../generated/prisma/enums.js";
import {
  flattenGrammarPoint,
  flattenScene,
  flattenSource,
} from "../../../lib/flatten.js";

type LocaleParams = { locale: string };

export async function grammarPointsRoutes(server: FastifyInstance) {
  server.get<{
    Params: LocaleParams;
    Querystring: {
      level?: jlpt_level;
      search?: string;
      page?: string;
      limit?: string;
    };
  }>(
    "/",
    {
      schema: {
        querystring: {
          type: "object",
          properties: {
            level: {
              type: "string",
              enum: ["N5", "N4", "N3", "N2", "N1", "Other"],
            },
            search: { type: "string", maxLength: 100 },
            page: { type: "string" },
            limit: { type: "string" },
          },
          additionalProperties: false,
        },
      },
    },
    async (request) => {
      const { locale } = request.params;
      const { level, search } = request.query;
      const page = Math.max(1, parseInt(request.query.page ?? "1") || 1);
      const limit = Math.max(
        1,
        Math.min(500, parseInt(request.query.limit ?? "100") || 100),
      );

      const where = {
        ...(level ? { jlpt_level: level } : {}),
        ...(search
          ? {
              OR: [
                { title: { contains: search, mode: "insensitive" as const } },
                { romaji: { contains: search, mode: "insensitive" as const } },
                {
                  translations: {
                    some: {
                      locale,
                      meaning: {
                        contains: search,
                        mode: "insensitive" as const,
                      },
                    },
                  },
                },
              ],
            }
          : {}),
      };

      const allGrammarPoints = await prisma.grammar_points.findMany({
        where,
        orderBy: [
          { jlpt_level: "asc" },
          { title: "asc" },
        ],
        include: {
          translations: { where: { locale } },
          _count: { select: { transcript_line_grammar_points: true } },
        },
      });

      const mapped = allGrammarPoints.map((gp) => ({
        ...flattenGrammarPoint(gp),
        has_scenes: gp._count.transcript_line_grammar_points > 0,
      }));

      // Stable sort: grammar points with scenes first, then those without
      mapped.sort((a, b) => {
        if (a.has_scenes !== b.has_scenes) return a.has_scenes ? -1 : 1;
        return 0;
      });

      const total = mapped.length;

      return {
        grammar_points: mapped.slice((page - 1) * limit, page * limit),
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    },
  );

  server.get<{ Params: LocaleParams & { slug: string } }>(
    "/:slug",
    async (request, reply) => {
      const { locale, slug } = request.params;

      const grammarPoint = await prisma.grammar_points.findUnique({
        where: { slug },
        include: { translations: { where: { locale } } },
      });

      if (!grammarPoint) {
        return reply.status(404).send({ error: "Grammar point not found" });
      }

      const [scenesCount, availableSources] = await Promise.all([
        prisma.scenes.count({
          where: {
            transcript_lines: {
              some: {
                transcript_line_grammar_points: {
                  some: { grammar_point_id: grammarPoint.id },
                },
              },
            },
          },
        }),
        prisma.sources.findMany({
          where: {
            scenes: {
              some: {
                transcript_lines: {
                  some: {
                    transcript_line_grammar_points: {
                      some: { grammar_point_id: grammarPoint.id },
                    },
                  },
                },
              },
            },
          },
          include: { translations: { where: { locale } } },
          orderBy: { id: "asc" },
        }),
      ]);

      return {
        ...flattenGrammarPoint(grammarPoint),
        scenes_count: scenesCount,
        available_sources: availableSources.map(flattenSource),
      };
    },
  );

  server.get<{
    Params: LocaleParams & { slug: string };
    Querystring: { page?: string; limit?: string; sourceSlugs?: string };
  }>("/:slug/scenes", async (request, reply) => {
    const { locale, slug } = request.params;
    const page = Math.max(1, parseInt(request.query.page ?? "1") || 1);
    const limit = Math.max(
      1,
      Math.min(50, parseInt(request.query.limit ?? "12") || 12),
    );
    const sourceSlugs =
      request.query.sourceSlugs
        ?.split(",")
        .map((s) => s.trim())
        .filter(Boolean) ?? [];

    const grammarPoint = await prisma.grammar_points.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!grammarPoint)
      return reply.status(404).send({ error: "Grammar point not found" });

    const sceneInclude = {
      sources: { include: { translations: { where: { locale } } } },
      transcript_lines: {
        orderBy: { start_time: "asc" as const },
        include: {
          translations: { where: { locale } },
          speakers: { include: { translations: { where: { locale } } } },
          transcript_line_grammar_points: {
            include: {
              grammar_points: {
                include: { translations: { where: { locale } } },
              },
            },
          },
        },
      },
    };

    const where = {
      transcript_lines: {
        some: {
          transcript_line_grammar_points: {
            some: { grammar_point_id: grammarPoint.id },
          },
        },
      },
      ...(sourceSlugs.length > 0 && {
        sources: { slug: { in: sourceSlugs } },
      }),
    };

    const [scenes, total, availableSources] = await Promise.all([
      prisma.scenes.findMany({
        where,
        include: sceneInclude,
        orderBy: [
          { source_id: "asc" },
          { episode_number: "asc" },
          { start_time: "asc" },
        ],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.scenes.count({ where }),
      prisma.sources.findMany({
        where: {
          scenes: {
            some: {
              transcript_lines: {
                some: {
                  transcript_line_grammar_points: {
                    some: { grammar_point_id: grammarPoint.id },
                  },
                },
              },
            },
          },
        },
        include: { translations: { where: { locale } } },
        orderBy: { id: "asc" },
      }),
    ]);

    return {
      scenes: scenes.map(flattenScene),
      total,
      page,
      totalPages: Math.ceil(total / limit),
      available_sources: availableSources.map(flattenSource),
    };
  });

  server.post<{
    Params: LocaleParams;
    Body: {
      slug: string;
      title: string;
      romaji: string;
      meaning: string;
      jlpt_level: jlpt_level;
      notes?: string;
    };
  }>("/", async (request, reply) => {
    const { locale } = request.params;
    const { slug, title, romaji, meaning, jlpt_level, notes } = request.body;

    const grammarPoint = await prisma.grammar_points.create({
      data: {
        slug,
        title,
        romaji,
        jlpt_level,
        translations: { create: { locale, meaning, notes } },
      },
      include: { translations: { where: { locale } } },
    });

    return reply.status(201).send(flattenGrammarPoint(grammarPoint));
  });

  server.put<{
    Params: LocaleParams & { slug: string };
    Body: {
      slug: string;
      title: string;
      romaji: string;
      meaning: string;
      jlpt_level: jlpt_level;
      notes?: string;
    };
  }>("/:slug", async (request, reply) => {
    const { locale, slug: paramSlug } = request.params;
    const { slug, title, romaji, meaning, jlpt_level, notes } = request.body;

    const existing = await prisma.grammar_points.findUnique({
      where: { slug: paramSlug },
      select: { id: true },
    });
    if (!existing)
      return reply.status(404).send({ error: "Grammar point not found" });

    const grammarPoint = await prisma.grammar_points.update({
      where: { slug: paramSlug },
      data: {
        slug,
        title,
        romaji,
        jlpt_level,
        translations: {
          upsert: {
            where: {
              grammar_point_id_locale: {
                grammar_point_id: existing.id,
                locale,
              },
            },
            create: { locale, meaning, notes },
            update: { meaning, notes },
          },
        },
      },
      include: { translations: { where: { locale } } },
    });

    return flattenGrammarPoint(grammarPoint);
  });

  server.delete<{ Params: LocaleParams & { slug: string } }>(
    "/:slug",
    async (request, reply) => {
      await prisma.grammar_points.delete({
        where: { slug: request.params.slug },
      });
      return reply.status(204).send();
    },
  );
}
