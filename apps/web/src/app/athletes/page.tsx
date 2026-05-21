'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/shared/navbar';
import { useAthletes } from '@/hooks/use-athletes';

export default function AthletesPage() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useAthletes({
    search: debouncedSearch,
    page,
    perPage: 24,
  });

  function handleSearch(value: string) {
    setSearch(value);
    clearTimeout((handleSearch as unknown as { timer?: ReturnType<typeof setTimeout> }).timer);
    (handleSearch as unknown as { timer?: ReturnType<typeof setTimeout> }).timer = setTimeout(() => {
      setDebouncedSearch(value);
      setPage(1);
    }, 400);
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Atletas</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              {data?.meta.total ?? '—'} atletas cadastrados
            </p>
          </div>
          <input
            type="search"
            placeholder="Buscar atleta..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full sm:w-72 px-4 py-2 text-sm rounded-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Estado de carregamento */}
        {isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-zinc-100 dark:border-zinc-800 p-4 animate-pulse">
                <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 mx-auto mb-3" />
                <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded mb-2" />
                <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded w-2/3 mx-auto" />
              </div>
            ))}
          </div>
        )}

        {/* Erro */}
        {isError && (
          <div className="flex flex-col items-center py-20 text-center">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-zinc-300 dark:text-zinc-600 mb-4"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
            <p className="text-zinc-500 dark:text-zinc-400">Não foi possível carregar os atletas.</p>
          </div>
        )}

        {/* Lista */}
        {data && data.data.length === 0 && (
          <div className="flex flex-col items-center py-20 text-center">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-zinc-300 dark:text-zinc-600 mb-4"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
            <h3 className="font-medium text-zinc-900 dark:text-zinc-50 mb-1">Nenhum atleta encontrado</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Tente buscar por outro nome.</p>
          </div>
        )}

        {data && data.data.length > 0 && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {data.data.map((athlete) => (
                <Link
                  key={athlete.id}
                  href={`/athletes/${athlete.slug}`}
                  className="group flex flex-col items-center text-center p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-emerald-200 dark:hover:border-emerald-800 hover:shadow-sm transition-all"
                >
                  {athlete.photoUrl ? (
                    <Image
                      src={athlete.photoUrl}
                      alt={athlete.name}
                      width={64}
                      height={64}
                      className="w-16 h-16 rounded-full object-cover mb-3"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-3">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-zinc-400"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                    </div>
                  )}
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                    {athlete.name}
                  </span>
                  {athlete.club && (
                    <span className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">{athlete.club.acronym}</span>
                  )}
                  {(athlete.city ?? athlete.state) && (
                    <span className="text-xs text-zinc-400 dark:text-zinc-500">
                      {[athlete.city, athlete.state].filter(Boolean).join(', ')}
                    </span>
                  )}
                </Link>
              ))}
            </div>

            {/* Paginação */}
            {data.meta.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 text-sm rounded-full border border-zinc-200 dark:border-zinc-700 disabled:opacity-40 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  Anterior
                </button>
                <span className="text-sm text-zinc-500">
                  {page} / {data.meta.totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(data.meta.totalPages, p + 1))}
                  disabled={page === data.meta.totalPages}
                  className="px-4 py-2 text-sm rounded-full border border-zinc-200 dark:border-zinc-700 disabled:opacity-40 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  Próxima
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
