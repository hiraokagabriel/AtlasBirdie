import Fastify from 'fastify';
import prismaPlugin from './plugins/prisma.js';
import redisPlugin from './plugins/redis.js';
import uploadthingPlugin from './plugins/uploadthing.js';
import athleteRoutes from './routes/athletes/index.js';
import clubRoutes from './routes/clubs/index.js';

const app = Fastify({
  logger: { level: process.env['LOG_LEVEL'] ?? 'info' },
});

await app.register(prismaPlugin);
await app.register(redisPlugin);
await app.register(uploadthingPlugin);

await app.register(athleteRoutes, { prefix: '/api/athletes' });
await app.register(clubRoutes, { prefix: '/api/clubs' });

app.get('/health', async () => ({
  data: { status: 'ok', timestamp: new Date().toISOString() },
}));

const start = async () => {
  try {
    const port = Number(process.env['PORT'] ?? 3333);
    await app.listen({ port, host: '0.0.0.0' });
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

start();
