import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { listSourcesQuery, sourceBody, sourcePatchBody, sourceSceneQuery } from '@/schemas/sources.schema';
import { localeParams, slugParams } from '@/schemas/common.schema';
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
    { schema: { tags: TAGS, params: localeParams, querystring: listSourcesQuery } },
    listSources,
  );
  server.get('/:slug', { schema: { tags: TAGS, params: localeSlugParams } }, getSource);
  server.get(
    '/:slug/scenes',
    { schema: { tags: TAGS, params: localeSlugParams, querystring: sourceSceneQuery } },
    getSourceScenes,
  );
}

export async function sourcesAdminRoutes(server: FastifyInstance) {
  server.post('/', { schema: { tags: TAGS, body: sourceBody } }, createSource);
  server.put(
    '/:slug',
    { schema: { tags: TAGS, params: slugParams, body: sourceBody } },
    updateSource,
  );
  server.patch(
    '/:slug',
    { schema: { tags: TAGS, params: slugParams, body: sourcePatchBody } },
    patchSource,
  );
  server.delete('/:slug', { schema: { tags: TAGS, params: slugParams } }, deleteSource);
}
