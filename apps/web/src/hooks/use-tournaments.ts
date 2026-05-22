'use client'

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { CreateTournamentInput, UpdateTournamentInput, CreateEventInput } from '@atlas/validators'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TournamentListItem {
  id: string
  slug: string
  name: string
  city: string | null
  state: string | null
  statusLabel: string
  periodLabel: string
  eventsCount: number
  status: string
  logoUrl: string | null
}

export interface TournamentDetail extends Omit<TournamentListItem, 'eventsCount' | 'periodLabel'> {
  location: string | null
  startDate: string
  endDate: string
  description: string | null
  regulationUrl: string | null
  regulationText: string | null
  registrationOpenAt: string | null
  registrationCloseAt: string | null
  maxInscriptionsGlobal: number | null
  events: TournamentEventItem[]
}

export interface TournamentEventItem {
  id: string
  tournamentId: string
  discipline: string
  category: string
  bracketFormat: string
  maxInscriptions: number | null
  seedCount: number
  bestOf: number
  pointsPerGame: number
  groupCount: number | null
  playersPerGroup: number | null
  advancePerGroup: number | null
  tiebreakCriteria: string[]
  minIntervalMinutes: number
  isPublic: boolean
  status: string
}

interface TournamentsResponse {
  data: TournamentListItem[]
  meta: { total: number; page: number; perPage: number; totalPages: number }
}

interface SingleResponse<T> {
  data: T
}

// ---------------------------------------------------------------------------
// Query keys
// ---------------------------------------------------------------------------

export const tournamentKeys = {
  all: ['tournaments'] as const,
  list: (f: Record<string, unknown>) => ['tournaments', 'list', f] as const,
  detail: (slug: string) => ['tournaments', 'detail', slug] as const,
}

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

interface UseTournamentsParams {
  search?: string
  page?: number
  perPage?: number
  status?: string
}

export function useTournaments({ search = '', page = 1, perPage = 20, status }: UseTournamentsParams = {}) {
  return useQuery<TournamentsResponse>({
    queryKey: tournamentKeys.list({ search, page, perPage, status }),
    queryFn: async () => {
      const params = new URLSearchParams()
      params.set('page', String(page))
      params.set('perPage', String(perPage))
      if (search.trim()) params.set('search', search.trim())
      if (status) params.set('status', status)
      const res = await api.get<TournamentsResponse>(`/api/tournaments?${params.toString()}`)
      return res
    },
    staleTime: 1000 * 30,
    placeholderData: keepPreviousData,
  })
}

export function useTournament(slug: string) {
  return useQuery<SingleResponse<TournamentDetail>>({
    queryKey: tournamentKeys.detail(slug),
    queryFn: () => api.get<SingleResponse<TournamentDetail>>(`/api/tournaments/${slug}`),
    enabled: Boolean(slug),
    staleTime: 1000 * 60,
  })
}

export function useCreateTournament(token: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateTournamentInput) =>
      api.post<SingleResponse<TournamentDetail>>('/api/tournaments', input, { token }),
    onSuccess: () => qc.invalidateQueries({ queryKey: tournamentKeys.all }),
  })
}

export function useUpdateTournament(id: string, token: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: UpdateTournamentInput) =>
      api.patch<SingleResponse<TournamentDetail>>(`/api/tournaments/${id}`, input, { token }),
    onSuccess: () => qc.invalidateQueries({ queryKey: tournamentKeys.all }),
  })
}

export function useDeleteTournament(token: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      api.delete<void>(`/api/tournaments/${id}`, { token }),
    onSuccess: () => qc.invalidateQueries({ queryKey: tournamentKeys.all }),
  })
}

export function useCreateEvent(tournamentId: string, token: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateEventInput) =>
      api.post<SingleResponse<TournamentEventItem>>(
        `/api/tournaments/${tournamentId}/events`,
        input,
        { token },
      ),
    onSuccess: () => qc.invalidateQueries({ queryKey: tournamentKeys.all }),
  })
}

export function useDeleteEvent(tournamentId: string, token: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (eventId: string) =>
      api.delete<void>(`/api/tournaments/${tournamentId}/events/${eventId}`, { token }),
    onSuccess: () => qc.invalidateQueries({ queryKey: tournamentKeys.all }),
  })
}
