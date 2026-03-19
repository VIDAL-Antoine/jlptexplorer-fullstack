import type { FastifyRequest, FastifyReply } from 'fastify';
import * as transcriptLinesService from '@/services/transcript-lines.service';
import type { LocaleParams } from '@/schemas/common.schema';
import type {
  TranscriptLineCreateBody,
  TranscriptLineUpdateBody,
  TranscriptLinePatchBody,
  ListTranscriptLinesQuery,
} from '@/schemas/transcript-lines.schema';

export async function listTranscriptLines(
  request: FastifyRequest<{ Params: LocaleParams; Querystring: ListTranscriptLinesQuery }>,
  reply: FastifyReply,
) {
  const sceneId = parseInt(request.query.scene_id, 10);
  if (isNaN(sceneId)) {
    return reply.status(400).send({ error: 'Invalid scene_id' });
  }

  const { speaker_slug, start_time, grammar_points } = request.query;
  const result = await transcriptLinesService.listTranscriptLines(sceneId, request.params.locale, {
    ...(speaker_slug !== undefined ? { speakerSlug: speaker_slug } : {}),
    ...(start_time !== undefined ? { startTime: parseInt(start_time, 10) } : {}),
    ...(grammar_points !== undefined ? { grammarPointSlugs: grammar_points.split(',') } : {}),
  });
  if (!result) {
    return reply.status(404).send({ error: 'Scene not found' });
  }
  return result;
}

export async function getTranscriptLine(
  request: FastifyRequest<{ Params: LocaleParams & { id: string } }>,
  reply: FastifyReply,
) {
  const id = parseInt(request.params.id, 10);
  if (isNaN(id)) {
    return reply.status(400).send({ error: 'Invalid transcript line id' });
  }

  const result = await transcriptLinesService.getTranscriptLine(id, request.params.locale);
  if (!result) {
    return reply.status(404).send({ error: 'Transcript line not found' });
  }
  return result;
}

export async function createTranscriptLine(
  request: FastifyRequest<{ Body: TranscriptLineCreateBody }>,
  reply: FastifyReply,
) {
  const line = await transcriptLinesService.createTranscriptLine(request.body);
  return reply.status(201).send(line);
}

export async function updateTranscriptLine(
  request: FastifyRequest<{ Params: { id: string }; Body: TranscriptLineUpdateBody }>,
  reply: FastifyReply,
) {
  const id = parseInt(request.params.id, 10);
  if (isNaN(id)) {
    return reply.status(400).send({ error: 'Invalid transcript line id' });
  }

  const result = await transcriptLinesService.updateTranscriptLine(id, request.body);
  if (!result) {
    return reply.status(404).send({ error: 'Transcript line not found' });
  }
  return result;
}

export async function patchTranscriptLine(
  request: FastifyRequest<{ Params: { id: string }; Body: TranscriptLinePatchBody }>,
  reply: FastifyReply,
) {
  const id = parseInt(request.params.id, 10);
  if (isNaN(id)) {
    return reply.status(400).send({ error: 'Invalid transcript line id' });
  }

  const result = await transcriptLinesService.patchTranscriptLine(id, request.body);
  if (!result) {
    return reply.status(404).send({ error: 'Transcript line not found' });
  }
  return result;
}

export async function deleteTranscriptLine(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const id = parseInt(request.params.id, 10);
  if (isNaN(id)) {
    return reply.status(400).send({ error: 'Invalid transcript line id' });
  }

  const result = await transcriptLinesService.deleteTranscriptLine(id);
  if (!result) {
    return reply.status(404).send({ error: 'Transcript line not found' });
  }
  return reply.status(204).send();
}
