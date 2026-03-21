import type { FastifyInstance } from 'fastify';
import {
  transcriptLineGrammarPointCreateBody,
  transcriptLineGrammarPointPatchBody,
  transcriptLineGrammarPointParams,
} from '@/schemas/transcript-line-grammar-points.schema';
import {
  errorResponse,
  tlgpWriteResponse,
} from '@/schemas/responses/transcript-line-grammar-points';
import {
  createTranscriptLineGrammarPoint,
  patchTranscriptLineGrammarPoint,
  deleteTranscriptLineGrammarPoint,
} from '@/controllers/transcript-line-grammar-points.controller';

const TAGS = ['transcript-line-grammar-points'];

export async function transcriptLineGrammarPointsAdminRoutes(server: FastifyInstance) {
  server.post(
    '/',
    {
      schema: {
        tags: TAGS,
        body: transcriptLineGrammarPointCreateBody,
        response: { 201: tlgpWriteResponse, 400: errorResponse },
      },
    },
    createTranscriptLineGrammarPoint,
  );
  server.patch(
    '/:id',
    {
      schema: {
        tags: TAGS,
        params: transcriptLineGrammarPointParams,
        body: transcriptLineGrammarPointPatchBody,
        response: { 200: tlgpWriteResponse, 404: errorResponse, 400: errorResponse },
      },
    },
    patchTranscriptLineGrammarPoint,
  );
  server.delete(
    '/:id',
    {
      schema: {
        tags: TAGS,
        params: transcriptLineGrammarPointParams,
        response: { 404: errorResponse, 400: errorResponse },
      },
    },
    deleteTranscriptLineGrammarPoint,
  );
}
