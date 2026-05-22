import type { TournamentStatus, BracketFormat, Discipline } from './enums'

export interface Tournament {
  id: string
  tenantId: string
  name: string
  slug: string
  logoUrl: string | null
  location: string | null
  city: string | null
  state: string | null
  startDate: string
  endDate: string
  status: TournamentStatus
  regulationUrl: string | null
  description: string | null
  createdAt: string
  updatedAt: string
}

export interface TournamentEvent {
  id: string
  tournamentId: string
  discipline: Discipline
  category: string
  bracketFormat: BracketFormat
  maxInscriptions: number | null
  status: TournamentStatus
  seedingClosedAt: string | null
  createdAt: string
  updatedAt: string
}
