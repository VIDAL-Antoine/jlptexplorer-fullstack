import type { FastifyInstance } from "fastify";
import { prisma } from "../../../lib/prisma.js";

export async function speakersRoutes(server: FastifyInstance) {
  server.get("/", async () => {
    return prisma.speakers.findMany({ orderBy: { name_english: "asc" } });
  });

  server.get<{ Params: { slug: string } }>("/:slug", async (request, reply) => {
    const speaker = await prisma.speakers.findUnique({
      where: { slug: request.params.slug },
      include: {
        transcript_lines: {
          include: {
            scenes: { include: { sources: true } },
            transcript_line_grammar_points: { include: { grammar_points: true } },
          },
          orderBy: { id: "asc" },
        },
      },
    });

    if (!speaker) {
      return reply.status(404).send({ error: "Speaker not found" });
    }

    return speaker;
  });

  server.post<{
    Body: {
      slug: string;
      name_english: string;
      name_japanese?: string;
      description?: string;
      image_url?: string;
    };
  }>("/", async (request, reply) => {
    const { slug, name_english, name_japanese, description, image_url } = request.body;

    const speaker = await prisma.speakers.create({
      data: { slug, name_english, name_japanese, description, image_url },
    });

    return reply.status(201).send(speaker);
  });

  server.put<{
    Params: { slug: string };
    Body: {
      slug: string;
      name_english: string;
      name_japanese?: string;
      description?: string;
      image_url?: string;
    };
  }>("/:slug", async (request, reply) => {
    const speaker = await prisma.speakers.update({
      where: { slug: request.params.slug },
      data: request.body,
    });

    return reply.status(200).send(speaker);
  });

  server.delete<{ Params: { slug: string } }>("/:slug", async (request, reply) => {
    await prisma.speakers.delete({ where: { slug: request.params.slug } });
    return reply.status(204).send();
  });
}
