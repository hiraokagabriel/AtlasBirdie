import type { FastifyPluginAsync } from 'fastify'
import { TournamentService } from '../../services/tournament.service'
import { requireAuth, requireRole } from '../../middlewares/auth'
import {
  createTournamentSchema,
  updateTournamentSchema,
  listTournamentsSchema,
  createEventSchema,
  updateEventSchema,
} from '@atlas/validators'

const ADMIN_ROLES = ['FEDERATION_ADMIN', 'TOURNAMENT_ORGANIZER', 'SUPER_ADMIN'] as const

const tournamentRoutes: FastifyPluginAsync = async (fastify) => {
  const service = new TournamentService(fastify.prisma)

  // -------------------------------------------------------------------------
  // Tournament CRUD
  // -------------------------------------------------------------------------

  // GET /tournaments
  fastify.get('/', async (request, reply) => {
    const query = listTournamentsSchema.parse(request.query)
    const tenant = await fastify.prisma.tenant.findFirst()
    if (!tenant) return reply.status(404).send({ error: 'Tenant not found', code: 'NO_TENANT' })

    const result = await service.list(tenant.id, query)
    return reply.send(result)
  })

  // GET /tournaments/:slug
  fastify.get<{ Params: { slug: string } }>('/:slug', async (request, reply) => {
    const tenant = await fastify.prisma.tenant.findFirst()
    if (!tenant) return reply.status(404).send({ error: 'Tenant not found', code: 'NO_TENANT' })

    const tournament = await service.findBySlug(tenant.id, request.params.slug)
    if (!tournament)
      return reply.status(404).send({ error: 'Tournament not found', code: 'NOT_FOUND' })

    return reply.send({ data: tournament })
  })

  // POST /tournaments
  fastify.post(
    '/',
    { preHandler: [requireAuth, requireRole([...ADMIN_ROLES])] },
    async (request, reply) => {
      const body = createTournamentSchema.parse(request.body)
      const tournament = await service.create(request.tenantId, body)
      return reply.status(201).send({ data: tournament })
    },
  )

  // PATCH /tournaments/:id
  fastify.patch<{ Params: { id: string } }>(
    '/:id',
    { preHandler: [requireAuth, requireRole([...ADMIN_ROLES])] },
    async (request, reply) => {
      const body = updateTournamentSchema.parse(request.body)
      const tournament = await service.update(request.tenantId, request.params.id, body)
      return reply.send({ data: tournament })
    },
  )

  // DELETE /tournaments/:id (soft)
  fastify.delete<{ Params: { id: string } }>(
    '/:id',
    { preHandler: [requireAuth, requireRole(['FEDERATION_ADMIN', 'SUPER_ADMIN'])] },
    async (request, reply) => {
      await service.softDelete(request.tenantId, request.params.id)
      return reply.status(204).send()
    },
  )

  // -------------------------------------------------------------------------
  // Events sub-resource  /tournaments/:tournamentId/events
  // -------------------------------------------------------------------------

  // POST /tournaments/:tournamentId/events
  fastify.post<{ Params: { tournamentId: string } }>(
    '/:tournamentId/events',
    { preHandler: [requireAuth, requireRole([...ADMIN_ROLES])] },
    async (request, reply) => {
      const body = createEventSchema.parse(request.body)
      const event = await service.createEvent(
        request.tenantId,
        request.params.tournamentId,
        body,
      )
      return reply.status(201).send({ data: event })
    },
  )

  // PATCH /tournaments/:tournamentId/events/:eventId
  fastify.patch<{ Params: { tournamentId: string; eventId: string } }>(
    '/:tournamentId/events/:eventId',
    { preHandler: [requireAuth, requireRole([...ADMIN_ROLES])] },
    async (request, reply) => {
      const body = updateEventSchema.parse(request.body)
      const event = await service.updateEvent(
        request.tenantId,
        request.params.tournamentId,
        request.params.eventId,
        body,
      )
      return reply.send({ data: event })
    },
  )

  // DELETE /tournaments/:tournamentId/events/:eventId (soft)
  fastify.delete<{ Params: { tournamentId: string; eventId: string } }>(
    '/:tournamentId/events/:eventId',
    { preHandler: [requireAuth, requireRole([...ADMIN_ROLES])] },
    async (request, reply) => {
      await service.deleteEvent(
        request.tenantId,
        request.params.tournamentId,
        request.params.eventId,
      )
      return reply.status(204).send()
    },
  )
}

export default tournamentRoutes
