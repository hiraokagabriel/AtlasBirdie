import { z } from 'zod'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Accepts both:
 *   - datetime-local input format: "2026-05-22T10:00" or "2026-05-22T10:00:00"
 *   - Full ISO 8601 with offset:   "2026-05-22T10:00:00.000Z"
 *
 * z.string().datetime() only accepts the latter, which breaks <input type="datetime-local">.
 */
const datetimeField = z
  .string()
  .regex(
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})?)?$/,
    'Data inválida — use o formato AAAA-MM-DDTHH:MM',
  )

const optionalDatetimeField = datetimeField.optional()

// ---------------------------------------------------------------------------
// Step 1 — General info
// ---------------------------------------------------------------------------

const createTournamentBaseSchema = z.object({
  name: z.string().min(2).max(200),
  slug: z
    .string()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9-]+$/, 'Slug deve conter apenas letras minúsculas, números e hífens'),
  logoUrl: z.string().url().optional(),
  location: z.string().max(200).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(50).optional(),
  startDate: datetimeField,
  endDate: datetimeField,
  regulationUrl: z.string().url().optional(),
  regulationText: z.string().max(50_000).optional(),
  description: z.string().max(2000).optional(),
  registrationOpenAt: optionalDatetimeField,
  registrationCloseAt: optionalDatetimeField,
  maxInscriptionsGlobal: z.number().int().positive().optional(),
})

export const createTournamentSchema = createTournamentBaseSchema
  .refine((d) => new Date(d.endDate) >= new Date(d.startDate), {
    message: 'Data de término deve ser maior ou igual à data de início',
    path: ['endDate'],
  })
  .refine(
    (d) =>
      !d.registrationOpenAt ||
      !d.registrationCloseAt ||
      new Date(d.registrationCloseAt) >= new Date(d.registrationOpenAt),
    {
      message: 'Data de encerramento das inscrições deve ser após a abertura',
      path: ['registrationCloseAt'],
    },
  )

export const updateTournamentSchema = createTournamentBaseSchema
  .partial()
  .extend({
    status: z
      .enum([
        'DRAFT',
        'REGISTRATIONS_OPEN',
        'REGISTRATIONS_CLOSED',
        'IN_PROGRESS',
        'FINISHED',
        'ARCHIVED',
      ])
      .optional(),
  })
  .refine(
    (d) => !d.startDate || !d.endDate || new Date(d.endDate) >= new Date(d.startDate),
    {
      message: 'Data de término deve ser maior ou igual à data de início',
      path: ['endDate'],
    },
  )
  .refine(
    (d) =>
      !d.registrationOpenAt ||
      !d.registrationCloseAt ||
      new Date(d.registrationCloseAt) >= new Date(d.registrationOpenAt),
    {
      message: 'Data de encerramento das inscrições deve ser após a abertura',
      path: ['registrationCloseAt'],
    },
  )

export type CreateTournamentInput = z.infer<typeof createTournamentSchema>
export type UpdateTournamentInput = z.infer<typeof updateTournamentSchema>

// ---------------------------------------------------------------------------
// TournamentEvent — Step 2 + 3
// ---------------------------------------------------------------------------

export const tiebreakCriteriaValues = [
  'WINS',
  'SET_BALANCE',
  'POINT_BALANCE',
  'HEAD_TO_HEAD',
] as const

export const bracketFormatValues = [
  'SINGLE_ELIMINATION',
  'DOUBLE_ELIMINATION',
  'ROUND_ROBIN',
  'GROUPS_WITH_KNOCKOUT',
  'SWISS',
] as const

export const disciplineValues = ['MS', 'WS', 'MD', 'WD', 'XD'] as const

export const createEventSchema = z.object({
  discipline: z.enum(disciplineValues),
  category: z.string().min(1).max(100),
  bracketFormat: z.enum(bracketFormatValues).default('SINGLE_ELIMINATION'),
  maxInscriptions: z.number().int().positive().optional(),
  seedCount: z.number().int().min(0).max(32).default(4),
  bestOf: z
    .number()
    .int()
    .refine((n) => [1, 3, 5].includes(n), { message: 'bestOf deve ser 1, 3 ou 5' })
    .default(3),
  pointsPerGame: z.number().int().min(11).max(30).default(21),
  groupCount: z.number().int().positive().optional(),
  playersPerGroup: z.number().int().positive().optional(),
  advancePerGroup: z.number().int().positive().optional(),
  tiebreakCriteria: z
    .array(z.enum(tiebreakCriteriaValues))
    .default(['WINS', 'SET_BALANCE', 'POINT_BALANCE']),
  minIntervalMinutes: z.number().int().min(0).default(30),
  isPublic: z.boolean().default(true),
})

export const updateEventSchema = createEventSchema.partial()

export type CreateEventInput = z.infer<typeof createEventSchema>
export type UpdateEventInput = z.infer<typeof updateEventSchema>

// ---------------------------------------------------------------------------
// TournamentCourt — Step 5
// ---------------------------------------------------------------------------

export const createCourtSchema = z.object({
  name: z.string().min(1).max(100),
  type: z.enum(['MAIN', 'SECONDARY']).default('SECONDARY'),
  isShowCourt: z.boolean().default(false),
  openTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Formato HH:MM'),
  closeTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Formato HH:MM'),
  minIntervalMinutes: z.number().int().min(0).default(15),
})

export const updateCourtSchema = createCourtSchema.partial()

export type CreateCourtInput = z.infer<typeof createCourtSchema>
export type UpdateCourtInput = z.infer<typeof updateCourtSchema>

// ---------------------------------------------------------------------------
// List
// ---------------------------------------------------------------------------

export const listTournamentsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  perPage: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().optional(),
  status: z
    .enum([
      'DRAFT',
      'REGISTRATIONS_OPEN',
      'REGISTRATIONS_CLOSED',
      'IN_PROGRESS',
      'FINISHED',
      'ARCHIVED',
    ])
    .optional(),
})

export type ListTournamentsInput = z.infer<typeof listTournamentsSchema>
