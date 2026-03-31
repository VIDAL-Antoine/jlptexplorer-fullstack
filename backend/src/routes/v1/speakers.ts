import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { listSpeakersQuery, speakerBody, speakerPatchBody } from '@/schemas/speakers.schema.js';
import { localeParams, slugParams } from '@/schemas/common.schema.js';
import {
  errorResponse,
  listSpeakersResponse,
  getSpeakerResponse,
  speakerWriteResponse,
} from '@/schemas/responses/speakers.js';
import {
  listSpeakers,
  getSpeaker,
  createSpeaker,
  updateSpeaker,
  patchSpeaker,
  deleteSpeaker,
} from '@/controllers/speakers.controller.js';

const TAGS = ['speakers'];
const localeSlugParams = localeParams.extend({ slug: z.string() });

export async function speakersPublicRoutes(server: FastifyInstance) {
  server.get(
    '/',
    {
      schema: {
        operationId: 'listSpeakers',
        summary: 'List speakers',
        tags: TAGS,
        params: localeParams,
        querystring: listSpeakersQuery,
        response: { 200: listSpeakersResponse },
      },
    },
    listSpeakers,
  );
  server.get(
    '/:slug',
    {
      schema: {
        operationId: 'getSpeaker',
        summary: 'Get a speaker by slug',
        tags: TAGS,
        params: localeSlugParams,
        response: { 200: getSpeakerResponse, 404: errorResponse },
      },
    },
    getSpeaker,
  );
}

export async function speakersAdminRoutes(server: FastifyInstance) {
  server.post(
    '/',
    {
      schema: {
        operationId: 'createSpeaker',
        summary: 'Create a speaker',
        tags: TAGS,
        body: speakerBody,
        response: { 201: speakerWriteResponse },
      },
    },
    createSpeaker,
  );
  server.put(
    '/:slug',
    {
      schema: {
        operationId: 'updateSpeaker',
        summary: 'Replace a speaker',
        tags: TAGS,
        params: slugParams,
        body: speakerBody,
        response: { 200: speakerWriteResponse, 404: errorResponse },
      },
    },
    updateSpeaker,
  );
  server.patch(
    '/:slug',
    {
      schema: {
        operationId: 'patchSpeaker',
        summary: 'Partially update a speaker',
        tags: TAGS,
        params: slugParams,
        body: speakerPatchBody,
        response: { 200: speakerWriteResponse, 404: errorResponse },
      },
    },
    patchSpeaker,
  );
  server.delete(
    '/:slug',
    {
      schema: {
        operationId: 'deleteSpeaker',
        summary: 'Delete a speaker',
        tags: TAGS,
        params: slugParams,
        response: { 404: errorResponse },
      },
    },
    deleteSpeaker,
  );
}
