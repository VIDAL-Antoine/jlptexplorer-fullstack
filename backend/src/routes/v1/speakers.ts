import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { listSpeakersQuery, speakerBody, speakerPatchBody } from '@/schemas/speakers.schema';
import { localeParams, slugParams } from '@/schemas/common.schema';
import {
  errorResponse,
  listSpeakersResponse,
  getSpeakerResponse,
  speakerWriteResponse,
} from '@/schemas/responses/speakers';
import {
  listSpeakers,
  getSpeaker,
  createSpeaker,
  updateSpeaker,
  patchSpeaker,
  deleteSpeaker,
} from '@/controllers/speakers.controller';

const TAGS = ['speakers'];
const localeSlugParams = localeParams.extend({ slug: z.string() });

export async function speakersPublicRoutes(server: FastifyInstance) {
  server.get(
    '/',
    {
      schema: {
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
        tags: TAGS,
        params: slugParams,
        response: { 404: errorResponse },
      },
    },
    deleteSpeaker,
  );
}
