import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { createPairSchema } from '@atlas-birdie/validators';
import { PairService } from '../../services/pair.service';

export const pairRoutes: FastifyPluginAsyncZod = async (app) => {
  const svc = new PairService(app.prisma);

  // GET /pairs?athleteId=
  app.get(
    '/',
    {
      schema: {
        querystring: z.object({ athleteId: z.string().cuid() }),
      },
    },
    async (req, reply) => {
      const pairs = await svc.listByAthlete(req.query.athleteId);
      return reply.send({ data: pairs });
    },
  );

  // POST /pairs
  app.post(
    '/',
    { schema: { body: createPairSchema } },
    async (req, reply) => {
      const pair = await svc.findOrCreate(req.body);
      return reply.status(201).send({ data: pair });
    },
  );

  // DELETE /pairs/:id
  app.delete(
    '/:id',
    { schema: { params: z.object({ id: z.string().cuid() }) } },
    async (req, reply) => {
      await svc.deactivate(req.params.id);
      return reply.status(204).send();
    },
  );
};
