declare module 'fastify' {
  interface FastifyRequest {
    clerkUserId: string
    userRole: string
    tenantId: string
  }
}

export {}
