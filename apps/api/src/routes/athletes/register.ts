import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { AthleteService } from '../../services/athlete.service.js';
import { registrationConfirmationQueue } from '../../jobs/queues.js';

const registerBodySchema = z.object({
  tenantId: z.string().min(1),
  name: z.string().min(2).max(120),
  email: z.string().email(),
  birthDate: z.string().datetime(),
  gender: z.enum(['M', 'F']),
  clubId: z.string().optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(50).optional(),
  country: z.string().length(2).default('BR'),
});

/** Gera slug a partir do nome: "João Silva" → "joao-silva" */
function generateSlug(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export default async function athleteRegisterRoute(app: FastifyInstance) {
  const service = new AthleteService(app.prisma);

  /**
   * POST /api/athletes/register
   * Rota pública — sem autenticação.
   * Sempre cria atleta com status PENDING; admin precisa aprovar.
   */
  app.post('/register', async (request, reply) => {
    const body = registerBodySchema.safeParse(request.body);
    if (!body.success) {
      return reply.code(400).send({
        error: 'Validation error',
        code: 'INVALID_BODY',
        details: body.error.flatten(),
      });
    }

    const { name, email, tenantId, birthDate, gender, clubId, city, state, country } = body.data;

    // Gera slug único com sufixo numérico se conflito
    let slug = generateSlug(name);
    const existing = await app.prisma.athlete.findFirst({ where: { slug, deletedAt: null } });
    if (existing) slug = `${slug}-${Date.now().toString(36)}`;

    const athlete = await service.create(tenantId, {
      name,
      slug,
      birthDate,
      gender,
      clubId,
      city,
      state,
      country,
    });

    // Dispara e-mail de confirmação em background via BullMQ
    await registrationConfirmationQueue.add('send-confirmation', {
      athleteId: athlete.id,
      athleteName: name,
      email,
    });

    return reply.code(201).send({
      data: {
        id: athlete.id,
        name: athlete.name,
        slug: athlete.slug,
        status: athlete.status,
      },
    });
  });
}
