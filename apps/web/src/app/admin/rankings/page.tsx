'use client';

import { useRankings } from '@/hooks/use-rankings';

export default function AdminRankingsPage() {
  const { data, isLoading } = useRankings({});

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Rankings</h1>
      </div>

      {isLoading ? (
        <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 animate-pulse" />)}</div>
      ) : (
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 dark:bg-zinc-800/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wide">Posição</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wide">Atleta</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wide">Disciplina</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wide">Pontos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {(!data || (data as unknown[]).length === 0) && (
                <tr><td colSpan={4} className="px-4 py-10 text-center text-sm text-zinc-400">Nenhum dado de ranking disponível.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
