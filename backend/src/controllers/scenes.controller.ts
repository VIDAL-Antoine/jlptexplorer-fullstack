import type { FastifyRequest, FastifyReply } from 'fastify';
import * as scenesService from '@/services/scenes.service';
import type { LocaleParams } from '@/schemas/common.schema';
import type { SceneBody, UpdateTranslationsBody, ListScenesQuery } from '@/schemas/scenes.schema';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 12;

export async function listScenes(
  request: FastifyRequest<{ Params: LocaleParams; Querystring: ListScenesQuery }>,
  _reply: FastifyReply,
) {
  const { locale } = request.params;
  const { sources, grammar_points, page, limit } = request.query;
  return scenesService.listScenes(locale, {
    sourceSlugs: sources ? sources.split(',') : [],
    grammarPointSlugs: grammar_points ? grammar_points.split(',') : [],
    page: page ? parseInt(page, 10) : DEFAULT_PAGE,
    limit: limit ? parseInt(limit, 10) : DEFAULT_LIMIT,
  });
}

export async function getScene(
  request: FastifyRequest<{ Params: LocaleParams & { id: string } }>,
  reply: FastifyReply,
) {
  const id = parseInt(request.params.id, 10);
  if (isNaN(id)) {
    return reply.status(400).send({ error: 'Invalid scene id' });
  }

  const result = await scenesService.getScene(id, request.params.locale);
  if (!result) {
    return reply.status(404).send({ error: 'Scene not found' });
  }
  return result;
}

export async function createScene(
  request: FastifyRequest<{ Body: SceneBody }>,
  reply: FastifyReply,
) {
  const scene = await scenesService.createScene(request.body);
  return reply.status(201).send(scene);
}

export async function updateScene(
  request: FastifyRequest<{ Params: { id: string }; Body: SceneBody }>,
  reply: FastifyReply,
) {
  const id = parseInt(request.params.id, 10);
  if (isNaN(id)) {
    return reply.status(400).send({ error: 'Invalid scene id' });
  }

  return scenesService.updateScene(id, request.body);
}

export async function deleteScene(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const id = parseInt(request.params.id, 10);
  if (isNaN(id)) {
    return reply.status(400).send({ error: 'Invalid scene id' });
  }

  await scenesService.deleteScene(id);
  return reply.status(204).send();
}

export async function updateTranslations(
  request: FastifyRequest<{ Params: LocaleParams & { id: string }; Body: UpdateTranslationsBody }>,
  reply: FastifyReply,
) {
  const id = parseInt(request.params.id, 10);
  if (isNaN(id)) {
    return reply.status(400).send({ error: 'Invalid scene id' });
  }

  const result = await scenesService.updateTranslations(
    id,
    request.params.locale,
    request.body.transcript_lines,
  );
  if (!result) {
    return reply.status(404).send({ error: 'Scene not found or has no transcript lines' });
  }
  return result;
}
