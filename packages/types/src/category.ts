export type Discipline = 'MS' | 'WS' | 'MD' | 'WD' | 'XD'

export const DISCIPLINE_LABELS: Record<Discipline, string> = {
  MS: "Men's Singles",
  WS: "Women's Singles",
  MD: "Men's Doubles",
  WD: "Women's Doubles",
  XD: 'Mixed Doubles',
}

/** Disciplines that are doubles-based (require a Pair) */
export const DOUBLES_DISCIPLINES: Discipline[] = ['MD', 'WD', 'XD']

/** Disciplines restricted to a single gender */
export const GENDER_RESTRICTED_DISCIPLINES: Record<string, Discipline[]> = {
  M: ['MS', 'MD'],
  F: ['WS', 'WD'],
  ANY: ['XD'],
}

export type AllowedGender = 'M' | 'F' | 'ANY'

export interface Category {
  id: string
  tenantId: string
  name: string
  disciplines: Discipline[]
  allowedGender: AllowedGender
  minAge: number | null
  maxAge: number | null
  isActive: boolean
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface CreateCategoryInput {
  name: string
  disciplines: Discipline[]
  allowedGender: AllowedGender
  minAge?: number | null
  maxAge?: number | null
}

export interface UpdateCategoryInput extends Partial<CreateCategoryInput> {
  isActive?: boolean
}
