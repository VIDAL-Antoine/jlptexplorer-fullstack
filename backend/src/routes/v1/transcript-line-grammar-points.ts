import type { FastifyInstance } from 'fastify';
import {
  transcriptLineGrammarPointCreateBody,
  transcriptLineGrammarPointUpdateBody,
  transcriptLineGrammarPointPatchBody,
  transcriptLineGrammarPointParams,
  listTranscriptLineGrammarPointsQuery,
} from '@/schemas/transcript-line-grammar-points.schema.js';
import {
  errorResponse,
  tlgpWriteResponse,
  listTlgpResponse,
} from '@/schemas/responses/transcript-line-grammar-points.js';
import {
  listTranscriptLineGrammarPoints,
  getTranscriptLineGrammarPointById,
  createTranscriptLineGrammarPoint,
  updateTranscriptLineGrammarPoint,
  patchTranscriptLineGrammarPoint,
  deleteTranscriptLineGrammarPoint,
} from '@/controllers/transcript-line-grammar-points.controller.js';

const TAGS = ['transcript-line-grammar-points'];

export async function transcriptLineGrammarPointsAdminRoutes(server: FastifyInstance) {
  server.get(
    '/',
    {
      schema: {
        operationId: 'listTranscriptLineGrammarPoints',
        summary: 'List transcript line grammar point links',
        tags: TAGS,
        querystring: listTranscriptLineGrammarPointsQuery,
        response: { 200: listTlgpResponse },
      },
    },
    listTranscriptLineGrammarPoints,
  );
  server.get(
    '/:id',
    {
      schema: {
        operationId: 'getTranscriptLineGrammarPoint',
        summary: 'Get a transcript line grammar point link by id',
        tags: TAGS,
        params: transcriptLineGrammarPointParams,
        response: { 200: tlgpWriteResponse, 404: errorResponse, 400: errorResponse },
      },
    },
    getTranscriptLineGrammarPointById,
  );
  server.post(
    '/',
    {
      schema: {
        operationId: 'createTranscriptLineGrammarPoint',
        summary: 'Link a grammar point to a transcript line',
        tags: TAGS,
        body: transcriptLineGrammarPointCreateBody,
        response: { 201: tlgpWriteResponse, 400: errorResponse },
      },
    },
    createTranscriptLineGrammarPoint,
  );
  server.put(
    '/:id',
    {
      schema: {
        operationId: 'updateTranscriptLineGrammarPoint',
        summary: 'Replace a transcript line grammar point link',
        tags: TAGS,
        params: transcriptLineGrammarPointParams,
        body: transcriptLineGrammarPointUpdateBody,
        response: { 200: tlgpWriteResponse, 404: errorResponse, 400: errorResponse },
      },
    },
    updateTranscriptLineGrammarPoint,
  );
  server.patch(
    '/:id',
    {
      schema: {
        operationId: 'patchTranscriptLineGrammarPoint',
        summary: 'Update a transcript line grammar point link',
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
        operationId: 'deleteTranscriptLineGrammarPoint',
        summary: 'Remove a grammar point link from a transcript line',
        tags: TAGS,
        params: transcriptLineGrammarPointParams,
        response: { 404: errorResponse, 400: errorResponse },
      },
    },
    deleteTranscriptLineGrammarPoint,
  );
}
