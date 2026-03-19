import type { FastifyInstance } from 'fastify';
import {
  transcriptLineCreateBody,
  transcriptLineUpdateBody,
  transcriptLinePatchBody,
  transcriptLineParams,
  transcriptLineAdminParams,
  listTranscriptLinesQuery,
} from '@/schemas/transcript-lines.schema';
import { localeParams } from '@/schemas/common.schema';
import {
  listTranscriptLines,
  getTranscriptLine,
  createTranscriptLine,
  updateTranscriptLine,
  patchTranscriptLine,
  deleteTranscriptLine,
} from '@/controllers/transcript-lines.controller';

const TAGS = ['transcript-lines'];

export async function transcriptLinesPublicRoutes(server: FastifyInstance) {
  server.get(
    '/',
    { schema: { tags: TAGS, params: localeParams, querystring: listTranscriptLinesQuery } },
    listTranscriptLines,
  );
  server.get(
    '/:id',
    { schema: { tags: TAGS, params: transcriptLineParams } },
    getTranscriptLine,
  );
}

export async function transcriptLinesAdminRoutes(server: FastifyInstance) {
  server.post('/', { schema: { tags: TAGS, body: transcriptLineCreateBody } }, createTranscriptLine);
  server.put(
    '/:id',
    { schema: { tags: TAGS, params: transcriptLineAdminParams, body: transcriptLineUpdateBody } },
    updateTranscriptLine,
  );
  server.patch(
    '/:id',
    { schema: { tags: TAGS, params: transcriptLineAdminParams, body: transcriptLinePatchBody } },
    patchTranscriptLine,
  );
  server.delete(
    '/:id',
    { schema: { tags: TAGS, params: transcriptLineAdminParams } },
    deleteTranscriptLine,
  );
}
