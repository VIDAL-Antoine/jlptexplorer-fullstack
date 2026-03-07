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
      include: {
        clip_grammar_points: {
          include: {
            clips: {
              include: { sources: true },
            },
          },
        },
      },
    });

    if (!grammarPoint) {
      return reply.status(404).send({ error: "Grammar point not found" });
    }

    return grammarPoint;
  });
}
