'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { ClubDTO, PaginatedResponse, SingleResponse } from '@atlas-birdie/types';

export const clubKeys = {
  all: ['clubs'] as const,
  list: (params: Record<string, unknown>) => [...clubKeys.all, 'list', params] as const,
  detail: (slug: string) => [...clubKeys.all, 'detail', slug] as const,
};

export function useClubs(params: { page?: number; perPage?: number; search?: string; status?: string } = {}) {
  return useQuery({
    queryKey: clubKeys.list(params),
    queryFn: () => api.get<PaginatedResponse<ClubDTO>>('/clubs', params),
  });
}

export function useClub(slug: string) {
  return useQuery({
    queryKey: clubKeys.detail(slug),
    queryFn: () => api.get<SingleResponse<ClubDTO>>(`/clubs/${slug}`),
    enabled: Boolean(slug),
  });
}

export function useCreateClub() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) => api.post<SingleResponse<ClubDTO>>('/clubs', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: clubKeys.all }),
  });
}

export function useUpdateClub() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) =>
      api.patch<SingleResponse<ClubDTO>>(`/clubs/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: clubKeys.all }),
  });
}

export function useDeleteClub() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/clubs/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: clubKeys.all }),
  });
}
