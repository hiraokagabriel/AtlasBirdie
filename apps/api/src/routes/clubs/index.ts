import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { createClubService } from '../../services/club.service.js';
import { verifyAuth, verifyRole } from '../../middlewares/auth.js';

const listQuerySchema = z.object({
  tenantId: z.string().optional(),
  status: z.enum(['PENDING', 'ACTIVE', 'INACTIVE']).optional(),
  search: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  perPage: z.coerce.number().min(1).max(100).default(20),
});

const createBodySchema = z.object({
  tenantId: z.string().min(1),
  name: z.string().min(2).max(120),
  slug: z.string().min(2).max(120).regex(/^[a-z0-9-]+$/),
  acronym: z.string().min(2).max(10),
  logoUrl: z.string().url().optional(),
  primaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(50).optional(),
  country: z.string().length(2).default('BR'),
});

const updateBodySchema = createBodySchema
  .omit({ tenantId: true, slug: true })
  .extend({
    status: z.enum(['PENDING', 'ACTIVE', 'INACTIVE']).optional(),
    logoUrl: z.string().url().nullable().optional(),
    primaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).nullable().optional(),
  })
  .partial();

export default async function clubRoutes(app: FastifyInstance) {
  const service = createClubService(app.prisma);

  // GET /api/clubs — público
  app.get('/', async (request, reply) => {
    const query = listQuerySchema.safeParse(request.query);
    if (!query.success) {
      return reply.code(400).send({
        error: 'Validation error',
        code: 'INVALID_QUERY',
        details: query.error.flatten(),
      });
    }
    const result = await service.list(query.data);
    return reply.send(result);
  });

  // GET /api/clubs/:slug — público
  app.get<{ Params: { slug: string } }>('/:slug', async (request, reply) => {
    const club = await service.getBySlug(request.params.slug);
    if (!club) {
      return reply.code(404).send({ error: 'Club not found', code: 'NOT_FOUND' });
    }
    return reply.send({ data: club });
  });

  // POST /api/clubs — requer auth + role admin
  app.post(
    '/',
    { preHandler: [verifyAuth, verifyRole('SUPER_ADMIN', 'FEDERATION_ADMIN')] },
    async (request, reply) => {
      const body = createBodySchema.safeParse(request.body);
      if (!body.success) {
        return reply.code(400).send({
          error: 'Validation error',
          code: 'INVALID_BODY',
          details: body.error.flatten(),
        });
      }
      const club = await service.create(body.data);
      return reply.code(201).send({ data: club });
    },
  );

  // PUT /api/clubs/:id — requer auth + role admin
  app.put<{ Params: { id: string } }>(
    '/:id',
    { preHandler: [verifyAuth, verifyRole('SUPER_ADMIN', 'FEDERATION_ADMIN')] },
    async (request, reply) => {
      const body = updateBodySchema.safeParse(request.body);
      if (!body.success) {
        return reply.code(400).send({
          error: 'Validation error',
          code: 'INVALID_BODY',
          details: body.error.flatten(),
        });
      }
      try {
        const club = await service.update(request.params.id, body.data);
        return reply.send({ data: club });
      } catch {
        return reply.code(404).send({ error: 'Club not found', code: 'NOT_FOUND' });
      }
    },
  );

  // DELETE /api/clubs/:id — soft delete, requer auth + role admin
  app.delete<{ Params: { id: string } }>(
    '/:id',
    { preHandler: [verifyAuth, verifyRole('SUPER_ADMIN', 'FEDERATION_ADMIN')] },
    async (request, reply) => {
      try {
        await service.softDelete(request.params.id);
        return reply.code(204).send();
      } catch {
        return reply.code(404).send({ error: 'Club not found', code: 'NOT_FOUND' });
      }
    },
  );
}
