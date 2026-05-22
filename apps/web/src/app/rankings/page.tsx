'use client';

import { useState } from 'react';
import { Navbar } from '@/components/shared/navbar';
import { useRankings } from '@/hooks/use-rankings';

export default function RankingsPage() {
  const [season, setSeason] = useState<string>('2026');
  const [category, setCategory] = useState<string>('adult');
  const [discipline, setDiscipline] = useState<string>('singles');

  const { data, isLoading, isError } = useRankings({ season, category, discipline });

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Rankings</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Classifica&#231;&#227;o nacional por temporada, categoria e disciplina.
            </p>
          </div>

          {/* Filtros básicos */}
          <div className="flex flex-wrap gap-3 text-xs">
            <select
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              className="px-3 py-2 rounded-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
            >
              <option value="2026">Temporada 2026</option>
              <option value="2025">Temporada 2025</option>
            </select>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-3 py-2 rounded-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
            >
              <option value="adult">Adulto</option>
              <option value="u19">Sub-19</option>
              <option value="u17">Sub-17</option>
            </select>
            <select
              value={discipline}
              onChange={(e) => setDiscipline(e.target.value)}
              className="px-3 py-2 rounded-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
            >
              <option value="singles">Simples</option>
              <option value="doubles">Duplas</option>
              <option value="mixed">Duplas mistas</option>
            </select>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="space-y-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-10 rounded-lg border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 animate-pulse" />
            ))}
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="flex flex-col items-center py-16 text-center">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">N&#227;o foi poss&#237;vel carregar o ranking.</p>
          </div>
        )}

        {/* Empty */}
        {data && data.entries.length === 0 && (
          <div className="flex flex-col items-center py-16 text-center">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Nenhum ranking dispon&#237;vel para esse filtro.</p>
          </div>
        )}

        {/* List */}
        {data && data.entries.length > 0 && (
          <div className="overflow-x-auto rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            <table className="min-w-full text-xs">
              <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800">
                <tr className="text-left text-[11px] text-zinc-500 dark:text-zinc-400">
                  <th className="px-4 py-2">Pos</th>
                  <th className="px-4 py-2">Atleta / Par</th>
                  <th className="px-4 py-2">Clube</th>
                  <th className="px-4 py-2 text-right">Pontos</th>
                </tr>
              </thead>
              <tbody>
                {data.entries.map((entry) => (
                  <tr key={entry.id} className="border-b border-zinc-50 dark:border-zinc-900 last:border-b-0">
                    <td className="px-4 py-2 align-middle text-zinc-400 dark:text-zinc-500">
                      {entry.position}
                    </td>
                    <td className="px-4 py-2 align-middle">
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-zinc-900 dark:text-zinc-50">
                          {entry.name}
                        </span>
                        {entry.partnerName && (
                          <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
                            com {entry.partnerName}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2 align-middle text-[11px] text-zinc-400 dark:text-zinc-500">
                      {entry.clubAcronym ?? '\u2014'}
                    </td>
                    <td className="px-4 py-2 align-middle text-right text-xs font-semibold text-zinc-900 dark:text-zinc-50">
                      {entry.points.toLocaleString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
