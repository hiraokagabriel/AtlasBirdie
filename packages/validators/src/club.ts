import { z } from 'zod'

export const createClubSchema = z.object({
  name: z.string().min(2).max(120),
  slug: z
    .string()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9-]+$/, 'Slug deve conter apenas letras minúsculas, números e hífens'),
  acronym: z.string().min(1).max(10).toUpperCase(),
  logoUrl: z.string().url().optional(),
  primaryColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Cor deve estar no formato hexadecimal')
    .optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(50).optional(),
  country: z.string().length(2).default('BR'),
})

export const updateClubSchema = createClubSchema
  .partial()
  .extend({
    status: z.enum(['PENDING', 'ACTIVE', 'INACTIVE']).optional(),
  })

export const listClubsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  status: z.enum(['PENDING', 'ACTIVE', 'INACTIVE']).optional(),
})

export type CreateClubInput = z.infer<typeof createClubSchema>
export type UpdateClubInput = z.infer<typeof updateClubSchema>
export type ListClubsInput = z.infer<typeof listClubsSchema>
