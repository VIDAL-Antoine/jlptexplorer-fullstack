import type { FastifyInstance } from 'fastify';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { jsonSchemaTransform } from 'fastify-type-provider-zod';

export async function registerSwagger(server: FastifyInstance) {
  await server.register(fastifySwagger, {
    openapi: {
      openapi: '3.0.0',
      info: {
        title: 'JLPTExplorer API',
        description:
          'API for JLPTExplorer — Japanese grammar learning app with contextual examples.',
        version: '1.0.0',
      },
      servers: [{ url: 'http://localhost:8080', description: 'Local development' }],
      tags: [
        { name: 'sources', description: 'Sources with contextual scenes' },
        {
          name: 'scenes',
          description: 'Contextual scenes from the source that illustrate grammar points',
        },
        { name: 'grammar-points', description: 'JLPT grammar points' },
        { name: 'speakers', description: 'Character speakers' },
        { name: 'transcript-lines', description: 'Dialogue lines within a scene' },
        {
          name: 'transcript-line-grammar-points',
          description: 'Grammar point annotations on transcript lines (add, edit, delete)',
        },
      ],
    },
    transform: jsonSchemaTransform,
  });

  await server.register(fastifySwaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: true,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      operationsSorter: (a: any, b: any) => {
        const methodOrder: Record<string, number> = {
          get: 0,
          post: 1,
          put: 2,
          patch: 3,
          delete: 4,
        };
        const methodDiff =
          (methodOrder[a.get('method')] ?? 9) - (methodOrder[b.get('method')] ?? 9);
        if (methodDiff !== 0) {
          return methodDiff;
        }
        return a.get('path').localeCompare(b.get('path'));
      },
    },
  });
}
