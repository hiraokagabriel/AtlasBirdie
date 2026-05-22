'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { AthleteDTO, PaginatedResponse, SingleResponse } from '@atlas-birdie/types';

export const athleteKeys = {
  all: ['athletes'] as const,
  list: (params: Record<string, unknown>) => [...athleteKeys.all, 'list', params] as const,
  detail: (slug: string) => [...athleteKeys.all, 'detail', slug] as const,
};

export function useAthletes(params: { page?: number; perPage?: number; search?: string; clubId?: string; status?: string } = {}) {
  return useQuery({
    queryKey: athleteKeys.list(params),
    queryFn: () => api.get<PaginatedResponse<AthleteDTO>>('/athletes', params),
  });
}

export function useAthlete(slug: string) {
  return useQuery({
    queryKey: athleteKeys.detail(slug),
    queryFn: () => api.get<SingleResponse<AthleteDTO>>(`/athletes/${slug}`),
    enabled: Boolean(slug),
  });
}

export function useCreateAthlete() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) => api.post<SingleResponse<AthleteDTO>>('/athletes', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: athleteKeys.all }),
  });
}

export function useUpdateAthlete() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) =>
      api.patch<SingleResponse<AthleteDTO>>(`/athletes/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: athleteKeys.all }),
  });
}

export function useDeleteAthlete() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/athletes/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: athleteKeys.all }),
  });
}
