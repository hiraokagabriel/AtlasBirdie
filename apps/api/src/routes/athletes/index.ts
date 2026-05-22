import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { createAthleteSchema, updateAthleteSchema } from '@atlas-birdie/validators';
import { AthleteService } from '../../services/athlete.service';

export const athleteRoutes: FastifyPluginAsyncZod = async (app) => {
  const svc = new AthleteService(app.prisma);

  // GET /athletes
  app.get(
    '/',
    {
      schema: {
        querystring: z.object({
          page: z.coerce.number().min(1).default(1),
          perPage: z.coerce.number().min(1).max(100).default(20),
          search: z.string().optional(),
          clubId: z.string().optional(),
          status: z.enum(['PENDING', 'ACTIVE', 'SUSPENDED', 'INACTIVE']).optional(),
        }),
      },
    },
    async (req, reply) => {
      const tenantId = req.tenantId;
      const result = await svc.list({ tenantId, ...req.query });
      return reply.send(result);
    },
  );

  // GET /athletes/:slug
  app.get(
    '/:slug',
    { schema: { params: z.object({ slug: z.string() }) } },
    async (req, reply) => {
      const athlete = await svc.findBySlug(req.params.slug, req.tenantId);
      if (!athlete) return reply.status(404).send({ error: 'Athlete not found', code: 'ATHLETE_NOT_FOUND' });
      return reply.send({ data: athlete });
    },
  );

  // POST /athletes  (admin only)
  app.post(
    '/',
    { schema: { body: createAthleteSchema } },
    async (req, reply) => {
      const athlete = await svc.create(req.tenantId, req.body);
      return reply.status(201).send({ data: athlete });
    },
  );

  // PATCH /athletes/:id  (admin only)
  app.patch(
    '/:id',
    { schema: { params: z.object({ id: z.string().cuid() }), body: updateAthleteSchema } },
    async (req, reply) => {
      const athlete = await svc.update(req.params.id, req.tenantId, req.body);
      return reply.send({ data: athlete });
    },
  );

  // DELETE /athletes/:id  (admin only)
  app.delete(
    '/:id',
    { schema: { params: z.object({ id: z.string().cuid() }) } },
    async (req, reply) => {
      await svc.softDelete(req.params.id, req.tenantId);
      return reply.status(204).send();
    },
  );
};
