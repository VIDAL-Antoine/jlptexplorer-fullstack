import type { FastifyRequest, FastifyReply } from 'fastify';
import * as service from '@/services/transcript-line-grammar-points.service';
import type {
  TranscriptLineGrammarPointCreateBody,
  TranscriptLineGrammarPointPatchBody,
} from '@/schemas/transcript-line-grammar-points.schema';

export async function createTranscriptLineGrammarPoint(
  request: FastifyRequest<{ Body: TranscriptLineGrammarPointCreateBody }>,
  reply: FastifyReply,
) {
  try {
    const result = await service.createTranscriptLineGrammarPoint(request.body);
    return reply.status(201).send(result);
  } catch (err: unknown) {
    const error = err as { statusCode?: number; message?: string };
    if (error.statusCode === 400) {
      return reply.status(400).send({ error: error.message });
    }
    throw err;
  }
}

export async function patchTranscriptLineGrammarPoint(
  request: FastifyRequest<{ Params: { id: string }; Body: TranscriptLineGrammarPointPatchBody }>,
  reply: FastifyReply,
) {
  const id = parseInt(request.params.id, 10);
  if (isNaN(id)) {
    return reply.status(400).send({ error: 'Invalid id' });
  }

  try {
    const result = await service.patchTranscriptLineGrammarPoint(id, request.body);
    if (!result) {
      return reply.status(404).send({ error: 'Transcript line grammar point not found' });
    }
    return result;
  } catch (err: unknown) {
    const error = err as { statusCode?: number; message?: string };
    if (error.statusCode === 400) {
      return reply.status(400).send({ error: error.message });
    }
    throw err;
  }
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
