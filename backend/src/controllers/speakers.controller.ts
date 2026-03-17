import type { FastifyRequest, FastifyReply } from 'fastify';
import * as speakersService from '@/services/speakers.service';
import type { LocaleParams } from '@/schemas/common.schema';
import type { SpeakerBody } from '@/schemas/speakers.schema';

export async function listSpeakers(
  request: FastifyRequest<{ Params: LocaleParams }>,
  _reply: FastifyReply,
) {
  return speakersService.listSpeakers(request.params.locale);
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

export async function deleteSpeaker(
  request: FastifyRequest<{ Params: { slug: string } }>,
  reply: FastifyReply,
) {
  await speakersService.deleteSpeaker(request.params.slug);
  return reply.status(204).send();
}
