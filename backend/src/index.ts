import 'dotenv/config';
import fastify from 'fastify';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { registerCors } from '@/plugins/cors';
import { registerSwagger } from '@/plugins/swagger';
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
      api.register(scenesAdminRoutes, { prefix: '/scenes' });
      api.register(speakersAdminRoutes, { prefix: '/speakers' });
      api.register(sourcesAdminRoutes, { prefix: '/sources' });
      api.register(transcriptLinesAdminRoutes, { prefix: '/transcript-lines' });
      api.register(transcriptLineGrammarPointsAdminRoutes, { prefix: '/transcript-line-grammar-points' });
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
