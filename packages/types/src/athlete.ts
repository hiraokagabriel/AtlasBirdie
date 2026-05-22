export type AthleteStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'INACTIVE';

export interface AthleteDTO {
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
}

export interface AthletePublicDTO {
  id: string;
  name: string;
  slug: string;
  photoUrl: string | null;
  city: string | null;
  state: string | null;
  country: string;
  club: { id: string; name: string; slug: string; logoUrl: string | null } | null;
}
