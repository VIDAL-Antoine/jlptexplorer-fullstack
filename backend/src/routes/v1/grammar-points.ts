import type { FastifyInstance } from 'fastify';
import {
  listGrammarPointsQuery,
  grammarPointBody,
  grammarPointPatchBody,
  grammarPointParams,
  grammarPointScenesQuery,
} from '@/schemas/grammar-points.schema';
import { localeParams } from '@/schemas/common.schema';
import {
  errorResponse,
  grammarPointResponse,
  listGrammarPointsResponse,
  getGrammarPointResponse,
  getGrammarPointScenesResponse,
} from '@/schemas/responses/grammar-points';
import {
  listGrammarPoints,
  getGrammarPoint,
  getGrammarPointScenes,
  createGrammarPoint,
  updateGrammarPoint,
  patchGrammarPoint,
  deleteGrammarPoint,
} from '@/controllers/grammar-points.controller';

const TAGS = ['grammar-points'];

export async function grammarPointsRoutes(server: FastifyInstance) {
  server.get(
    '/',
    {
      schema: {
        tags: TAGS,
        params: localeParams,
        querystring: listGrammarPointsQuery,
        response: { 200: listGrammarPointsResponse },
      },
    },
    listGrammarPoints,
  );
  server.get(
    '/:slug',
    {
      schema: {
        tags: TAGS,
        params: grammarPointParams,
        response: { 200: getGrammarPointResponse, 404: errorResponse },
      },
    },
    getGrammarPoint,
  );
  server.get(
    '/:slug/scenes',
    {
      schema: {
        tags: TAGS,
        params: grammarPointParams,
        querystring: grammarPointScenesQuery,
        response: { 200: getGrammarPointScenesResponse, 404: errorResponse },
      },
    },
    getGrammarPointScenes,
  );
  server.post(
    '/',
    {
      schema: {
        tags: TAGS,
        params: localeParams,
        body: grammarPointBody,
        response: { 201: grammarPointResponse },
      },
    },
    createGrammarPoint,
  );
  server.put(
    '/:slug',
    {
      schema: {
        tags: TAGS,
        params: grammarPointParams,
        body: grammarPointBody,
        response: { 200: grammarPointResponse, 404: errorResponse },
      },
    },
    updateGrammarPoint,
  );
  server.patch(
    '/:slug',
    {
      schema: {
        tags: TAGS,
        params: grammarPointParams,
        body: grammarPointPatchBody,
        response: { 200: grammarPointResponse, 404: errorResponse },
      },
    },
    patchGrammarPoint,
  );
  server.delete(
    '/:slug',
    {
      schema: {
        tags: TAGS,
        params: grammarPointParams,
        response: { 404: errorResponse },
      },
    },
    deleteGrammarPoint,
  );
}
