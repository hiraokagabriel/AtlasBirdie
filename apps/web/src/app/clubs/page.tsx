'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/shared/navbar';
import { useClubs } from '@/hooks/use-clubs';

export default function ClubsPage() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useClubs({
    search: debouncedSearch,
    page,
    perPage: 20,
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Clubes</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              {data?.meta.total ?? '—'} clubes cadastrados
            </p>
          </div>
          <input
            type="search"
            placeholder="Buscar clube..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full sm:w-72 px-4 py-2 text-sm rounded-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {isLoading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-zinc-100 dark:border-zinc-800 p-5 animate-pulse">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800" />
                  <div className="flex-1">
                    <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded mb-2" />
                    <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {isError && (
          <div className="flex flex-col items-center py-20 text-center">
            <p className="text-zinc-500 dark:text-zinc-400">Não foi possível carregar os clubes.</p>
          </div>
        )}

        {data && data.data.length === 0 && (
          <div className="flex flex-col items-center py-20 text-center">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-zinc-300 dark:text-zinc-600 mb-4"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            <h3 className="font-medium text-zinc-900 dark:text-zinc-50 mb-1">Nenhum clube encontrado</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Tente buscar por outro nome.</p>
          </div>
        )}

        {data && data.data.length > 0 && (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.data.map((club) => (
                <Link
                  key={club.id}
                  href={`/clubs/${club.slug}`}
                  className="group flex flex-col p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-emerald-200 dark:hover:border-emerald-800 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center gap-4 mb-4">
                    {club.logoUrl ? (
                      <Image
                        src={club.logoUrl}
                        alt={club.name}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-xl object-contain"
                      />
                    ) : (
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-sm font-bold"
                        style={{ backgroundColor: club.primaryColor ?? '#01696f' }}
                      >
                        {club.acronym.slice(0, 2)}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-zinc-900 dark:text-zinc-50 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {club.name}
                      </p>
                      <p className="text-xs text-zinc-400 dark:text-zinc-500">{club.acronym}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-zinc-400 dark:text-zinc-500 mt-auto">
                    <span>{[club.city, club.state].filter(Boolean).join(', ') || '—'}</span>
                    <span>{club._count.athletes} atleta{club._count.athletes !== 1 ? 's' : ''}</span>
                  </div>
                </Link>
              ))}
            </div>

            {data.meta.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 text-sm rounded-full border border-zinc-200 dark:border-zinc-700 disabled:opacity-40 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  Anterior
                </button>
                <span className="text-sm text-zinc-500">{page} / {data.meta.totalPages}</span>
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
