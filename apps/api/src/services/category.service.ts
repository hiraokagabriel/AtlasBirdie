import type { PrismaClient } from '../generated/prisma'
import type { CreateCategoryInput, UpdateCategoryInput, ListCategoriesQuery } from '@atlas-birdie/validators'

// Gender rules per discipline enforced by BWF
const DISCIPLINE_GENDER_RULES: Record<string, string[]> = {
  MS: ['M'],
  WS: ['F'],
  MD: ['M'],
  WD: ['F'],
  XD: ['M', 'F', 'ANY'],
}

export function validateGenderForDisciplines(
  disciplines: string[],
  allowedGender: string,
): void {
  if (allowedGender === 'ANY') return

  for (const disc of disciplines) {
    const allowed = DISCIPLINE_GENDER_RULES[disc] ?? []
    if (!allowed.includes(allowedGender) && !allowed.includes('ANY')) {
      throw new Error(
        `Discipline ${disc} does not allow gender "${allowedGender}". ` +
        `Allowed: ${allowed.join(', ')}`,
      )
    }
  }
}

export class CategoryService {
  constructor(private readonly db: PrismaClient) {}

  async list(tenantId: string, query: ListCategoriesQuery) {
    const { discipline, isActive, page, perPage } = query
    const skip = (page - 1) * perPage

    const where = {
      tenantId,
      deletedAt: null,
      ...(isActive !== undefined ? { isActive } : {}),
      ...(discipline ? { disciplines: { has: discipline } } : {}),
    }

    const [data, total] = await Promise.all([
      this.db.category.findMany({ where, skip, take: perPage, orderBy: { name: 'asc' } }),
      this.db.category.count({ where }),
    ])

    return { data, meta: { total, page, perPage } }
  }

  async create(tenantId: string, input: CreateCategoryInput) {
    validateGenderForDisciplines(input.disciplines, input.allowedGender ?? 'ANY')

    const existing = await this.db.category.findUnique({
      where: { tenantId_name: { tenantId, name: input.name } },
    })
    if (existing && !existing.deletedAt) {
      throw new Error(`Category "${input.name}" already exists for this tenant`)
    }

    return this.db.category.create({
      data: {
        tenantId,
        name: input.name,
        disciplines: input.disciplines,
        allowedGender: input.allowedGender ?? 'ANY',
        minAge: input.minAge ?? null,
        maxAge: input.maxAge ?? null,
      },
    })
  }

  async update(tenantId: string, id: string, input: UpdateCategoryInput) {
    const category = await this.db.category.findFirst({
      where: { id, tenantId, deletedAt: null },
    })
    if (!category) throw new Error('Category not found')

    if (input.disciplines || input.allowedGender) {
      validateGenderForDisciplines(
        input.disciplines ?? category.disciplines,
        input.allowedGender ?? category.allowedGender,
      )
    }

    return this.db.category.update({
      where: { id },
      data: {
        ...input,
        updatedAt: new Date(),
      },
    })
  }

  async softDelete(tenantId: string, id: string) {
    const category = await this.db.category.findFirst({
      where: { id, tenantId, deletedAt: null },
    })
    if (!category) throw new Error('Category not found')

    return this.db.category.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
  }
}
