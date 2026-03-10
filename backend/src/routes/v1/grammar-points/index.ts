import type { FastifyInstance } from "fastify";
import { prisma } from "../../../lib/prisma.js";

export async function grammarPointsRoutes(server: FastifyInstance) {
  server.get<{ Querystring: { level?: string } }>("/", async (request) => {
    const { level } = request.query;

    return prisma.grammar_points.findMany({
      where: level ? { jlpt_level: level as any } : undefined,
      orderBy: [{ jlpt_level: "asc" }, { title: "asc" }],
    });
  });

  server.get<{ Params: { slug: string } }>("/:slug", async (request, reply) => {
    const grammarPoint = await prisma.grammar_points.findUnique({
      where: { slug: request.params.slug },
    });

    if (!grammarPoint) {
      return reply.status(404).send({ error: "Grammar point not found" });
    }

    const scenes = await prisma.scenes.findMany({
      where: {
        transcript_lines: {
          some: {
            transcript_line_grammar_points: {
              some: { grammar_point_id: grammarPoint.id },
            },
          },
        },
      },
      include: {
        sources: true,
        transcript_lines: {
          orderBy: { position: "asc" },
          include: {
            transcript_line_grammar_points: {
              where: { grammar_point_id: grammarPoint.id },
            },
          },
        },
      },
      orderBy: { created_at: "desc" },
    });

    return { ...grammarPoint, scenes };
  });

  server.post<{
    Body: {
      slug: string;
      title: string;
      romaji: string;
      meaning: string;
      jlpt_level: string;
      notes?: string;
    };
  }>("/", async (request, reply) => {
    const { slug, title, romaji, meaning, jlpt_level, notes } = request.body;

    const grammarPoint = await prisma.grammar_points.create({
      data: {
        slug,
        title,
        romaji,
        meaning,
        jlpt_level: jlpt_level as any,
        notes,
      },
    });

    return reply.status(201).send(grammarPoint);
  });

  server.put<{
    Params: { slug: string };
    Body: {
      slug: string;
      title: string;
      romaji: string;
      meaning: string;
      jlpt_level: string;
      notes?: string;
    };
  }>("/:slug", async (request) => {
    const { slug, title, romaji, meaning, jlpt_level, notes } = request.body;

    return prisma.grammar_points.update({
      where: { slug: request.params.slug },
      data: {
        slug,
        title,
        romaji,
        meaning,
        jlpt_level: jlpt_level as any,
        notes,
      },
    });
  });

  server.delete<{ Params: { slug: string } }>(
    "/:slug",
    async (request, reply) => {
      await prisma.grammar_points.delete({
        where: { slug: request.params.slug },
      });
      return reply.status(204).send();
    },
  );
}
