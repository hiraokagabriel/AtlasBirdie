export const Discipline = {
  MS: 'MS',
  WS: 'WS',
  MD: 'MD',
  WD: 'WD',
  XD: 'XD',
} as const
export type Discipline = (typeof Discipline)[keyof typeof Discipline]

export const AthleteStatus = {
  PENDING: 'PENDING',
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
  INACTIVE: 'INACTIVE',
} as const
export type AthleteStatus = (typeof AthleteStatus)[keyof typeof AthleteStatus]

export const ClubStatus = {
  PENDING: 'PENDING',
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
} as const
export type ClubStatus = (typeof ClubStatus)[keyof typeof ClubStatus]

export const TournamentStatus = {
  DRAFT: 'DRAFT',
  REGISTRATIONS_OPEN: 'REGISTRATIONS_OPEN',
  REGISTRATIONS_CLOSED: 'REGISTRATIONS_CLOSED',
  IN_PROGRESS: 'IN_PROGRESS',
  FINISHED: 'FINISHED',
  ARCHIVED: 'ARCHIVED',
} as const
export type TournamentStatus = (typeof TournamentStatus)[keyof typeof TournamentStatus]

export const UserRole = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  FEDERATION_ADMIN: 'FEDERATION_ADMIN',
  TOURNAMENT_ORGANIZER: 'TOURNAMENT_ORGANIZER',
  REFEREE: 'REFEREE',
  CLUB_MANAGER: 'CLUB_MANAGER',
  ATHLETE: 'ATHLETE',
  PUBLIC: 'PUBLIC',
} as const
export type UserRole = (typeof UserRole)[keyof typeof UserRole]

export const MatchStatus = {
  SCHEDULED: 'SCHEDULED',
  IN_PROGRESS: 'IN_PROGRESS',
  FINISHED: 'FINISHED',
  WALKOVER: 'WALKOVER',
  RETIRED: 'RETIRED',
  ABANDONED: 'ABANDONED',
  NO_MATCH: 'NO_MATCH',
} as const
export type MatchStatus = (typeof MatchStatus)[keyof typeof MatchStatus]

export const BracketFormat = {
  SINGLE_ELIMINATION: 'SINGLE_ELIMINATION',
  DOUBLE_ELIMINATION: 'DOUBLE_ELIMINATION',
  ROUND_ROBIN: 'ROUND_ROBIN',
  GROUPS_WITH_KNOCKOUT: 'GROUPS_WITH_KNOCKOUT',
  SWISS: 'SWISS',
} as const
export type BracketFormat = (typeof BracketFormat)[keyof typeof BracketFormat]
