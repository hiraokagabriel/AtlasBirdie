import type { FastifyPluginAsync } from 'fastify'
import { AthleteService } from '../../services/athlete.service'
import { requireAuth, requireRole } from '../../middlewares/auth'
import {
  createAthleteSchema,
  updateAthleteSchema,
  listAthletesSchema,
} from '@atlas/validators'
import { z } from 'zod'

const athleteRoutes: FastifyPluginAsync = async (fastify) => {
  const service = new AthleteService(fastify.prisma)

  // GET /athletes — lista pública paginada
  fastify.get('/', async (request, reply) => {
    const query = listAthletesSchema.parse(request.query)
    // tenantId vem do header ou do subdomain; por ora usa o primeiro tenant
    const tenant = await fastify.prisma.tenant.findFirst()
    if (!tenant) return reply.status(404).send({ error: 'Tenant not found', code: 'NO_TENANT' })

    const result = await service.list(tenant.id, query)
    return reply.send(result)
  })

  // GET /athletes/:slug
  fastify.get<{ Params: { slug: string } }>('/:slug', async (request, reply) => {
    const tenant = await fastify.prisma.tenant.findFirst()
    if (!tenant) return reply.status(404).send({ error: 'Tenant not found', code: 'NO_TENANT' })

    const athlete = await service.findBySlug(tenant.id, request.params.slug)
    if (!athlete) return reply.status(404).send({ error: 'Athlete not found', code: 'NOT_FOUND' })

    return reply.send({ data: athlete })
  })

  // POST /athletes — requer auth
  fastify.post(
    '/',
    { preHandler: [requireAuth, requireRole(['FEDERATION_ADMIN', 'TOURNAMENT_ORGANIZER', 'SUPER_ADMIN'])] },
    async (request, reply) => {
      const body = createAthleteSchema.parse(request.body)
      const athlete = await service.create(request.tenantId, body)
      return reply.status(201).send({ data: athlete })
    },
  )

  // PATCH /athletes/:id
  fastify.patch<{ Params: { id: string } }>(
    '/:id',
    { preHandler: [requireAuth, requireRole(['FEDERATION_ADMIN', 'TOURNAMENT_ORGANIZER', 'SUPER_ADMIN'])] },
    async (request, reply) => {
      const body = updateAthleteSchema.parse(request.body)
      const athlete = await service.update(request.tenantId, request.params.id, body)
      return reply.send({ data: athlete })
    },
  )

  // DELETE /athletes/:id (soft)
  fastify.delete<{ Params: { id: string } }>(
    '/:id',
    { preHandler: [requireAuth, requireRole(['FEDERATION_ADMIN', 'SUPER_ADMIN'])] },
    async (request, reply) => {
      await service.softDelete(request.tenantId, request.params.id)
      return reply.status(204).send()
    },
  )
}

export default athleteRoutes
