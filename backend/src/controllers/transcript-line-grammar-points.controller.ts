import type { FastifyRequest, FastifyReply } from 'fastify';
import * as service from '@/services/transcript-line-grammar-points.service.js';
import type {
  TranscriptLineGrammarPointCreateBody,
  TranscriptLineGrammarPointPatchBody,
} from '@/schemas/transcript-line-grammar-points.schema.js';

export async function createTranscriptLineGrammarPoint(
  request: FastifyRequest<{ Body: TranscriptLineGrammarPointCreateBody }>,
  reply: FastifyReply,
) {
  const result = await service.createTranscriptLineGrammarPoint(request.body);
  return reply.status(201).send(result);
}

export async function patchTranscriptLineGrammarPoint(
  request: FastifyRequest<{ Params: { id: string }; Body: TranscriptLineGrammarPointPatchBody }>,
  reply: FastifyReply,
) {
  const id = parseInt(request.params.id, 10);
  if (isNaN(id)) {
    return reply.status(400).send({ error: 'Invalid id' });
  }

  const result = await service.patchTranscriptLineGrammarPoint(id, request.body);
  if (!result) {
    return reply.status(404).send({ error: 'Transcript line grammar point not found' });
  }
  return result;
}

export async function deleteTranscriptLineGrammarPoint(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const id = parseInt(request.params.id, 10);
  if (isNaN(id)) {
    return reply.status(400).send({ error: 'Invalid id' });
  }

  const result = await service.deleteTranscriptLineGrammarPoint(id);
  if (!result) {
    return reply.status(404).send({ error: 'Transcript line grammar point not found' });
  }
  return reply.status(204).send();
}
