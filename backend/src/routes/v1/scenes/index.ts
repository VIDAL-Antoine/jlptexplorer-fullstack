import type { FastifyInstance } from "fastify";
import { prisma } from "../../../lib/prisma.js";

type TranscriptLineInput = {
  position: number;
  speaker_slug?: string;
  text: string;
  translation?: string;
  grammar_point_slugs?: string[];
};

async function resolveGrammarPointSlugs(
  lines: TranscriptLineInput[]
): Promise<Map<string, number>> {
  const allSlugs = [...new Set(lines.flatMap((l) => l.grammar_point_slugs ?? []))];
  if (!allSlugs.length) return new Map();

  const points = await prisma.grammar_points.findMany({
    where: { slug: { in: allSlugs } },
    select: { id: true, slug: true },
  });

  const missing = allSlugs.filter((s) => !points.find((p) => p.slug === s));
  if (missing.length) {
    throw Object.assign(new Error(`Unknown grammar point slugs: ${missing.join(", ")}`), {
      statusCode: 400,
    });
  }

  return new Map(points.map((p) => [p.slug, p.id]));
}

async function resolveSpeakerSlugs(
  lines: TranscriptLineInput[]
): Promise<Map<string, number>> {
  const allSlugs = [...new Set(lines.flatMap((l) => (l.speaker_slug ? [l.speaker_slug] : [])))];
  if (!allSlugs.length) return new Map();

  const speakers = await prisma.speakers.findMany({
    where: { slug: { in: allSlugs } },
    select: { id: true, slug: true },
  });

  const missing = allSlugs.filter((s) => !speakers.find((sp) => sp.slug === s));
  if (missing.length) {
    throw Object.assign(new Error(`Unknown speaker slugs: ${missing.join(", ")}`), {
      statusCode: 400,
    });
  }

  return new Map(speakers.map((sp) => [sp.slug, sp.id]));
}

function buildLineData(
  lines: TranscriptLineInput[],
  grammarSlugToId: Map<string, number>,
  speakerSlugToId: Map<string, number>
) {
  return lines.map(({ grammar_point_slugs, speaker_slug, ...line }) => ({
    ...line,
    ...(speaker_slug ? { speaker_id: speakerSlugToId.get(speaker_slug)! } : {}),
    ...(grammar_point_slugs?.length
      ? {
          transcript_line_grammar_points: {
            create: grammar_point_slugs.map((slug) => ({ grammar_point_id: grammarSlugToId.get(slug)! })),
          },
        }
      : {}),
  }));
}

export async function scenesRoutes(server: FastifyInstance) {
  server.get<{ Querystring: { sourceId?: string; level?: string } }>(
    "/",
    async (request) => {
      const { sourceId, level } = request.query;

      return prisma.scenes.findMany({
        where: {
          ...(sourceId ? { source_id: parseInt(sourceId) } : {}),
          ...(level
            ? {
                transcript_lines: {
                  some: {
                    transcript_line_grammar_points: {
                      some: {
                        grammar_points: { jlpt_level: level as any },
                      },
                    },
                  },
                },
              }
            : {}),
        },
        include: {
          sources: true,
          transcript_lines: {
            orderBy: { position: "asc" },
            include: {
              transcript_line_grammar_points: {
                include: { grammar_points: true },
              },
            },
          },
        },
        orderBy: { created_at: "desc" },
      });
    }
  );

  server.get<{ Params: { id: string } }>("/:id", async (request, reply) => {
    const id = parseInt(request.params.id);

    if (isNaN(id)) {
      return reply.status(400).send({ error: "Invalid scene id" });
    }

    const scene = await prisma.scenes.findUnique({
      where: { id },
      include: {
        sources: true,
        transcript_lines: {
          orderBy: { position: "asc" },
          include: {
            speakers: true,
            transcript_line_grammar_points: {
              include: { grammar_points: true },
            },
          },
        },
      },
    });

    if (!scene) {
      return reply.status(404).send({ error: "Scene not found" });
    }

    return scene;
  });

  server.post<{
    Body: {
      source_slug: string;
      youtube_video_id: string;
      start_time: number;
      end_time: number;
      notes?: string;
      transcript_lines: TranscriptLineInput[];
    };
  }>("/", async (request, reply) => {
    const { source_slug, youtube_video_id, start_time, end_time, notes, transcript_lines } = request.body;

    const source = await prisma.sources.findUnique({ where: { slug: source_slug }, select: { id: true } });
    if (!source) return reply.status(400).send({ error: `Unknown source slug: ${source_slug}` });

    const [grammarSlugToId, speakerSlugToId] = await Promise.all([
      resolveGrammarPointSlugs(transcript_lines),
      resolveSpeakerSlugs(transcript_lines),
    ]);

    const scene = await prisma.scenes.create({
      data: {
        source_id: source.id,
        youtube_video_id,
        start_time,
        end_time,
        notes,
        transcript_lines: { create: buildLineData(transcript_lines, grammarSlugToId, speakerSlugToId) },
      },
      include: {
        transcript_lines: {
          orderBy: { position: "asc" },
          include: {
            speakers: true,
            transcript_line_grammar_points: {
              include: { grammar_points: true },
            },
          },
        },
      },
    });

    return reply.status(201).send(scene);
  });

  server.put<{
    Params: { id: string };
    Body: {
      source_slug: string;
      youtube_video_id: string;
      start_time: number;
      end_time: number;
      notes?: string;
      transcript_lines: TranscriptLineInput[];
    };
  }>("/:id", async (request, reply) => {
    const id = parseInt(request.params.id);

    if (isNaN(id)) {
      return reply.status(400).send({ error: "Invalid scene id" });
    }

    const { source_slug, youtube_video_id, start_time, end_time, notes, transcript_lines } = request.body;

    const source = await prisma.sources.findUnique({ where: { slug: source_slug }, select: { id: true } });
    if (!source) return reply.status(400).send({ error: `Unknown source slug: ${source_slug}` });

    const [grammarSlugToId, speakerSlugToId] = await Promise.all([
      resolveGrammarPointSlugs(transcript_lines),
      resolveSpeakerSlugs(transcript_lines),
    ]);

    const scene = await prisma.scenes.update({
      where: { id },
      data: {
        source_id: source.id,
        youtube_video_id,
        start_time,
        end_time,
        notes,
        transcript_lines: {
          deleteMany: {},
          create: buildLineData(transcript_lines, grammarSlugToId, speakerSlugToId),
        },
      },
      include: {
        transcript_lines: {
          orderBy: { position: "asc" },
          include: {
            speakers: true,
            transcript_line_grammar_points: {
              include: { grammar_points: true },
            },
          },
        },
      },
    });

    return scene;
  });

  server.delete<{ Params: { id: string } }>("/:id", async (request, reply) => {
    const id = parseInt(request.params.id);

    if (isNaN(id)) {
      return reply.status(400).send({ error: "Invalid scene id" });
    }

    await prisma.scenes.delete({ where: { id } });
    return reply.status(204).send();
  });
}
