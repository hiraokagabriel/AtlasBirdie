// Atlas Birdie — Tipos compartilhados
// Usados tanto pelo frontend (apps/web) quanto pelo backend (apps/api)

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

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
// Entidades
// ---------------------------------------------------------------------------

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  primaryColor: string;
  description: string | null;
  website: string | null;
  instagram: string | null;
  email: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Club {
  id: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface Athlete {
  id: string;
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
  createdAt: string;
  updatedAt: string;
  // Relações opcionais (populated)
  club?: Pick<Club, 'id' | 'name' | 'slug' | 'acronym' | 'logoUrl'>;
}

export interface AthleteWithClub extends Athlete {
  club: Pick<Club, 'id' | 'name' | 'slug' | 'acronym' | 'logoUrl'> | null;
}

export interface Pair {
  id: string;
  discipline: Discipline;
  athleteAId: string;
  athleteBId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  athleteA?: Pick<Athlete, 'id' | 'name' | 'slug' | 'photoUrl'>;
  athleteB?: Pick<Athlete, 'id' | 'name' | 'slug' | 'photoUrl'>;
}

export interface User {
  id: string;
  clerkId: string;
  email: string;
  name: string;
  role: UserRole;
  tenantId: string;
  athleteId: string | null;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Respostas paginadas
// ---------------------------------------------------------------------------

export interface PaginationMeta {
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface SingleResponse<T> {
  data: T;
}

// ---------------------------------------------------------------------------
// Filtros e queries
// ---------------------------------------------------------------------------

export interface AthleteFilters {
  search?: string;
  clubId?: string;
  status?: AthleteStatus;
  discipline?: Discipline;
  page?: number;
  perPage?: number;
}

export interface ClubFilters {
  search?: string;
  status?: ClubStatus;
  state?: string;
  page?: number;
  perPage?: number;
}
