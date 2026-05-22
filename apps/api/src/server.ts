import Fastify from 'fastify';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { prismaPlugin } from './plugins/prisma';
import { redisPlugin } from './plugins/redis';
import { athleteRoutes } from './routes/athletes';
import { clubRoutes } from './routes/clubs';
import { pairRoutes } from './routes/pairs';

const app = Fastify({ logger: true });

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

void app.register(prismaPlugin);
void app.register(redisPlugin);

void app.register(athleteRoutes, { prefix: '/api/athletes' });
void app.register(clubRoutes, { prefix: '/api/clubs' });
void app.register(pairRoutes, { prefix: '/api/pairs' });

const PORT = Number(process.env.PORT ?? 3001);

app.listen({ port: PORT, host: '0.0.0.0' }, (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
});
