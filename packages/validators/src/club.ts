import { z } from 'zod';

export const createClubSchema = z.object({
  name: z.string().min(2, 'Nome deve ter ao menos 2 caracteres').max(120),
  acronym: z.string().min(2).max(10).toUpperCase(),
  primaryColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Cor deve ser um hex válido')
    .optional(),
  city: z.string().max(80).optional(),
  state: z.string().length(2).optional(),
  country: z.string().length(2).default('BR'),
  logoUrl: z.string().url().optional(),
});

export const updateClubSchema = createClubSchema.partial();

export const clubStatusSchema = z.object({
  status: z.enum(['PENDING', 'ACTIVE', 'INACTIVE']),
});

export const clubFiltersSchema = z.object({
  search: z.string().optional(),
  status: z.enum(['PENDING', 'ACTIVE', 'INACTIVE']).optional(),
  state: z.string().length(2).optional(),
  page: z.coerce.number().int().positive().default(1),
  perPage: z.coerce.number().int().positive().max(100).default(20),
});

export type CreateClubInput = z.infer<typeof createClubSchema>;
export type UpdateClubInput = z.infer<typeof updateClubSchema>;
export type ClubFiltersInput = z.infer<typeof clubFiltersSchema>;
