import type { FastifyRequest, FastifyReply } from 'fastify'

// TEMP: Dev-only auth bypass to destravar ambiente local.
// Em produção, isso deve ser substituído por verificação real via Clerk.

export async function requireAuth(
  request: FastifyRequest,
  _reply: FastifyReply,
): Promise<void> {
  // Atacha um usuário fake sempre que a rota exigir auth
  request.clerkUserId = 'dev-user'
}

export function requireRole(_allowedRoles: string[]) {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const tenant = await request.server.prisma.tenant.findFirst()

    if (!tenant) {
      return reply
        .status(500)
        .send({ error: 'Tenant not found', code: 'NO_TENANT' })
    }

    // SUPER_ADMIN fake em dev
    request.userRole = 'SUPER_ADMIN'
    request.tenantId = tenant.id
  }
}
