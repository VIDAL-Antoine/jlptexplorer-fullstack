import type { FastifyInstance } from "fastify";
import { prisma } from "../../../lib/prisma.js";
import { flattenSource, flattenSpeaker, flattenTranscriptLine, flattenGrammarPoint } from "../../../lib/flatten.js";

type LocaleParams = { locale: string };

type TranscriptLineInput = {
  position: number;
  speaker_slug?: string;
  text: string;
  translation?: string;
  grammar_point_slugs?: string[];
};

function parseTime(value: number | string): number {
  if (typeof value === "number") return value;
  const parts = value.split(":").map(Number);
  if (parts.some(isNaN)) throw Object.assign(new Error(`Invalid time format: "${value}"`), { statusCode: 400 });
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  throw Object.assign(new Error(`Invalid time format: "${value}"`), { statusCode: 400 });
}

async function resolveGrammarPointSlugs(lines: TranscriptLineInput[]): Promise<Map<string, number>> {
  const allSlugs = [...new Set(lines.flatMap((l) => l.grammar_point_slugs ?? []))];
  if (!allSlugs.length) return new Map();

  const points = await prisma.grammar_points.findMany({
    where: { slug: { in: allSlugs } },
    select: { id: true, slug: true },
  });

  const missing = allSlugs.filter((s) => !points.find((p) => p.slug === s));
  if (missing.length) {
    throw Object.assign(new Error(`Unknown grammar point slugs: ${missing.join(", ")}`), { statusCode: 400 });
  }

  return new Map(points.map((p) => [p.slug, p.id]));
}

async function resolveSpeakerSlugs(lines: TranscriptLineInput[]): Promise<Map<string, number>> {
  const allSlugs = [...new Set(lines.flatMap((l) => (l.speaker_slug ? [l.speaker_slug] : [])))];
  if (!allSlugs.length) return new Map();

  const speakers = await prisma.speakers.findMany({
    where: { slug: { in: allSlugs } },
    select: { id: true, slug: true },
  });

  const missing = allSlugs.filter((s) => !speakers.find((sp) => sp.slug === s));
  if (missing.length) {
    throw Object.assign(new Error(`Unknown speaker slugs: ${missing.join(", ")}`), { statusCode: 400 });
  }

  return new Map(speakers.map((sp) => [sp.slug, sp.id]));
}

function buildLineData(
  lines: TranscriptLineInput[],
  locale: string,
  grammarSlugToId: Map<string, number>,
  speakerSlugToId: Map<string, number>
) {
  return lines.map(({ grammar_point_slugs, speaker_slug, translation, ...line }) => ({
    ...line,
    ...(speaker_slug ? { speaker_id: speakerSlugToId.get(speaker_slug)! } : {}),
    ...(translation ? { translations: { create: [{ locale, translation }] } } : {}),
    ...(grammar_point_slugs?.length
      ? {
          transcript_line_grammar_points: {
            create: grammar_point_slugs.map((slug) => ({ grammar_point_id: grammarSlugToId.get(slug)! })),
          },
        }
      : {}),
  }));
}

