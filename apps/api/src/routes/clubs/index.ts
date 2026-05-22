import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { createClubSchema, updateClubSchema } from '@atlas-birdie/validators';
import { ClubService } from '../../services/club.service';

export const clubRoutes: FastifyPluginAsyncZod = async (app) => {
  const svc = new ClubService(app.prisma);

  // GET /clubs
  app.get(
    '/',
    {
      schema: {
        querystring: z.object({
          page: z.coerce.number().min(1).default(1),
          perPage: z.coerce.number().min(1).max(100).default(20),
          search: z.string().optional(),
          status: z.enum(['PENDING', 'ACTIVE', 'INACTIVE']).optional(),
        }),
      },
    },
    async (req, reply) => {
      const result = await svc.list({ tenantId: req.tenantId, ...req.query });
      return reply.send(result);
    },
  );

  // GET /clubs/:slug
  app.get(
    '/:slug',
    { schema: { params: z.object({ slug: z.string() }) } },
    async (req, reply) => {
      const club = await svc.findBySlug(req.params.slug, req.tenantId);
      if (!club) return reply.status(404).send({ error: 'Club not found', code: 'CLUB_NOT_FOUND' });
      return reply.send({ data: club });
    },
  );

  // POST /clubs  (admin only)
  app.post(
    '/',
    { schema: { body: createClubSchema } },
    async (req, reply) => {
      const club = await svc.create(req.tenantId, req.body);
      return reply.status(201).send({ data: club });
    },
  );

  // PATCH /clubs/:id  (admin only)
  app.patch(
    '/:id',
    { schema: { params: z.object({ id: z.string().cuid() }), body: updateClubSchema } },
    async (req, reply) => {
      const club = await svc.update(req.params.id, req.tenantId, req.body);
      return reply.send({ data: club });
    },
  );

  // DELETE /clubs/:id  (admin only)
  app.delete(
    '/:id',
    { schema: { params: z.object({ id: z.string().cuid() }) } },
    async (req, reply) => {
      await svc.softDelete(req.params.id, req.tenantId);
      return reply.status(204).send();
    },
  );
};
