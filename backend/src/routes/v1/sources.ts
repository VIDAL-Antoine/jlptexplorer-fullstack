import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { listSourcesQuery, sourceBody, sourcePatchBody, sourceSceneQuery } from '@/schemas/sources.schema';
import { localeParams, slugParams } from '@/schemas/common.schema';
import {
  errorResponse,
  listSourcesResponse,
  getSourceResponse,
  getSourceScenesResponse,
  sourceWriteResponse,
} from '@/schemas/responses/sources';
import {
  listSources,
  getSource,
  getSourceScenes,
  createSource,
  updateSource,
  patchSource,
  deleteSource,
} from '@/controllers/sources.controller';

const TAGS = ['sources'];
const localeSlugParams = localeParams.extend({ slug: z.string() });

export async function sourcesPublicRoutes(server: FastifyInstance) {
  server.get(
    '/',
    {
      schema: {
        tags: TAGS,
        params: localeParams,
        querystring: listSourcesQuery,
        response: { 200: listSourcesResponse },
      },
    },
    listSources,
  );
  server.get(
    '/:slug',
    {
      schema: {
        tags: TAGS,
        params: localeSlugParams,
        response: { 200: getSourceResponse, 404: errorResponse },
      },
    },
    getSource,
  );
  server.get(
    '/:slug/scenes',
    {
      schema: {
        tags: TAGS,
        params: localeSlugParams,
        querystring: sourceSceneQuery,
        response: { 200: getSourceScenesResponse, 404: errorResponse },
      },
    },
    getSourceScenes,
  );
}

export async function sourcesAdminRoutes(server: FastifyInstance) {
  server.post(
    '/',
    {
      schema: {
        tags: TAGS,
        body: sourceBody,
        response: { 201: sourceWriteResponse },
      },
    },
    createSource,
  );
  server.put(
    '/:slug',
    {
      schema: {
        tags: TAGS,
        params: slugParams,
        body: sourceBody,
        response: { 200: sourceWriteResponse, 404: errorResponse },
      },
    },
    updateSource,
  );
  server.patch(
    '/:slug',
    {
      schema: {
        tags: TAGS,
        params: slugParams,
        body: sourcePatchBody,
        response: { 200: sourceWriteResponse, 404: errorResponse },
      },
    },
    patchSource,
  );
  server.delete(
    '/:slug',
    {
      schema: {
        tags: TAGS,
        params: slugParams,
        response: { 404: errorResponse },
      },
    },
    deleteSource,
  );
}
