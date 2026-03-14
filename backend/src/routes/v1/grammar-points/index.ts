import type { FastifyInstance } from "fastify";
import { prisma } from "../../../lib/prisma.js";
import { jlpt_level } from "../../../generated/prisma/enums.js";
import {
  flattenGrammarPoint,
  flattenSource,
  flattenSpeaker,
  flattenTranscriptLine,
} from "../../../lib/flatten.js";

type LocaleParams = { locale: string };

export async function grammarPointsRoutes(server: FastifyInstance) {
  server.get<{ Params: LocaleParams; Querystring: { level?: jlpt_level } }>(
    "/",
    async (request) => {
      const { locale } = request.params;
      const { level } = request.query;

      const points = await prisma.grammar_points.findMany({
        where: level ? { jlpt_level: level } : undefined,
        orderBy: [{ jlpt_level: "asc" }, { title: "asc" }],
        include: { translations: { where: { locale } } },
      });

      return points.map(flattenGrammarPoint);
    }
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
          sources: { include: { translations: { where: { locale } } } },
          transcript_lines: {
            orderBy: { position: "asc" },
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
        },
        orderBy: { created_at: "desc" },
      });

      return {
        ...flattenGrammarPoint(grammarPoint),
        scenes: scenes.map((scene) => ({
          ...scene,
          sources: flattenSource(scene.sources),
          transcript_lines: scene.transcript_lines.map((line) => ({
            ...flattenTranscriptLine(line),
            speakers: line.speakers ? flattenSpeaker(line.speakers) : null,
            transcript_line_grammar_points: line.transcript_line_grammar_points.map((tlgp) => ({
              ...tlgp,
              grammar_points: flattenGrammarPoint(tlgp.grammar_points),
            })),
          })),
        })),
      };
    }
  );

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
    if (!existing) return reply.status(404).send({ error: "Grammar point not found" });

    const grammarPoint = await prisma.grammar_points.update({
      where: { slug: paramSlug },
      data: {
        slug,
        title,
        romaji,
        jlpt_level,
        translations: {
          upsert: {
            where: { grammar_point_id_locale: { grammar_point_id: existing.id, locale } },
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
      await prisma.grammar_points.delete({ where: { slug: request.params.slug } });
      return reply.status(204).send();
    }
  );
}
