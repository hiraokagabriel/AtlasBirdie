import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface TournamentListItem {
  id: string;
  slug: string;
  name: string;
  city: string | null;
  state: string | null;
  statusLabel: string;
  periodLabel: string;
  eventsCount: number;
}

interface UseTournamentsParams {
  search?: string;
  page?: number;
  perPage?: number;
}

interface TournamentsResponse {
  data: TournamentListItem[];
  meta: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
}

export function useTournaments({ search = '', page = 1, perPage = 12 }: UseTournamentsParams) {
  return useQuery<TournamentsResponse>({
    queryKey: ['tournaments', { search, page, perPage }],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('perPage', String(perPage));
      if (search.trim()) params.set('search', search.trim());

      const res = await api.get<TournamentsResponse>(`/api/tournaments?${params.toString()}`);
      return res.data;
    },
    staleTime: 1000 * 30,
    keepPreviousData: true,
  });
}
