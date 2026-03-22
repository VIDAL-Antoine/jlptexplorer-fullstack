import 'dotenv/config';
import fastify, { type FastifyError } from 'fastify';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { Prisma } from '@prisma/client';
import { registerCors } from '@/plugins/cors';
import { registerSwagger } from '@/plugins/swagger';
import { registerApiKeyAuth } from '@/plugins/api-key';
import { sourcesPublicRoutes, sourcesAdminRoutes } from '@/routes/v1/sources';
import { scenesPublicRoutes, scenesAdminRoutes } from '@/routes/v1/scenes';
import { grammarPointsRoutes } from '@/routes/v1/grammar-points';
import { speakersPublicRoutes, speakersAdminRoutes } from '@/routes/v1/speakers';
import {
  transcriptLinesPublicRoutes,
  transcriptLinesAdminRoutes,
} from '@/routes/v1/transcript-lines';
import { transcriptLineGrammarPointsAdminRoutes } from '@/routes/v1/transcript-line-grammar-points';

async function start() {
  const server = fastify({ logger: true });
  server.setValidatorCompiler(validatorCompiler);
  server.setSerializerCompiler(serializerCompiler);

  server.setErrorHandler((error: FastifyError, _request, reply) => {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return reply.status(409).send({ error: 'A record with this value already exists' });
      }
      if (error.code === 'P2025') {
        return reply.status(404).send({ error: 'Record not found' });
      }
      if (error.code === 'P2003') {
        return reply.status(400).send({ error: 'Related record not found' });
      }
      if (error.code === 'P2014') {
        return reply.status(400).send({ error: 'Required relation missing' });
      }
      if (error.code === 'P2000') {
        return reply.status(400).send({ error: 'Value too long for column' });
      }
    }
    const status = error.statusCode ?? 500;
    if (status >= 400 && status < 500) {
      return reply.status(status).send({ error: error.message });
    }
    server.log.error(error);
    return reply.status(500).send({ error: 'Internal server error' });
  });

  await registerSwagger(server);
  await registerCors(server);

  server.get('/ping', { schema: { hide: true } }, async () => {
    return { status: 'ok' };
  });

  await server.register(
    async (api) => {
      api.register(
        async (localeApi) => {
          localeApi.register(sourcesPublicRoutes, { prefix: '/sources' });
          localeApi.register(scenesPublicRoutes, { prefix: '/scenes' });
          localeApi.register(grammarPointsRoutes, { prefix: '/grammar-points' });
          localeApi.register(speakersPublicRoutes, { prefix: '/speakers' });
          localeApi.register(transcriptLinesPublicRoutes, { prefix: '/transcript-lines' });
        },
        { prefix: '/:locale' },
      );
      api.register(async (adminApi) => {
        await registerApiKeyAuth(adminApi);
        adminApi.register(scenesAdminRoutes, { prefix: '/scenes' });
        adminApi.register(speakersAdminRoutes, { prefix: '/speakers' });
        adminApi.register(sourcesAdminRoutes, { prefix: '/sources' });
        adminApi.register(transcriptLinesAdminRoutes, { prefix: '/transcript-lines' });
        adminApi.register(transcriptLineGrammarPointsAdminRoutes, { prefix: '/transcript-line-grammar-points' });
      });
    },
    { prefix: '/api/v1' },
  );

  server.listen({ port: 8080, host: '0.0.0.0' }, (err, address) => {
    if (err) {
      server.log.error(err);
      process.exit(1);
    }
    server.log.info(`Server listening at ${address}`);
  });
}

start();
