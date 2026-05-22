import { z } from 'zod'

export const createTournamentSchema = z.object({
  name: z.string().min(2).max(200),
  slug: z
    .string()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9-]+$/, 'Slug deve conter apenas letras minúsculas, números e hífens'),
  logoUrl: z.string().url().optional(),
  location: z.string().max(200).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(50).optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  regulationUrl: z.string().url().optional(),
  description: z.string().max(2000).optional(),
})

export const updateTournamentSchema = createTournamentSchema
  .partial()
  .extend({
    status: z
      .enum([
        'DRAFT',
        'REGISTRATIONS_OPEN',
        'REGISTRATIONS_CLOSED',
        'IN_PROGRESS',
        'FINISHED',
        'ARCHIVED',
      ])
      .optional(),
  })

export type CreateTournamentInput = z.infer<typeof createTournamentSchema>
export type UpdateTournamentInput = z.infer<typeof updateTournamentSchema>
