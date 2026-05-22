import type { FastifyPluginAsync } from 'fastify'
import { ClubService } from '../../services/club.service'
import { requireAuth, requireRole } from '../../middlewares/auth'
import { createClubSchema, updateClubSchema, listClubsSchema } from '@atlas/validators'

const clubRoutes: FastifyPluginAsync = async (fastify) => {
  const service = new ClubService(fastify.prisma)

  // GET /clubs
  fastify.get('/', async (request, reply) => {
    const query = listClubsSchema.parse(request.query)
    const tenant = await fastify.prisma.tenant.findFirst()
    if (!tenant) return reply.status(404).send({ error: 'Tenant not found', code: 'NO_TENANT' })

    const result = await service.list(tenant.id, query)
    return reply.send(result)
  })

  // GET /clubs/:slug
  fastify.get<{ Params: { slug: string } }>('/:slug', async (request, reply) => {
    const tenant = await fastify.prisma.tenant.findFirst()
    if (!tenant) return reply.status(404).send({ error: 'Tenant not found', code: 'NO_TENANT' })

    const club = await service.findBySlug(tenant.id, request.params.slug)
    if (!club) return reply.status(404).send({ error: 'Club not found', code: 'NOT_FOUND' })

    return reply.send({ data: club })
  })

  // POST /clubs
  fastify.post(
    '/',
    { preHandler: [requireAuth, requireRole(['FEDERATION_ADMIN', 'SUPER_ADMIN'])] },
    async (request, reply) => {
      const body = createClubSchema.parse(request.body)
      const club = await service.create(request.tenantId, body)
      return reply.status(201).send({ data: club })
    },
  )

  // PATCH /clubs/:id
  fastify.patch<{ Params: { id: string } }>(
    '/:id',
    { preHandler: [requireAuth, requireRole(['FEDERATION_ADMIN', 'SUPER_ADMIN'])] },
    async (request, reply) => {
      const body = updateClubSchema.parse(request.body)
      const club = await service.update(request.tenantId, request.params.id, body)
      return reply.send({ data: club })
    },
  )

  // DELETE /clubs/:id (soft)
  fastify.delete<{ Params: { id: string } }>(
    '/:id',
    { preHandler: [requireAuth, requireRole(['FEDERATION_ADMIN', 'SUPER_ADMIN'])] },
    async (request, reply) => {
      await service.softDelete(request.tenantId, request.params.id)
      return reply.status(204).send()
    },
  )
}

export default clubRoutes
