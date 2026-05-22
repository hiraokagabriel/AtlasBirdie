import { z } from 'zod';

export const createClubSchema = z.object({
  name: z.string().min(2).max(120),
  slug: z
    .string()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9-]+$/, 'slug must be lowercase alphanumeric with hyphens'),
  acronym: z.string().min(2).max(10).toUpperCase(),
  logoUrl: z.string().url().optional().nullable(),
  primaryColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'must be a valid hex color')
    .optional()
    .nullable(),
  city: z.string().max(80).optional().nullable(),
  state: z.string().max(40).optional().nullable(),
  country: z.string().length(2).default('BR'),
});

export const updateClubSchema = createClubSchema
  .partial()
  .extend({
    status: z.enum(['PENDING', 'ACTIVE', 'INACTIVE']).optional(),
  });

export type CreateClubInput = z.infer<typeof createClubSchema>;
export type UpdateClubInput = z.infer<typeof updateClubSchema>;
