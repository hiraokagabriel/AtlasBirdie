'use client';

import { useQuery } from '@tanstack/react-query';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333';

export interface Club {
  id: string;
  name: string;
  slug: string;
  acronym: string;
  logoUrl: string | null;
  primaryColor: string | null;
  city: string | null;
  state: string | null;
  country: string;
  status: string;
  createdAt: string;
  _count: { athletes: number };
}

export interface ClubFull extends Omit<Club, '_count'> {
  athletes: Array<{
    id: string;
    name: string;
    slug: string;
    photoUrl: string | null;
    city: string | null;
    state: string | null;
    status: string;
  }>;
}

export interface ListClubsParams {
  search?: string;
  status?: string;
  page?: number;
  perPage?: number;
}

async function fetchClubs(params: ListClubsParams): Promise<{ data: Club[]; meta: { total: number; page: number; perPage: number; totalPages: number } }> {
  const qs = new URLSearchParams();
  if (params.search) qs.set('search', params.search);
  if (params.status) qs.set('status', params.status);
  if (params.page) qs.set('page', String(params.page));
  if (params.perPage) qs.set('perPage', String(params.perPage));

  const res = await fetch(`${API_URL}/api/clubs?${qs.toString()}`);
  if (!res.ok) throw new Error('Erro ao buscar clubes');
  return res.json();
}

async function fetchClubBySlug(slug: string): Promise<{ data: ClubFull }> {
  const res = await fetch(`${API_URL}/api/clubs/${slug}`);
  if (!res.ok) throw new Error('Clube não encontrado');
  return res.json();
}

export function useClubs(params: ListClubsParams = {}) {
  return useQuery({
    queryKey: ['clubs', params],
    queryFn: () => fetchClubs(params),
  });
}

export function useClub(slug: string) {
  return useQuery({
    queryKey: ['club', slug],
    queryFn: () => fetchClubBySlug(slug),
    enabled: !!slug,
  });
}
