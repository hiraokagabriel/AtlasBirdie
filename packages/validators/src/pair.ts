import { z } from 'zod';

export const disciplineSchema = z.enum(['MS', 'WS', 'MD', 'WD', 'XD']);

export const createPairSchema = z
  .object({
    discipline: disciplineSchema,
    athleteAId: z.string().min(1),
    athleteBId: z.string().min(1),
  })
  .refine((d) => d.athleteAId !== d.athleteBId, {
    message: 'athleteAId and athleteBId must be different athletes',
    path: ['athleteBId'],
  });

export const listPairsSchema = z.object({
  athleteId: z.string().optional(),
  discipline: disciplineSchema.optional(),
  isActive: z
    .string()
    .optional()
    .transform((v) => (v === undefined ? undefined : v === 'true')),
  page: z.coerce.number().min(1).default(1),
  perPage: z.coerce.number().min(1).max(100).default(20),
});

export type CreatePairInput = z.infer<typeof createPairSchema>;
export type ListPairsParams = z.infer<typeof listPairsSchema>;
