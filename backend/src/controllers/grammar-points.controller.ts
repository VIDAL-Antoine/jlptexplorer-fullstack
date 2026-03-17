import type { FastifyRequest, FastifyReply } from "fastify";
import * as grammarPointsService from "@/services/grammar-points.service";
import type { jlpt_level } from "@/generated/prisma/enums";
import type { LocaleParams } from "@/types/common";

export async function listGrammarPoints(
  request: FastifyRequest<{
    Params: LocaleParams;
    Querystring: { jlpt_level?: jlpt_level; search?: string; page?: string; limit?: string };
  }>,
  _reply: FastifyReply
) {
  const { locale } = request.params;
  const { jlpt_level, search } = request.query;
  const page = Math.max(1, parseInt(request.query.page ?? "1", 10) || 1);
  const limit = Math.max(1, Math.min(500, parseInt(request.query.limit ?? "100", 10) || 100));

  return grammarPointsService.listGrammarPoints(locale, { jlpt_level, search }, { page, limit });
}

export async function getGrammarPoint(
  request: FastifyRequest<{ Params: LocaleParams & { slug: string } }>,
  reply: FastifyReply
) {
  const result = await grammarPointsService.getGrammarPoint(
    request.params.slug,
    request.params.locale
  );
  if (!result) {return reply.status(404).send({ error: "Grammar point not found" });}
  return result;
}

export async function getGrammarPointScenes(
  request: FastifyRequest<{
    Params: LocaleParams & { slug: string };
    Querystring: { page?: string; limit?: string; sources?: string };
  }>,
  reply: FastifyReply
) {
  const { locale, slug } = request.params;
  const page = Math.max(1, parseInt(request.query.page ?? "1", 10) || 1);
  const limit = Math.max(1, Math.min(50, parseInt(request.query.limit ?? "12", 10) || 12));
  const sourceSlugs =
    request.query.sources?.split(",").map((s) => s.trim()).filter(Boolean) ?? [];

  const result = await grammarPointsService.getGrammarPointScenes(slug, locale, {
    sourceSlugs,
    page,
    limit,
  });
  if (!result) {return reply.status(404).send({ error: "Grammar point not found" });}
  return result;
}

export async function createGrammarPoint(
  request: FastifyRequest<{
    Params: LocaleParams;
    Body: {
      slug: string;
      title: string;
      romaji: string;
      meaning: string;
      jlpt_level: jlpt_level;
      notes?: string;
    };
  }>,
  reply: FastifyReply
) {
  const grammarPoint = await grammarPointsService.createGrammarPoint(
    request.params.locale,
    request.body
  );
  return reply.status(201).send(grammarPoint);
}

export async function updateGrammarPoint(
  request: FastifyRequest<{
    Params: LocaleParams & { slug: string };
    Body: {
      slug: string;
      title: string;
      romaji: string;
      meaning: string;
      jlpt_level: jlpt_level;
      notes?: string;
    };
  }>,
  reply: FastifyReply
) {
  const result = await grammarPointsService.updateGrammarPoint(
    request.params.locale,
    request.params.slug,
    request.body
  );
  if (!result) {return reply.status(404).send({ error: "Grammar point not found" });}
  return result;
}

export async function deleteGrammarPoint(
  request: FastifyRequest<{ Params: LocaleParams & { slug: string } }>,
  reply: FastifyReply
) {
  await grammarPointsService.deleteGrammarPoint(request.params.slug);
  return reply.status(204).send();
}
