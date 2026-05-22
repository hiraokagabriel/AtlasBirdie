export type ClubStatus = 'PENDING' | 'ACTIVE' | 'INACTIVE';

export interface ClubDTO {
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

export interface ClubPublicDTO {
  id: string;
  name: string;
  slug: string;
  acronym: string;
  logoUrl: string | null;
  city: string | null;
  state: string | null;
  country: string;
  athleteCount: number;
}
