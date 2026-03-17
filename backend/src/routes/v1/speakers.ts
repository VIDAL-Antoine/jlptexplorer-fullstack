import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { speakerBody } from '@/schemas/speakers.schema';
import { localeParams, slugParams } from '@/schemas/common.schema';
import {
  listSpeakers,
  getSpeaker,
  createSpeaker,
  updateSpeaker,
  deleteSpeaker,
} from '@/controllers/speakers.controller';

const TAGS = ['speakers'];
const localeSlugParams = localeParams.extend({ slug: z.string() });

export async function speakersPublicRoutes(server: FastifyInstance) {
  server.get('/', { schema: { tags: TAGS, params: localeParams } }, listSpeakers);
  server.get('/:slug', { schema: { tags: TAGS, params: localeSlugParams } }, getSpeaker);
}

export async function speakersAdminRoutes(server: FastifyInstance) {
  server.post('/', { schema: { tags: TAGS, body: speakerBody } }, createSpeaker);
  server.put(
    '/:slug',
    { schema: { tags: TAGS, params: slugParams, body: speakerBody } },
    updateSpeaker,
  );
  server.delete('/:slug', { schema: { tags: TAGS, params: slugParams } }, deleteSpeaker);
}
