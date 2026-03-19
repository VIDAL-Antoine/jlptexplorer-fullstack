import type { FastifyInstance } from 'fastify';
import {
  transcriptLineGrammarPointCreateBody,
  transcriptLineGrammarPointPatchBody,
  transcriptLineGrammarPointParams,
} from '@/schemas/transcript-line-grammar-points.schema';
import {
  createTranscriptLineGrammarPoint,
  patchTranscriptLineGrammarPoint,
  deleteTranscriptLineGrammarPoint,
} from '@/controllers/transcript-line-grammar-points.controller';

const TAGS = ['transcript-line-grammar-points'];

export async function transcriptLineGrammarPointsAdminRoutes(server: FastifyInstance) {
  server.post(
    '/',
    { schema: { tags: TAGS, body: transcriptLineGrammarPointCreateBody } },
    createTranscriptLineGrammarPoint,
  );
  server.patch(
    '/:id',
    {
      schema: {
        tags: TAGS,
        params: transcriptLineGrammarPointParams,
        body: transcriptLineGrammarPointPatchBody,
      },
    },
    patchTranscriptLineGrammarPoint,
  );
  server.delete(
    '/:id',
    { schema: { tags: TAGS, params: transcriptLineGrammarPointParams } },
    deleteTranscriptLineGrammarPoint,
  );
}
