import { z } from 'zod';

export const createPairSchema = z.object({
  discipline: z.enum(['MS', 'WS', 'MD', 'WD', 'XD']),
  athleteAId: z.string().cuid(),
  athleteBId: z.string().cuid(),
}).refine((d) => d.athleteAId !== d.athleteBId, {
  message: 'athleteAId and athleteBId must be different athletes',
});

export type CreatePairInput = z.infer<typeof createPairSchema>;
