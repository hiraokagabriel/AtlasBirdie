import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { createAthleteService } from '../../services/athlete.service.js';
import { verifyAuth, verifyRole } from '../../middlewares/auth.js';

const cpfSchema = z
  .string()
  .regex(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/, 'CPF inválido')
  .transform((v) => v.replace(/[^\d]/g, ''))
  .optional();

const listQuerySchema = z.object({
  tenantId: z.string().optional(),
  clubId: z.string().optional(),
  status: z.enum(['PENDING', 'ACTIVE', 'SUSPENDED', 'INACTIVE']).optional(),
  search: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  perPage: z.coerce.number().min(1).max(100).default(20),
});

const createBodySchema = z.object({
  tenantId: z.string().min(1),
  clubId: z.string().optional(),
  name: z.string().min(2).max(120),
  slug: z.string().min(2).max(120).regex(/^[a-z0-9-]+$/),
  document: cpfSchema,
  photoUrl: z.string().url().optional(),
  birthDate: z.string().datetime().optional(),
  gender: z.enum(['M', 'F']).optional(),
  handedness: z.enum(['R', 'L']).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(50).optional(),
  country: z.string().length(2).default('BR'),
});

const updateBodySchema = createBodySchema
  .omit({ tenantId: true, slug: true })
  .extend({
    status: z.enum(['PENDING', 'ACTIVE', 'SUSPENDED', 'INACTIVE']).optional(),
    clubId: z.string().nullable().optional(),
    document: z.string().nullable().optional(),
    photoUrl: z.string().url().nullable().optional(),
  })
  .partial();

export default async function athleteRoutes(app: FastifyInstance) {
  const service = createAthleteService(app.prisma);

  // GET /api/athletes
  app.get('/', async (request, reply) => {
    const query = listQuerySchema.safeParse(request.query);
    if (!query.success) {
      return reply.code(400).send({ error: 'Validation error', code: 'INVALID_QUERY', details: query.error.flatten() });
    }
    return reply.send(await service.list(query.data));
  });

  // GET /api/athletes/:slug
  app.get<{ Params: { slug: string } }>('/:slug', async (request, reply) => {
    const athlete = await service.getBySlug(request.params.slug);
    if (!athlete) return reply.code(404).send({ error: 'Athlete not found', code: 'NOT_FOUND' });
    return reply.send({ data: athlete });
  });

  // POST /api/athletes — admin cria atleta (com validação de CPF único)
  app.post(
    '/',
    { preHandler: [verifyAuth, verifyRole('SUPER_ADMIN', 'FEDERATION_ADMIN', 'TOURNAMENT_ORGANIZER')] },
    async (request, reply) => {
      const body = createBodySchema.safeParse(request.body);
      if (!body.success) {
        return reply.code(400).send({ error: 'Validation error', code: 'INVALID_BODY', details: body.error.flatten() });
      }

      // Unicidade de documento por tenant
      if (body.data.document) {
        const existing = await service.findByDocument(body.data.tenantId, body.data.document);
        if (existing) {
          return reply.code(409).send({
            error: 'Documento já cadastrado para este tenant',
            code: 'DOCUMENT_CONFLICT',
            details: { existingAthleteSlug: existing.slug },
          });
        }
      }

      const athlete = await service.create({
        ...body.data,
        birthDate: body.data.birthDate ? new Date(body.data.birthDate) : undefined,
      });
      return reply.code(201).send({ data: athlete });
    },
  );

  // PUT /api/athletes/:id
  app.put<{ Params: { id: string } }>(
    '/:id',
    { preHandler: [verifyAuth, verifyRole('SUPER_ADMIN', 'FEDERATION_ADMIN', 'TOURNAMENT_ORGANIZER')] },
    async (request, reply) => {
      const body = updateBodySchema.safeParse(request.body);
      if (!body.success) {
        return reply.code(400).send({ error: 'Validation error', code: 'INVALID_BODY', details: body.error.flatten() });
      }
      try {
        const athlete = await service.update(request.params.id, {
          ...body.data,
          birthDate: body.data.birthDate ? new Date(body.data.birthDate) : undefined,
        });
        return reply.send({ data: athlete });
      } catch {
        return reply.code(404).send({ error: 'Athlete not found', code: 'NOT_FOUND' });
      }
    },
  );

  // DELETE /api/athletes/:id
  app.delete<{ Params: { id: string } }>(
    '/:id',
    { preHandler: [verifyAuth, verifyRole('SUPER_ADMIN', 'FEDERATION_ADMIN')] },
    async (request, reply) => {
      try {
        await service.softDelete(request.params.id);
        return reply.code(204).send();
      } catch {
        return reply.code(404).send({ error: 'Athlete not found', code: 'NOT_FOUND' });
      }
    },
  );
}
