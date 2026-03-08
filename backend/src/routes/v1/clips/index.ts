import type { FastifyInstance } from "fastify";
import { prisma } from "../../../lib/prisma.js";

type TranscriptLineInput = {
  position: number;
  speaker?: string;
  text: string;
  translation?: string;
};

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
          transcript_lines: {
            orderBy: { position: "asc" },
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
        transcript_lines: {
          orderBy: { position: "asc" },
        },
      },
    });

    if (!clip) {
      return reply.status(404).send({ error: "Clip not found" });
    }

    return clip;
  });

  server.post<{
    Body: {
      source_id: number;
      youtube_video_id: string;
      start_time: number;
      end_time: number;
      notes?: string;
      transcript_lines: TranscriptLineInput[];
    };
  }>("/", async (request, reply) => {
    const { source_id, youtube_video_id, start_time, end_time, notes, transcript_lines } = request.body;

    const clip = await prisma.clips.create({
      data: {
        source_id,
        youtube_video_id,
        start_time,
        end_time,
        notes,
        transcript_lines: {
          create: transcript_lines,
        },
      },
      include: {
        transcript_lines: { orderBy: { position: "asc" } },
      },
    });

    return reply.status(201).send(clip);
  });

  server.put<{
    Params: { id: string };
    Body: {
      source_id: number;
      youtube_video_id: string;
      start_time: number;
      end_time: number;
      notes?: string;
      transcript_lines: TranscriptLineInput[];
    };
  }>("/:id", async (request, reply) => {
    const id = parseInt(request.params.id);

    if (isNaN(id)) {
      return reply.status(400).send({ error: "Invalid clip id" });
    }

    const { source_id, youtube_video_id, start_time, end_time, notes, transcript_lines } = request.body;

    const clip = await prisma.clips.update({
      where: { id },
      data: {
        source_id,
        youtube_video_id,
        start_time,
        end_time,
        notes,
        transcript_lines: {
          deleteMany: {},
          create: transcript_lines,
        },
      },
      include: {
        transcript_lines: { orderBy: { position: "asc" } },
      },
    });

    return clip;
  });

  server.delete<{ Params: { id: string } }>("/:id", async (request, reply) => {
    const id = parseInt(request.params.id);

    if (isNaN(id)) {
      return reply.status(400).send({ error: "Invalid clip id" });
    }

    await prisma.clips.delete({ where: { id } });
    return reply.status(204).send();
  });
}
