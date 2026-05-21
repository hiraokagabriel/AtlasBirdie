'use client';

import { useQuery } from '@tanstack/react-query';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333';

export interface Athlete {
  id: string;
  name: string;
  slug: string;
  photoUrl: string | null;
  city: string | null;
  state: string | null;
  country: string;
  status: string;
  createdAt: string;
  club: {
    id: string;
    name: string;
    slug: string;
    acronym: string;
    logoUrl: string | null;
  } | null;
}

export interface AthleteFull extends Athlete {
  birthDate: string | null;
  gender: string | null;
  handedness: string | null;
  rankingEntries: Array<{
    position: number;
    previousPosition: number | null;
    points: number;
    rankingConfig: { discipline: string; season: number };
  }>;
}

export interface ListMeta {
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface ListAthletesParams {
  search?: string;
  clubId?: string;
  status?: string;
  page?: number;
  perPage?: number;
}

async function fetchAthletes(params: ListAthletesParams): Promise<{ data: Athlete[]; meta: ListMeta }> {
  const qs = new URLSearchParams();
  if (params.search) qs.set('search', params.search);
  if (params.clubId) qs.set('clubId', params.clubId);
  if (params.status) qs.set('status', params.status);
  if (params.page) qs.set('page', String(params.page));
  if (params.perPage) qs.set('perPage', String(params.perPage));

  const res = await fetch(`${API_URL}/api/athletes?${qs.toString()}`);
  if (!res.ok) throw new Error('Erro ao buscar atletas');
  return res.json();
}

async function fetchAthleteBySlug(slug: string): Promise<{ data: AthleteFull }> {
  const res = await fetch(`${API_URL}/api/athletes/${slug}`);
  if (!res.ok) throw new Error('Atleta não encontrado');
  return res.json();
}

export function useAthletes(params: ListAthletesParams = {}) {
  return useQuery({
    queryKey: ['athletes', params],
    queryFn: () => fetchAthletes(params),
  });
}

export function useAthlete(slug: string) {
  return useQuery({
    queryKey: ['athlete', slug],
    queryFn: () => fetchAthleteBySlug(slug),
    enabled: !!slug,
  });
}
