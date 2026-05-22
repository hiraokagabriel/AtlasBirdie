import type { ClubStatus } from './enums'

export interface Club {
  id: string
  tenantId: string
  name: string
  slug: string
  acronym: string
  logoUrl: string | null
  primaryColor: string | null
  city: string | null
  state: string | null
  country: string
  status: ClubStatus
  createdAt: string
  updatedAt: string
}

export type ClubPublic = Omit<Club, 'tenantId'>

export interface ClubWithAthleteCount extends Club {
  _count: { athletes: number }
}

export interface CreateClubInput {
  name: string
  slug: string
  acronym: string
  logoUrl?: string
  primaryColor?: string
  city?: string
  state?: string
  country?: string
}

export interface UpdateClubInput extends Partial<CreateClubInput> {
  status?: ClubStatus
}
