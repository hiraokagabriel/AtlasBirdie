import { z } from 'zod';

export const createAthleteSchema = z.object({
  name: z.string().min(2).max(120),
  slug: z
    .string()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9-]+$/, 'slug must be lowercase alphanumeric with hyphens'),
  clubId: z.string().cuid().optional().nullable(),
  document: z.string().max(20).optional().nullable(),
  photoUrl: z.string().url().optional().nullable(),
  birthDate: z.string().datetime().optional().nullable(),
  gender: z.enum(['M', 'F']).optional().nullable(),
  handedness: z.enum(['RIGHT', 'LEFT', 'BOTH']).optional().nullable(),
  city: z.string().max(80).optional().nullable(),
  state: z.string().max(40).optional().nullable(),
  country: z.string().length(2).default('BR'),
});

export const updateAthleteSchema = createAthleteSchema
  .partial()
  .extend({
    status: z.enum(['PENDING', 'ACTIVE', 'SUSPENDED', 'INACTIVE']).optional(),
  });

export type CreateAthleteInput = z.infer<typeof createAthleteSchema>;
export type UpdateAthleteInput = z.infer<typeof updateAthleteSchema>;
