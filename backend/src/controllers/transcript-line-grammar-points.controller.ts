import type { FastifyRequest, FastifyReply } from 'fastify';
import * as service from '@/services/transcript-line-grammar-points.service.js';
import type {
  TranscriptLineGrammarPointCreateBody,
  TranscriptLineGrammarPointUpdateBody,
  TranscriptLineGrammarPointPatchBody,
  ListTranscriptLineGrammarPointsQuery,
} from '@/schemas/transcript-line-grammar-points.schema.js';

export async function listTranscriptLineGrammarPoints(
  request: FastifyRequest<{ Querystring: ListTranscriptLineGrammarPointsQuery }>,
  _reply: FastifyReply,
) {
  const transcriptLineId = request.query.transcript_line_id
    ? parseInt(request.query.transcript_line_id, 10)
    : undefined;
  return service.listTranscriptLineGrammarPoints({ transcriptLineId });
}

export async function getTranscriptLineGrammarPointById(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const id = parseInt(request.params.id, 10);
  if (isNaN(id)) {
    return reply.status(400).send({ error: 'Invalid id' });
  }
  const result = await service.getTranscriptLineGrammarPointById(id);
  if (!result) {
    return reply.status(404).send({ error: 'Transcript line grammar point not found' });
  }
  return result;
}

export async function createTranscriptLineGrammarPoint(
  request: FastifyRequest<{ Body: TranscriptLineGrammarPointCreateBody }>,
  reply: FastifyReply,
) {
  const result = await service.createTranscriptLineGrammarPoint(request.body);
  return reply.status(201).send(result);
}

export async function updateTranscriptLineGrammarPoint(
  request: FastifyRequest<{ Params: { id: string }; Body: TranscriptLineGrammarPointUpdateBody }>,
  reply: FastifyReply,
) {
  const id = parseInt(request.params.id, 10);
  if (isNaN(id)) {
    return reply.status(400).send({ error: 'Invalid id' });
  }
  const result = await service.updateTranscriptLineGrammarPoint(id, request.body);
  if (!result) {
    return reply.status(404).send({ error: 'Transcript line grammar point not found' });
  }
  return result;
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
