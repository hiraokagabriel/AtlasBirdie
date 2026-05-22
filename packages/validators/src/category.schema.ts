import { z } from 'zod'

export const DisciplineSchema = z.enum(['MS', 'WS', 'MD', 'WD', 'XD'])

export const AllowedGenderSchema = z.enum(['M', 'F', 'ANY'])

export const CreateCategorySchema = z.object({
  name: z.string().min(2).max(64),
  disciplines: z.array(DisciplineSchema).min(1),
  allowedGender: AllowedGenderSchema.default('ANY'),
  minAge: z.number().int().positive().nullable().optional(),
  maxAge: z.number().int().positive().nullable().optional(),
}).refine(
  (data) => {
    if (data.minAge != null && data.maxAge != null) {
      return data.maxAge > data.minAge
    }
    return true
  },
  { message: 'maxAge must be greater than minAge', path: ['maxAge'] },
)

export const UpdateCategorySchema = CreateCategorySchema.partial().extend({
  isActive: z.boolean().optional(),
})

export const CategoryParamsSchema = z.object({
  id: z.string().cuid(),
})

export const ListCategoriesQuerySchema = z.object({
  discipline: DisciplineSchema.optional(),
  isActive: z.coerce.boolean().optional(),
  page: z.coerce.number().int().positive().default(1),
  perPage: z.coerce.number().int().positive().max(100).default(20),
})

export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>
export type UpdateCategoryInput = z.infer<typeof UpdateCategorySchema>
export type ListCategoriesQuery = z.infer<typeof ListCategoriesQuerySchema>
