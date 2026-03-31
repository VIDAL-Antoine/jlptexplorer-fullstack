import type { FastifyRequest, FastifyReply } from 'fastify';
import * as speakersService from '@/services/speakers.service.js';
import type { LocaleParams } from '@/schemas/common.schema.js';
import type { SpeakerBody, SpeakerPatchBody, ListSpeakersQuery } from '@/schemas/speakers.schema.js';

export async function listSpeakers(
  request: FastifyRequest<{ Params: LocaleParams; Querystring: ListSpeakersQuery }>,
  _reply: FastifyReply,
) {
  const page = Math.max(1, parseInt(request.query.page ?? '1', 10) || 1);
  const limit = Math.max(1, Math.min(200, parseInt(request.query.limit ?? '100', 10) || 100));
  return speakersService.listSpeakers(request.params.locale, { slug: request.query.slug, page, limit });
}

export async function getSpeaker(
  request: FastifyRequest<{ Params: LocaleParams & { slug: string } }>,
  reply: FastifyReply,
) {
  const result = await speakersService.getSpeaker(request.params.slug, request.params.locale);
  if (!result) {
    return reply.status(404).send({ error: 'Speaker not found' });
  }
  return result;
}

export async function createSpeaker(
  request: FastifyRequest<{ Body: SpeakerBody }>,
  reply: FastifyReply,
) {
  const speaker = await speakersService.createSpeaker(request.body);
  return reply.status(201).send(speaker);
}

export async function updateSpeaker(
  request: FastifyRequest<{ Params: { slug: string }; Body: SpeakerBody }>,
  reply: FastifyReply,
) {
  const result = await speakersService.updateSpeaker(request.params.slug, request.body);
  if (!result) {
    return reply.status(404).send({ error: 'Speaker not found' });
  }
  return result;
}

export async function patchSpeaker(
  request: FastifyRequest<{ Params: { slug: string }; Body: SpeakerPatchBody }>,
  reply: FastifyReply,
) {
  const result = await speakersService.patchSpeaker(request.params.slug, request.body);
  if (!result) {
    return reply.status(404).send({ error: 'Speaker not found' });
  }
  return result;
}

export async function deleteSpeaker(
  request: FastifyRequest<{ Params: { slug: string } }>,
  reply: FastifyReply,
) {
  await speakersService.deleteSpeaker(request.params.slug);
  return reply.status(204).send();
}
