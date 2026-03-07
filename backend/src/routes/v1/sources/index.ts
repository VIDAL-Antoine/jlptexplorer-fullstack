import type { FastifyInstance } from "fastify";
import { prisma } from "../../../lib/prisma.js";

export async function sourcesRoutes(server: FastifyInstance) {
  server.get("/", async () => {
    return prisma.sources.findMany({
      orderBy: { title: "asc" },
    });
  });

  server.get<{ Params: { slug: string } }>("/:slug", async (request, reply) => {
    const source = await prisma.sources.findUnique({
      where: { slug: request.params.slug },
      include: {
        clips: {
          include: {
            clip_grammar_points: {
              include: { grammar_points: true },
            },
          },
          orderBy: { created_at: "desc" },
        },
      },
    });

    if (!source) {
      return reply.status(404).send({ error: "Source not found" });
    }

    return source;
  });
}
