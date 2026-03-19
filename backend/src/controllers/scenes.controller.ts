import type { FastifyRequest, FastifyReply } from 'fastify';
import * as scenesService from '@/services/scenes.service';
import type { LocaleParams } from '@/schemas/common.schema';
import type {
  SceneBody,
  ScenePatchBody,
  UpdateTranslationsBody,
  ListScenesQuery,
} from '@/schemas/scenes.schema';

export async function listScenes(
  request: FastifyRequest<{ Params: LocaleParams; Querystring: ListScenesQuery }>,
  _reply: FastifyReply,
) {
  const { locale } = request.params;
  const { sources, grammar_points, youtube_video_id, start_time, end_time } = request.query;
  const page = Math.max(1, parseInt(request.query.page ?? '1', 10) || 1);
  const limit = Math.max(1, Math.min(50, parseInt(request.query.limit ?? '12', 10) || 12));
  return scenesService.listScenes(locale, {
    sourceSlugs: sources ? sources.split(',') : [],
    grammarPointSlugs: grammar_points ? grammar_points.split(',') : [],
    ...(youtube_video_id !== undefined ? { youtube_video_id } : {}),
    ...(start_time !== undefined ? { start_time: parseInt(start_time, 10) } : {}),
    ...(end_time !== undefined ? { end_time: parseInt(end_time, 10) } : {}),
    page,
    limit,
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

export async function patchScene(
  request: FastifyRequest<{ Params: { id: string }; Body: ScenePatchBody }>,
  reply: FastifyReply,
) {
  const id = parseInt(request.params.id, 10);
  if (isNaN(id)) {
    return reply.status(400).send({ error: 'Invalid scene id' });
  }

  const result = await scenesService.patchScene(id, request.body);
  if (!result) {
    return reply.status(404).send({ error: 'Scene not found' });
  }
  return result;
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
