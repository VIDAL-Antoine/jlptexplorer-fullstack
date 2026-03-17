import type { FastifyInstance } from 'fastify';
import {
  listGrammarPointsQuery,
  grammarPointBody,
  grammarPointParams,
  grammarPointScenesQuery,
} from '@/schemas/grammar-points.schema';
import { localeParams } from '@/schemas/common.schema';
import {
  listGrammarPoints,
  getGrammarPoint,
  getGrammarPointScenes,
  createGrammarPoint,
  updateGrammarPoint,
  deleteGrammarPoint,
} from '@/controllers/grammar-points.controller';

const TAGS = ['grammar-points'];

export async function grammarPointsRoutes(server: FastifyInstance) {
  server.get(
    '/',
    { schema: { tags: TAGS, params: localeParams, querystring: listGrammarPointsQuery } },
    listGrammarPoints,
  );
  server.get('/:slug', { schema: { tags: TAGS, params: grammarPointParams } }, getGrammarPoint);
  server.get(
    '/:slug/scenes',
    { schema: { tags: TAGS, params: grammarPointParams, querystring: grammarPointScenesQuery } },
    getGrammarPointScenes,
  );
  server.post(
    '/',
    { schema: { tags: TAGS, params: localeParams, body: grammarPointBody } },
    createGrammarPoint,
  );
  server.put(
    '/:slug',
    { schema: { tags: TAGS, params: grammarPointParams, body: grammarPointBody } },
    updateGrammarPoint,
  );
  server.delete('/:slug', { schema: { tags: TAGS, params: grammarPointParams } }, deleteGrammarPoint);
}
