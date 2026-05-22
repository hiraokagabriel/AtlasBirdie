'use client';

import { useRankings } from '@/hooks/use-rankings';

export default function AdminRankingsPage() {
  const { data, isLoading } = useRankings({});

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Rankings</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Rankings são calculados automaticamente após o encerramento de torneios via fila BullMQ.
          </p>
        </div>
      </div>

      {isLoading ? (
        <p className="text-sm text-zinc-400">Carregando...</p>
      ) : (
        <div className="rounded-xl border border-zinc-100 dark:border-zinc-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 dark:bg-zinc-900">
              <tr className="border-b border-zinc-100 dark:border-zinc-800 text-left">
                <th className="px-4 py-3 font-medium text-zinc-600 dark:text-zinc-400">Modalidade</th>
                <th className="px-4 py-3 font-medium text-zinc-600 dark:text-zinc-400">Categoria</th>
                <th className="px-4 py-3 font-medium text-zinc-600 dark:text-zinc-400">Temporada</th>
                <th className="px-4 py-3 font-medium text-zinc-600 dark:text-zinc-400">Entradas</th>
                <th className="px-4 py-3 font-medium text-zinc-600 dark:text-zinc-400">Última atualização</th>
              </tr>
            </thead>
            <tbody>
              {!data?.data?.length ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-sm text-zinc-400">
                    Nenhum ranking publicado ainda. Os rankings serão gerados automaticamente após a conclusion de torneios.
                  </td>
                </tr>
              ) : (
                data.data.map((ranking) => (
                  <tr key={ranking.id} className="border-b border-zinc-100 dark:border-zinc-800 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-50">{ranking.discipline}</td>
                    <td className="px-4 py-3 text-zinc-500">{ranking.category}</td>
                    <td className="px-4 py-3 text-zinc-500 tabular-nums">{ranking.season}</td>
                    <td className="px-4 py-3 text-zinc-500 tabular-nums">{ranking.entryCount ?? '—'}</td>
                    <td className="px-4 py-3 text-zinc-500 tabular-nums text-xs">
                      {ranking.updatedAt ? new Date(ranking.updatedAt).toLocaleString('pt-BR') : '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
