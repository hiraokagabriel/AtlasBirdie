import { z } from 'zod';

export const athleteStatusSchema = z.enum(['PENDING', 'ACTIVE', 'SUSPENDED', 'INACTIVE']);

export const createAthleteSchema = z.object({
  tenantId: z.string().min(1),
  clubId: z.string().optional(),
  name: z.string().min(2).max(120),
  slug: z
    .string()
    .min(2)
    .max(120)
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  photoUrl: z.string().url().optional(),
  birthDate: z.string().datetime().optional(),
  gender: z.enum(['M', 'F']).optional(),
  handedness: z.enum(['R', 'L']).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(50).optional(),
  country: z.string().length(2).default('BR'),
});

export const updateAthleteSchema = createAthleteSchema
  .omit({ tenantId: true, slug: true })
  .extend({
    status: athleteStatusSchema.optional(),
    clubId: z.string().nullable().optional(),
  })
  .partial();

export const listAthletesSchema = z.object({
  tenantId: z.string().optional(),
  clubId: z.string().optional(),
  status: athleteStatusSchema.optional(),
  search: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  perPage: z.coerce.number().min(1).max(100).default(20),
});

export type CreateAthleteInput = z.infer<typeof createAthleteSchema>;
export type UpdateAthleteInput = z.infer<typeof updateAthleteSchema>;
export type ListAthletesParams = z.infer<typeof listAthletesSchema>;
