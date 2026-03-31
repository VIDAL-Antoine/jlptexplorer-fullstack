import type { FastifyInstance } from 'fastify';
import {
  transcriptLineCreateBody,
  transcriptLineUpdateBody,
  transcriptLinePatchBody,
  transcriptLineParams,
  transcriptLineAdminParams,
  listTranscriptLinesQuery,
} from '@/schemas/transcript-lines.schema.js';
import { localeParams } from '@/schemas/common.schema.js';
import {
  errorResponse,
  transcriptLineReadResponse,
  listTranscriptLinesResponse,
  transcriptLineWriteResponse,
} from '@/schemas/responses/transcript-lines.js';
import {
  listTranscriptLines,
  getTranscriptLine,
  createTranscriptLine,
  updateTranscriptLine,
  patchTranscriptLine,
  deleteTranscriptLine,
} from '@/controllers/transcript-lines.controller.js';

const TAGS = ['transcript-lines'];

export async function transcriptLinesPublicRoutes(server: FastifyInstance) {
  server.get(
    '/',
    {
      schema: {
        tags: TAGS,
        params: localeParams,
        querystring: listTranscriptLinesQuery,
        response: { 200: listTranscriptLinesResponse },
      },
    },
    listTranscriptLines,
  );
  server.get(
    '/:id',
    {
      schema: {
        tags: TAGS,
        params: transcriptLineParams,
        response: { 200: transcriptLineReadResponse, 404: errorResponse },
      },
    },
    getTranscriptLine,
  );
}

export async function transcriptLinesAdminRoutes(server: FastifyInstance) {
  server.post(
    '/',
    {
      schema: {
        tags: TAGS,
        body: transcriptLineCreateBody,
        response: { 201: transcriptLineWriteResponse, 400: errorResponse },
      },
    },
    createTranscriptLine,
  );
  server.put(
    '/:id',
    {
      schema: {
        tags: TAGS,
        params: transcriptLineAdminParams,
        body: transcriptLineUpdateBody,
        response: { 200: transcriptLineWriteResponse, 404: errorResponse },
      },
    },
    updateTranscriptLine,
  );
  server.patch(
    '/:id',
    {
      schema: {
        tags: TAGS,
        params: transcriptLineAdminParams,
        body: transcriptLinePatchBody,
        response: { 200: transcriptLineWriteResponse, 404: errorResponse, 400: errorResponse },
      },
    },
    patchTranscriptLine,
  );
  server.delete(
    '/:id',
    {
      schema: {
        tags: TAGS,
        params: transcriptLineAdminParams,
        response: { 404: errorResponse, 400: errorResponse },
      },
    },
    deleteTranscriptLine,
  );
}
