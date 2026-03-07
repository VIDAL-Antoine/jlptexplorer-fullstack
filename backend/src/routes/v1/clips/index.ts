import type { FastifyInstance } from "fastify";
import { prisma } from "../../../lib/prisma.js";

export async function clipsRoutes(server: FastifyInstance) {
  server.get<{ Querystring: { sourceId?: string; level?: string } }>(
    "/",
    async (request) => {
      const { sourceId, level } = request.query;

      return prisma.clips.findMany({
        where: {
          ...(sourceId ? { source_id: parseInt(sourceId) } : {}),
          ...(level
            ? {
                clip_grammar_points: {
                  some: {
                    grammar_points: { jlpt_level: level as any },
                  },
                },
              }
            : {}),
        },
        include: {
          sources: true,
          clip_grammar_points: {
            include: { grammar_points: true },
          },
        },
        orderBy: { created_at: "desc" },
      });
    }
  );

  server.get<{ Params: { id: string } }>("/:id", async (request, reply) => {
    const id = parseInt(request.params.id);

    if (isNaN(id)) {
      return reply.status(400).send({ error: "Invalid clip id" });
    }

    const clip = await prisma.clips.findUnique({
      where: { id },
      include: {
        sources: true,
        clip_grammar_points: {
          include: { grammar_points: true },
        },
      },
    });

    if (!clip) {
      return reply.status(404).send({ error: "Clip not found" });
    }

    return clip;
  });
}
