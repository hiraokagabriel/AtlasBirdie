import type { AthleteStatus } from './enums'

export interface Athlete {
  id: string
  tenantId: string
  clubId: string | null
  name: string
  slug: string
  photoUrl: string | null
  birthDate: string | null
  gender: string | null
  handedness: string | null
  city: string | null
  state: string | null
  country: string
  status: AthleteStatus
  createdAt: string
  updatedAt: string
}

/** Public-safe subset — never expose document/CPF */
export type AthletePublic = Omit<Athlete, 'tenantId'>

export interface AthleteWithClub extends Athlete {
  club: {
    id: string
    name: string
    slug: string
    acronym: string
    logoUrl: string | null
  } | null
}

export interface CreateAthleteInput {
  name: string
  slug: string
  document?: string
  photoUrl?: string
  birthDate?: string
  gender?: string
  handedness?: string
  city?: string
  state?: string
  country?: string
  clubId?: string
}

export interface UpdateAthleteInput extends Partial<CreateAthleteInput> {
  status?: AthleteStatus
}
