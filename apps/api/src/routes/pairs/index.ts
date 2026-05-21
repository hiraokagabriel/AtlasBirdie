import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { createPairService } from '../../services/pair.service.js';
import { verifyAuth, verifyRole } from '../../middlewares/auth.js';

const disciplineSchema = z.enum(['MS', 'WS', 'MD', 'WD', 'XD']);

const listQuerySchema = z.object({
  athleteId: z.string().optional(),
  discipline: disciplineSchema.optional(),
  isActive: z
    .string()
    .optional()
    .transform((v) => (v === undefined ? undefined : v === 'true')),
  page: z.coerce.number().min(1).default(1),
  perPage: z.coerce.number().min(1).max(100).default(20),
});

const createBodySchema = z.object({
  discipline: disciplineSchema,
  athleteAId: z.string().min(1),
  athleteBId: z.string().min(1),
}).refine((d) => d.athleteAId !== d.athleteBId, {
  message: 'athleteAId and athleteBId must be different athletes',
});

export default async function pairRoutes(app: FastifyInstance) {
  const service = createPairService(app.prisma);

  // GET /api/pairs — público
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

  // GET /api/pairs/:id — público
  app.get<{ Params: { id: string } }>('/:id', async (request, reply) => {
    const pair = await service.getById(request.params.id);
    if (!pair) {
      return reply.code(404).send({ error: 'Pair not found', code: 'NOT_FOUND' });
    }
    return reply.send({ data: pair });
  });

  // POST /api/pairs — requer auth + role admin/organizer
  app.post(
    '/',
    { preHandler: [verifyAuth, verifyRole('SUPER_ADMIN', 'FEDERATION_ADMIN', 'TOURNAMENT_ORGANIZER')] },
    async (request, reply) => {
      const body = createBodySchema.safeParse(request.body);
      if (!body.success) {
        return reply.code(400).send({
          error: 'Validation error',
          code: 'INVALID_BODY',
          details: body.error.flatten(),
        });
      }
      try {
        const pair = await service.create(body.data);
        return reply.code(201).send({ data: pair });
      } catch {
        return reply.code(409).send({
          error: 'Pair already exists for this discipline',
          code: 'CONFLICT',
        });
      }
    },
  );

  // PATCH /api/pairs/:id/active — ativar/desativar dupla
  app.patch<{ Params: { id: string } }>(
    '/:id/active',
    { preHandler: [verifyAuth, verifyRole('SUPER_ADMIN', 'FEDERATION_ADMIN', 'TOURNAMENT_ORGANIZER')] },
    async (request, reply) => {
      const body = z.object({ isActive: z.boolean() }).safeParse(request.body);
      if (!body.success) {
        return reply.code(400).send({
          error: 'Validation error',
          code: 'INVALID_BODY',
          details: body.error.flatten(),
        });
      }
      try {
        const pair = await service.setActive(request.params.id, body.data.isActive);
        return reply.send({ data: pair });
      } catch {
        return reply.code(404).send({ error: 'Pair not found', code: 'NOT_FOUND' });
      }
    },
  );

  // DELETE /api/pairs/:id — soft delete, requer auth + role admin
  app.delete<{ Params: { id: string } }>(
    '/:id',
    { preHandler: [verifyAuth, verifyRole('SUPER_ADMIN', 'FEDERATION_ADMIN')] },
    async (request, reply) => {
      try {
        await service.softDelete(request.params.id);
        return reply.code(204).send();
      } catch {
        return reply.code(404).send({ error: 'Pair not found', code: 'NOT_FOUND' });
      }
    },
  );
}
