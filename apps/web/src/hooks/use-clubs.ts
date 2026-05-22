'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'
import type { PaginatedResponse, SingleResponse, ClubWithAthleteCount } from '@atlas/types'
import type { ListClubsInput, CreateClubInput, UpdateClubInput } from '@atlas/validators'

export const clubKeys = {
  all: ['clubs'] as const,
  list: (filters: Partial<ListClubsInput>) => ['clubs', 'list', filters] as const,
  detail: (slug: string) => ['clubs', 'detail', slug] as const,
}

export function useClubs(filters: Partial<ListClubsInput> = {}) {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined) params.set(k, String(v))
  })

  return useQuery({
    queryKey: clubKeys.list(filters),
    queryFn: () =>
      api.get<PaginatedResponse<ClubWithAthleteCount>>(`/api/clubs?${params.toString()}`),
  })
}

export function useClub(slug: string) {
  return useQuery({
    queryKey: clubKeys.detail(slug),
    queryFn: () => api.get<SingleResponse<ClubWithAthleteCount>>(`/api/clubs/${slug}`),
    enabled: Boolean(slug),
  })
}

export function useCreateClub(token: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateClubInput) =>
      api.post<SingleResponse<ClubWithAthleteCount>>('/api/clubs', input, { token }),
    onSuccess: () => qc.invalidateQueries({ queryKey: clubKeys.all }),
  })
}

export function useUpdateClub(id: string, token: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: UpdateClubInput) =>
      api.patch<SingleResponse<ClubWithAthleteCount>>(`/api/clubs/${id}`, input, { token }),
    onSuccess: () => qc.invalidateQueries({ queryKey: clubKeys.all }),
  })
}
