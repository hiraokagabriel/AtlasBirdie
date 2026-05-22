import { z } from 'zod'

export const createAthleteSchema = z.object({
  name: z.string().min(2).max(120),
  slug: z
    .string()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9-]+$/, 'Slug deve conter apenas letras minúsculas, números e hífens'),
  document: z.string().optional(),
  photoUrl: z.string().url().optional(),
  birthDate: z.string().datetime().optional(),
  gender: z.enum(['M', 'F', 'OTHER']).optional(),
  handedness: z.enum(['RIGHT', 'LEFT']).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(50).optional(),
  country: z.string().length(2).default('BR'),
  clubId: z.string().cuid().optional(),
})

export const updateAthleteSchema = createAthleteSchema
  .partial()
  .extend({
    status: z.enum(['PENDING', 'ACTIVE', 'SUSPENDED', 'INACTIVE']).optional(),
  })

export const listAthletesSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  clubId: z.string().cuid().optional(),
  status: z.enum(['PENDING', 'ACTIVE', 'SUSPENDED', 'INACTIVE']).optional(),
  discipline: z.enum(['MS', 'WS', 'MD', 'WD', 'XD']).optional(),
})

export type CreateAthleteInput = z.infer<typeof createAthleteSchema>
export type UpdateAthleteInput = z.infer<typeof updateAthleteSchema>
export type ListAthletesInput = z.infer<typeof listAthletesSchema>
