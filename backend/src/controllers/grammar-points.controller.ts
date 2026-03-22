import type { FastifyRequest, FastifyReply } from 'fastify';
import * as grammarPointsService from '@/services/grammar-points.service';
import type { LocaleParams } from '@/schemas/common.schema';
import type {
  GrammarPointBody,
  GrammarPointPatchBody,
  GrammarPointParams,
  GrammarPointAdminParams,
  ListGrammarPointsQuery,
  GrammarPointScenesQuery,
} from '@/schemas/grammar-points.schema';

export async function listGrammarPoints(
  request: FastifyRequest<{ Params: LocaleParams; Querystring: ListGrammarPointsQuery }>,
  _reply: FastifyReply,
) {
  const { locale } = request.params;
  const { jlpt_level, search } = request.query;
  const page = Math.max(1, parseInt(request.query.page ?? '1', 10) || 1);
  const limit = Math.max(1, Math.min(500, parseInt(request.query.limit ?? '100', 10) || 100));

  return grammarPointsService.listGrammarPoints(locale, { jlpt_level, search }, { page, limit });
}

export async function getGrammarPoint(
  request: FastifyRequest<{ Params: GrammarPointParams }>,
  reply: FastifyReply,
) {
  const result = await grammarPointsService.getGrammarPoint(
    request.params.slug,
    request.params.locale,
  );
  if (!result) {
    return reply.status(404).send({ error: 'Grammar point not found' });
  }
  return result;
}

export async function getGrammarPointScenes(
  request: FastifyRequest<{ Params: GrammarPointParams; Querystring: GrammarPointScenesQuery }>,
  reply: FastifyReply,
) {
  const { locale, slug } = request.params;
  const page = Math.max(1, parseInt(request.query.page ?? '1', 10) || 1);
  const limit = Math.max(1, Math.min(50, parseInt(request.query.limit ?? '12', 10) || 12));
  const sourceSlugs =
    request.query.sources
      ?.split(',')
      .map((s) => s.trim())
      .filter(Boolean) ?? [];

  const result = await grammarPointsService.getGrammarPointScenes(slug, locale, {
    sourceSlugs,
    page,
    limit,
  });
  if (!result) {
    return reply.status(404).send({ error: 'Grammar point not found' });
  }
  return result;
}

export async function createGrammarPoint(
  request: FastifyRequest<{ Body: GrammarPointBody }>,
  reply: FastifyReply,
) {
  const grammarPoint = await grammarPointsService.createGrammarPoint(request.body);
  return reply.status(201).send(grammarPoint);
}

export async function updateGrammarPoint(
  request: FastifyRequest<{ Params: GrammarPointAdminParams; Body: GrammarPointBody }>,
  reply: FastifyReply,
) {
  const result = await grammarPointsService.updateGrammarPoint(request.params.slug, request.body);
  if (!result) {
    return reply.status(404).send({ error: 'Grammar point not found' });
  }
  return result;
}

export async function patchGrammarPoint(
  request: FastifyRequest<{ Params: GrammarPointAdminParams; Body: GrammarPointPatchBody }>,
  reply: FastifyReply,
) {
  const result = await grammarPointsService.patchGrammarPoint(request.params.slug, request.body);
  if (!result) {
    return reply.status(404).send({ error: 'Grammar point not found' });
  }
  return result;
}

export async function deleteGrammarPoint(
  request: FastifyRequest<{ Params: GrammarPointAdminParams }>,
  reply: FastifyReply,
) {
  await grammarPointsService.deleteGrammarPoint(request.params.slug);
  return reply.status(204).send();
}
