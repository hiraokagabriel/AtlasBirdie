import type { FastifyRequest, FastifyReply } from 'fastify';
import { createClerkClient } from '@clerk/backend';

const clerk = createClerkClient({
  secretKey: process.env['CLERK_SECRET_KEY'] ?? '',
});

export async function verifyAuth(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const authHeader = request.headers.authorization;
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.slice(7)
    : null;

  if (!token) {
    reply.code(401).send({ error: 'Unauthorized', code: 'MISSING_TOKEN' });
    return;
  }

  try {
    const payload = await clerk.verifyToken(token);
    (request as FastifyRequest & { auth: typeof payload }).auth = payload;
  } catch {
    reply.code(401).send({ error: 'Unauthorized', code: 'INVALID_TOKEN' });
  }
}

export function verifyRole(...roles: string[]) {
  return async function (
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    const auth = (request as FastifyRequest & { auth?: { metadata?: { role?: string } } }).auth;
    const role = auth?.metadata?.role;

    if (!role || !roles.includes(role)) {
      reply.code(403).send({ error: 'Forbidden', code: 'INSUFFICIENT_ROLE' });
    }
  };
}
