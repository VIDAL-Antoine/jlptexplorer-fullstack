import type { FastifyInstance } from 'fastify';
import {
  sceneBody,
  scenePatchBody,
  sceneParams,
  adminSceneParams,
  updateTranslationsBody,
  updateTranslationsParams,
  listScenesQuery,
} from '@/schemas/scenes.schema.js';
import { localeParams } from '@/schemas/common.schema.js';
import {
  errorResponse,
  sceneResponse,
  listScenesResponse,
  sceneWriteResponse,
} from '@/schemas/responses/scenes.js';
import {
  listScenes,
  getScene,
  createScene,
  updateScene,
  patchScene,
  deleteScene,
  updateTranslations,
} from '@/controllers/scenes.controller.js';

const TAGS = ['scenes'];

export async function scenesPublicRoutes(server: FastifyInstance) {
  server.get(
    '/',
    {
      schema: {
        tags: TAGS,
        params: localeParams,
        querystring: listScenesQuery,
        response: { 200: listScenesResponse },
      },
    },
    listScenes,
  );
  server.get(
    '/:id',
    {
      schema: {
        tags: TAGS,
        params: sceneParams,
        response: { 200: sceneResponse, 404: errorResponse },
      },
    },
    getScene,
  );
  server.patch(
    '/:id/translations',
    {
      schema: {
        tags: TAGS,
        params: updateTranslationsParams,
        body: updateTranslationsBody,
        response: { 200: sceneWriteResponse, 404: errorResponse },
      },
    },
    updateTranslations,
  );
}

export async function scenesAdminRoutes(server: FastifyInstance) {
  server.post(
    '/',
    {
      schema: {
        tags: TAGS,
        body: sceneBody,
        response: { 201: sceneWriteResponse, 400: errorResponse },
      },
    },
    createScene,
  );
  server.put(
    '/:id',
    {
      schema: {
        tags: TAGS,
        params: adminSceneParams,
        body: sceneBody,
        response: { 200: sceneWriteResponse, 400: errorResponse },
      },
    },
    updateScene,
  );
  server.patch(
    '/:id',
    {
      schema: {
        tags: TAGS,
        params: adminSceneParams,
        body: scenePatchBody,
        response: { 200: sceneWriteResponse, 404: errorResponse, 400: errorResponse },
      },
    },
    patchScene,
  );
  server.delete(
    '/:id',
    {
      schema: {
        tags: TAGS,
        params: adminSceneParams,
        response: { 400: errorResponse },
      },
    },
    deleteScene,
  );
}
