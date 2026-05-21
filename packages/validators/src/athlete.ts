import { z } from 'zod';

export const createAthleteSchema = z.object({
  name: z.string().min(2, 'Nome deve ter ao menos 2 caracteres').max(120),
  clubId: z.string().cuid().optional(),
  birthDate: z.string().datetime().optional(),
  gender: z.enum(['M', 'F', 'OTHER']).optional(),
  handedness: z.enum(['RIGHT', 'LEFT', 'BOTH']).optional(),
  city: z.string().max(80).optional(),
  state: z.string().length(2).optional(),
  country: z.string().length(2).default('BR'),
  photoUrl: z.string().url().optional(),
});

export const updateAthleteSchema = createAthleteSchema.partial();

export const athleteStatusSchema = z.object({
  status: z.enum(['PENDING', 'ACTIVE', 'SUSPENDED', 'INACTIVE']),
});

export const athleteFiltersSchema = z.object({
  search: z.string().optional(),
  clubId: z.string().cuid().optional(),
  status: z.enum(['PENDING', 'ACTIVE', 'SUSPENDED', 'INACTIVE']).optional(),
  discipline: z.enum(['MS', 'WS', 'MD', 'WD', 'XD']).optional(),
  page: z.coerce.number().int().positive().default(1),
  perPage: z.coerce.number().int().positive().max(100).default(20),
});

export const importAthletesRowSchema = z.object({
  name: z.string().min(2).max(120),
  clubAcronym: z.string().optional(),
  birthDate: z.string().optional(),
  gender: z.enum(['M', 'F', 'OTHER']).optional(),
  city: z.string().optional(),
  state: z.string().length(2).optional(),
});

export const importAthletesSchema = z.array(importAthletesRowSchema).min(1).max(500);

export type CreateAthleteInput = z.infer<typeof createAthleteSchema>;
export type UpdateAthleteInput = z.infer<typeof updateAthleteSchema>;
export type AthleteFiltersInput = z.infer<typeof athleteFiltersSchema>;
export type ImportAthletesInput = z.infer<typeof importAthletesSchema>;
