import { timingSafeEqual } from 'crypto';
import type { FastifyInstance } from 'fastify';

export async function registerApiKeyAuth(server: FastifyInstance) {
  const apiKey = process.env['ADMIN_API_KEY'];
  if (!apiKey) {
    throw new Error('ADMIN_API_KEY environment variable is not set');
  }

  const expected = Buffer.from(apiKey);

  server.addHook('onRequest', async (request, reply) => {
    const provided = request.headers['x-api-key'];
    if (typeof provided !== 'string') {
      return reply.status(401).send({ error: 'Unauthorized' });
    }
    const actual = Buffer.from(provided);
    if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
      return reply.status(401).send({ error: 'Unauthorized' });
    }
  });
}
