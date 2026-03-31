import type { FastifyInstance } from 'fastify';
import {
  listGrammarPointsQuery,
  grammarPointBody,
  grammarPointPatchBody,
  grammarPointParams,
  grammarPointAdminParams,
  grammarPointScenesQuery,
} from '@/schemas/grammar-points.schema.js';
import { localeParams } from '@/schemas/common.schema.js';
import {
  errorResponse,
  grammarPointAdminResponse,
  listGrammarPointsResponse,
  getGrammarPointResponse,
  getGrammarPointScenesResponse,
} from '@/schemas/responses/grammar-points.js';
import {
  listGrammarPoints,
  getGrammarPoint,
  getGrammarPointScenes,
  createGrammarPoint,
  updateGrammarPoint,
  patchGrammarPoint,
  deleteGrammarPoint,
} from '@/controllers/grammar-points.controller.js';

const TAGS = ['grammar-points'];

export async function grammarPointsPublicRoutes(server: FastifyInstance) {
  server.get(
    '/',
    {
      schema: {
        operationId: 'listGrammarPoints',
        summary: 'List grammar points',
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
        operationId: 'getGrammarPoint',
        summary: 'Get a grammar point by slug',
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
        operationId: 'getGrammarPointScenes',
        summary: 'List scenes for a grammar point',
        tags: TAGS,
        params: grammarPointParams,
        querystring: grammarPointScenesQuery,
        response: { 200: getGrammarPointScenesResponse, 404: errorResponse },
      },
    },
    getGrammarPointScenes,
  );
}

export async function grammarPointsAdminRoutes(server: FastifyInstance) {
  server.post(
    '/',
    {
      schema: {
        operationId: 'createGrammarPoint',
        summary: 'Create a grammar point',
        tags: TAGS,
        body: grammarPointBody,
        response: { 201: grammarPointAdminResponse },
      },
    },
    createGrammarPoint,
  );
  server.put(
    '/:slug',
    {
      schema: {
        operationId: 'updateGrammarPoint',
        summary: 'Replace a grammar point',
        tags: TAGS,
        params: grammarPointAdminParams,
        body: grammarPointBody,
        response: { 200: grammarPointAdminResponse, 404: errorResponse },
      },
    },
    updateGrammarPoint,
  );
  server.patch(
    '/:slug',
    {
      schema: {
        operationId: 'patchGrammarPoint',
        summary: 'Partially update a grammar point',
        tags: TAGS,
        params: grammarPointAdminParams,
        body: grammarPointPatchBody,
        response: { 200: grammarPointAdminResponse, 404: errorResponse },
      },
    },
    patchGrammarPoint,
  );
  server.delete(
    '/:slug',
    {
      schema: {
        operationId: 'deleteGrammarPoint',
        summary: 'Delete a grammar point',
        tags: TAGS,
        params: grammarPointAdminParams,
        response: { 404: errorResponse },
      },
    },
    deleteGrammarPoint,
  );
}