function buildSceneInclude(locale: string) {
  return {
    sources: { include: { translations: { where: { locale } } } },
    transcript_lines: {
      orderBy: { position: "asc" } as const,
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
}

function flattenScene(scene: any) {
  return {
    ...scene,
    sources: flattenSource(scene.sources),
    transcript_lines: scene.transcript_lines.map((line: any) => ({
      ...flattenTranscriptLine(line),
      speakers: line.speakers ? flattenSpeaker(line.speakers) : null,
      transcript_line_grammar_points: line.transcript_line_grammar_points.map((tlgp: any) => ({
        ...tlgp,
        grammar_points: flattenGrammarPoint(tlgp.grammar_points),
      })),
    })),
  };
}

export async function scenesRoutes(server: FastifyInstance) {
  server.get<{ Params: LocaleParams; Querystring: { sourceId?: string; level?: string } }>(
    "/",
    async (request) => {
      const { locale } = request.params;
      const { sourceId, level } = request.query;

      const scenes = await prisma.scenes.findMany({
        where: {
          ...(sourceId ? { source_id: parseInt(sourceId) } : {}),
          ...(level
            ? {
                transcript_lines: {
                  some: {
                    transcript_line_grammar_points: {
                      some: { grammar_points: { jlpt_level: level as any } },
                    },
                  },
                },
              }
            : {}),
        },
        include: buildSceneInclude(locale),
        orderBy: { created_at: "desc" },
      });

      return scenes.map(flattenScene);
    }
  );

  server.get<{ Params: LocaleParams & { id: string } }>("/:id", async (request, reply) => {
    const { locale } = request.params;
    const id = parseInt(request.params.id);

    if (isNaN(id)) {
      return reply.status(400).send({ error: "Invalid scene id" });
    }

    const scene = await prisma.scenes.findUnique({
      where: { id },
      include: buildSceneInclude(locale),
    });

    if (!scene) {
      return reply.status(404).send({ error: "Scene not found" });
    }

    return flattenScene(scene);
  });

  server.post<{
    Params: LocaleParams;
    Body: {
      source_slug: string;
      youtube_video_id: string;
      start_time: number | string;
      end_time: number | string;
      notes?: string;
      transcript_lines: TranscriptLineInput[];
    };
  }>("/", async (request, reply) => {
    const { locale } = request.params;
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
        start_time: parseTime(start_time),
        end_time: parseTime(end_time),
        notes,
        transcript_lines: { create: buildLineData(transcript_lines, locale, grammarSlugToId, speakerSlugToId) },
      },
      include: buildSceneInclude(locale),
    });

    return reply.status(201).send(flattenScene(scene));
  });

  server.put<{
    Params: LocaleParams & { id: string };
    Body: {
      source_slug: string;
      youtube_video_id: string;
      start_time: number | string;
      end_time: number | string;
      notes?: string;
      transcript_lines: TranscriptLineInput[];
    };
  }>("/:id", async (request, reply) => {
    const { locale } = request.params;
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
        start_time: parseTime(start_time),
        end_time: parseTime(end_time),
        notes,
        transcript_lines: {
          deleteMany: {},
          create: buildLineData(transcript_lines, locale, grammarSlugToId, speakerSlugToId),
        },
      },
      include: buildSceneInclude(locale),
    });

    return flattenScene(scene);
  });

  server.patch<{
    Params: LocaleParams & { id: string };
    Body: { transcript_lines: { position: number; translation: string }[] };
  }>("/:id/translations", async (request, reply) => {
    const { locale } = request.params;
    const id = parseInt(request.params.id);

    if (isNaN(id)) {
      return reply.status(400).send({ error: "Invalid scene id" });
    }

    const { transcript_lines } = request.body;

    const lines = await prisma.transcript_lines.findMany({
      where: { scene_id: id },
      select: { id: true, position: true },
    });

    if (!lines.length) {
      return reply.status(404).send({ error: "Scene not found or has no transcript lines" });
    }

    const positionToId = new Map(lines.map((l) => [l.position, l.id]));

    const missing = transcript_lines.filter((l) => !positionToId.has(l.position)).map((l) => l.position);
    if (missing.length) {
      return reply.status(400).send({ error: `Unknown positions: ${missing.join(", ")}` });
    }

    await prisma.$transaction(
      transcript_lines.map(({ position, translation }) =>
        prisma.transcript_line_translations.upsert({
          where: { transcript_line_id_locale: { transcript_line_id: positionToId.get(position)!, locale } },
          create: { transcript_line_id: positionToId.get(position)!, locale, translation },
          update: { translation },
        })
      )
    );

    const scene = await prisma.scenes.findUnique({
      where: { id },
      include: buildSceneInclude(locale),
    });

    return flattenScene(scene);
  });

  server.delete<{ Params: LocaleParams & { id: string } }>("/:id", async (request, reply) => {
    const id = parseInt(request.params.id);

    if (isNaN(id)) {
      return reply.status(400).send({ error: "Invalid scene id" });
    }

    await prisma.scenes.delete({ where: { id } });
    return reply.status(204).send();
  });
}
