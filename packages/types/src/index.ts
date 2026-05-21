// Atlas Birdie — Shared Types
// Importado por apps/web e apps/api

export type Discipline = 'MS' | 'WS' | 'MD' | 'WD' | 'XD';

export type AthleteStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'INACTIVE';

export type ClubStatus = 'PENDING' | 'ACTIVE' | 'INACTIVE';

export type UserRole =
  | 'SUPER_ADMIN'
  | 'FEDERATION_ADMIN'
  | 'TOURNAMENT_ORGANIZER'
  | 'REFEREE'
  | 'CLUB_MANAGER'
  | 'ATHLETE'
  | 'PUBLIC';

export type TournamentStatus =
  | 'DRAFT'
  | 'REGISTRATIONS_OPEN'
  | 'REGISTRATIONS_CLOSED'
  | 'IN_PROGRESS'
  | 'FINISHED'
  | 'ARCHIVED';

export type BracketFormat =
  | 'SINGLE_ELIMINATION'
  | 'DOUBLE_ELIMINATION'
  | 'ROUND_ROBIN'
  | 'GROUPS_WITH_KNOCKOUT'
  | 'SWISS';

export type MatchStatus =
  | 'SCHEDULED'
  | 'IN_PROGRESS'
  | 'FINISHED'
  | 'WALKOVER'
  | 'RETIRED'
  | 'ABANDONED'
  | 'NO_MATCH';

export type InscriptionStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'WAITLIST';

// ---------------------------------------------------------------------------
// Base
// ---------------------------------------------------------------------------

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Club
// ---------------------------------------------------------------------------

export interface ClubSummary {
  id: string;
  name: string;
  slug: string;
  acronym: string;
  logoUrl: string | null;
}

export interface Club extends BaseEntity {
  tenantId: string;
  name: string;
  slug: string;
  acronym: string;
  logoUrl: string | null;
  primaryColor: string | null;
  city: string | null;
  state: string | null;
  country: string;
  status: ClubStatus;
}

// ---------------------------------------------------------------------------
// Athlete
// ---------------------------------------------------------------------------

export interface AthleteSummary {
  id: string;
  name: string;
  slug: string;
  photoUrl: string | null;
  club: ClubSummary | null;
}

export interface Athlete extends BaseEntity {
  tenantId: string;
  clubId: string | null;
  name: string;
  slug: string;
  photoUrl: string | null;
  birthDate: string | null;
  gender: string | null;
  handedness: string | null;
  city: string | null;
  state: string | null;
  country: string;
  status: AthleteStatus;
  club: ClubSummary | null;
}

// ---------------------------------------------------------------------------
// Pair
// ---------------------------------------------------------------------------

export interface Pair extends BaseEntity {
  discipline: Discipline;
  athleteAId: string;
  athleteBId: string;
  isActive: boolean;
  athleteA: AthleteSummary;
  athleteB: AthleteSummary;
}

// ---------------------------------------------------------------------------
// Ranking
// ---------------------------------------------------------------------------

export interface RankingEntry {
  id: string;
  position: number;
  previousPosition: number | null;
  points: number;
  tournamentsCount: number;
  rankingConfig: {
    discipline: Discipline;
    season: number;
  };
}

// ---------------------------------------------------------------------------
// API response wrappers
// ---------------------------------------------------------------------------

export interface ApiMeta {
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface ApiListResponse<T> {
  data: T[];
  meta: ApiMeta;
}

export interface ApiItemResponse<T> {
  data: T;
}

export interface ApiError {
  error: string;
  code: string;
  details?: unknown;
}
