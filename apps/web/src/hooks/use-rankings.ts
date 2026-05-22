import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface RankingEntry {
  id: string;
  position: number;
  name: string;
  partnerName?: string | null;
  clubAcronym?: string | null;
  points: number;
}

interface RankingsResponse {
  entries: RankingEntry[];
}

interface UseRankingsParams {
  season: string;
  category: string;
  discipline: string;
}

export function useRankings({ season, category, discipline }: UseRankingsParams) {
  return useQuery<RankingsResponse>({
    queryKey: ['rankings', { season, category, discipline }],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set('season', season);
      params.set('category', category);
      params.set('discipline', discipline);

      const res = await api.get<RankingsResponse>(`/api/rankings?${params.toString()}`);
      return res.data;
    },
    staleTime: 1000 * 30,
    placeholderData: keepPreviousData,
  });
}
