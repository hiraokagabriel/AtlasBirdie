import Fastify from 'fastify'
import cors from '@fastify/cors'
import prismaPlugin from './plugins/prisma'
import redisPlugin from './plugins/redis'
import athleteRoutes from './routes/athletes/index'
import clubRoutes from './routes/clubs/index'
import tournamentRoutes from './routes/tournaments/index'

export async function buildServer() {
  const fastify = Fastify({
    logger: {
      level: process.env.LOG_LEVEL ?? 'info',
    },
  })

  // Plugins
  await fastify.register(cors, {
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
    credentials: true,
  })
  await fastify.register(prismaPlugin)
  await fastify.register(redisPlugin)

  // Error handler
  fastify.setErrorHandler((error, _request, reply) => {
    const status = (error as { status?: number }).status ?? 500
    const code = (error as { code?: string }).code ?? 'INTERNAL_ERROR'

    if (status >= 500) {
      fastify.log.error(error)
    }

    return reply.status(status).send({
      error: error.message,
      code,
    })
  })

  // Routes
  await fastify.register(athleteRoutes, { prefix: '/api/athletes' })
  await fastify.register(clubRoutes, { prefix: '/api/clubs' })
  await fastify.register(tournamentRoutes, { prefix: '/api/tournaments' })

  return fastify
}

async function start() {
  const server = await buildServer()
  const port = Number(process.env.PORT ?? 3001)

  try {
    await server.listen({ port, host: '0.0.0.0' })
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()
