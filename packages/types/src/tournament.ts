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
  regulationText: string | null
  description: string | null
  registrationOpenAt: string | null
  registrationCloseAt: string | null
  maxInscriptionsGlobal: number | null
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
  seedCount: number
  bestOf: number
  pointsPerGame: number
  groupCount: number | null
  playersPerGroup: number | null
  advancePerGroup: number | null
  tiebreakCriteria: string[]
  minIntervalMinutes: number
  isPublic: boolean
  status: TournamentStatus
  seedingClosedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface TournamentCourt {
  id: string
  tournamentId: string
  name: string
  type: 'MAIN' | 'SECONDARY'
  isShowCourt: boolean
  openTime: string
  closeTime: string
  minIntervalMinutes: number
  createdAt: string
  updatedAt: string
}

export interface TournamentWizardDraft {
  step1?: {
    name: string
    slug: string
    description?: string
    city?: string
    state?: string
    location?: string
    startDate: string
    endDate: string
    logoUrl?: string
  }
  step2?: {
    events: Array<{
      discipline: Discipline
      category: string
    }>
  }
  step3?: {
    events: Array<{
      discipline: Discipline
      category: string
      bracketFormat: BracketFormat
      seedCount: number
      bestOf: number
      pointsPerGame: number
      groupCount?: number
      playersPerGroup?: number
      advancePerGroup?: number
      tiebreakCriteria: string[]
      minIntervalMinutes: number
    }>
  }
  step4?: {
    registrationOpenAt: string
    registrationCloseAt: string
    maxInscriptionsGlobal?: number
    events: Array<{
      discipline: Discipline
      category: string
      maxInscriptions?: number
    }>
  }
  step5?: {
    courts: Array<{
      name: string
      type: 'MAIN' | 'SECONDARY'
      isShowCourt: boolean
      openTime: string
      closeTime: string
      minIntervalMinutes: number
    }>
  }
  step6?: {
    regulationUrl?: string
    regulationText?: string
  }
}
