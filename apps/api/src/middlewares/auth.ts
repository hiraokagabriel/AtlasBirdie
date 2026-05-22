import type { FastifyRequest, FastifyReply } from 'fastify'
import { createClerkClient } from '@clerk/backend'

const clerk = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
})

export async function requireAuth(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  const token = request.headers.authorization?.replace('Bearer ', '')

  if (!token) {
    return reply.status(401).send({ error: 'Unauthorized', code: 'MISSING_TOKEN' })
  }

  try {
    const payload = await clerk.verifyToken(token)
    request.clerkUserId = payload.sub
  } catch {
    return reply.status(401).send({ error: 'Unauthorized', code: 'INVALID_TOKEN' })
  }
}

export function requireRole(allowedRoles: string[]) {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const user = await request.server.prisma.user.findUnique({
      where: { clerkId: request.clerkUserId },
      select: { role: true, isActive: true, tenantId: true },
    })

    if (!user || !user.isActive) {
      return reply.status(403).send({ error: 'Forbidden', code: 'USER_NOT_FOUND' })
    }

    if (!allowedRoles.includes(user.role)) {
      return reply.status(403).send({ error: 'Forbidden', code: 'INSUFFICIENT_ROLE' })
    }

    request.userRole = user.role
    request.tenantId = user.tenantId
  }
}
