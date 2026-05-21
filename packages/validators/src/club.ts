import { z } from 'zod';

export const clubStatusSchema = z.enum(['PENDING', 'ACTIVE', 'INACTIVE']);

export const createClubSchema = z.object({
  tenantId: z.string().min(1),
  name: z.string().min(2).max(120),
  slug: z
    .string()
    .min(2)
    .max(120)
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  acronym: z.string().min(1).max(10).toUpperCase(),
  logoUrl: z.string().url().optional(),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(50).optional(),
  country: z.string().length(2).default('BR'),
});

export const updateClubSchema = createClubSchema
  .omit({ tenantId: true, slug: true })
  .extend({ status: clubStatusSchema.optional() })
  .partial();

export const listClubsSchema = z.object({
  tenantId: z.string().optional(),
  status: clubStatusSchema.optional(),
  search: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  perPage: z.coerce.number().min(1).max(100).default(20),
});

export type CreateClubInput = z.infer<typeof createClubSchema>;
export type UpdateClubInput = z.infer<typeof updateClubSchema>;
export type ListClubsParams = z.infer<typeof listClubsSchema>;
