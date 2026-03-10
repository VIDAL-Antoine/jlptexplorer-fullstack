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
        scenes: {
          include: {
            transcript_lines: {
              orderBy: { position: "asc" },
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

  server.post<{ Body: { title: string; japanese_title?: string; type: string; cover_image_url?: string; slug: string } }>(
    "/",
    async (request, reply) => {
      const { title, japanese_title, type, cover_image_url, slug } = request.body;

      const source = await prisma.sources.create({
        data: { title, japanese_title, type: type as any, cover_image_url, slug },
      });

      return reply.status(201).send(source);
    }
  );

  server.put<{ Params: { slug: string }; Body: { title: string; japanese_title?: string; type: string; cover_image_url?: string; slug: string } }>(
    "/:slug",
    async (request) => {
      const { title, japanese_title, type, cover_image_url, slug } = request.body;

      return prisma.sources.update({
        where: { slug: request.params.slug },
        data: { title, japanese_title, type: type as any, cover_image_url, slug },
      });
    }
  );

  server.delete<{ Params: { slug: string } }>("/:slug", async (request, reply) => {
    await prisma.sources.delete({ where: { slug: request.params.slug } });
    return reply.status(204).send();
  });
}
