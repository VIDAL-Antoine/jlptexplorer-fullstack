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
      operationsSorter: ((a: { get: (key: string) => string }, b: { get: (key: string) => string }) => {
        const order = ['get', 'post', 'put', 'patch', 'delete'];
        return order.indexOf(a.get('method')) - order.indexOf(b.get('method'));
      }) as unknown as (name1: string, name2: string) => number,
    },
  });
}
