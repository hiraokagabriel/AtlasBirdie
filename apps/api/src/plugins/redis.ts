import fp from 'fastify-plugin';
import Redis from 'ioredis';
import type { FastifyPluginAsync } from 'fastify';

declare module 'fastify' {
  interface FastifyInstance {
    redis: Redis;
  }
}

const redisPlugin: FastifyPluginAsync = async (app) => {
  const redis = new Redis(process.env['REDIS_URL'] ?? 'redis://localhost:6379', {
    maxRetriesPerRequest: null,
  });

  redis.on('error', (err) => app.log.error({ err }, 'Redis connection error'));

  app.decorate('redis', redis);

  app.addHook('onClose', async () => {
    await redis.quit();
  });
};

export default fp(redisPlugin, { name: 'redis' });
