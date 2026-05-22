'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'
import type { PaginatedResponse, SingleResponse, AthleteWithClub } from '@atlas/types'
import type { ListAthletesInput, CreateAthleteInput, UpdateAthleteInput } from '@atlas/validators'

export const athleteKeys = {
  all: ['athletes'] as const,
  list: (filters: Partial<ListAthletesInput>) => ['athletes', 'list', filters] as const,
  detail: (slug: string) => ['athletes', 'detail', slug] as const,
}

export function useAthletes(filters: Partial<ListAthletesInput> = {}) {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined) params.set(k, String(v))
  })

  return useQuery({
    queryKey: athleteKeys.list(filters),
    queryFn: () =>
      api.get<PaginatedResponse<AthleteWithClub>>(`/api/athletes?${params.toString()}`),
  })
}

export function useAthlete(slug: string) {
  return useQuery({
    queryKey: athleteKeys.detail(slug),
    queryFn: () => api.get<SingleResponse<AthleteWithClub>>(`/api/athletes/${slug}`),
    enabled: Boolean(slug),
  })
}

export function useCreateAthlete(token: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateAthleteInput) =>
      api.post<SingleResponse<AthleteWithClub>>('/api/athletes', input, { token }),
    onSuccess: () => qc.invalidateQueries({ queryKey: athleteKeys.all }),
  })
}

export function useUpdateAthlete(id: string, token: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: UpdateAthleteInput) =>
      api.patch<SingleResponse<AthleteWithClub>>(`/api/athletes/${id}`, input, { token }),
    onSuccess: () => qc.invalidateQueries({ queryKey: athleteKeys.all }),
  })
}
