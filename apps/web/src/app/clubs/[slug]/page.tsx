'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/shared/navbar';
import { useClub } from '@/hooks/use-clubs';

export default function ClubProfilePage() {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading, isError } = useClub(slug);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950">
        <Navbar />
        <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 animate-pulse">
          <div className="flex items-center gap-5 mb-10">
            <div className="w-20 h-20 rounded-2xl bg-zinc-100 dark:bg-zinc-800" />
            <div className="flex-1">
              <div className="h-6 bg-zinc-100 dark:bg-zinc-800 rounded w-1/2 mb-3" />
              <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded w-1/3" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950">
        <Navbar />
        <main className="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center">
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">Clube não encontrado</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mb-6">O clube que você procura não existe ou foi removido.</p>
          <Link href="/clubs" className="text-sm font-medium text-emerald-600 hover:underline">← Voltar para clubes</Link>
        </main>
      </div>
    );
  }

  const club = data.data;

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        {/* Breadcrumb */}
        <nav className="text-xs text-zinc-400 dark:text-zinc-500 mb-6">
          <Link href="/clubs" className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">Clubes</Link>
          <span className="mx-2">/</span>
          <span className="text-zinc-600 dark:text-zinc-300">{club.name}</span>
        </nav>

        {/* Header do clube */}
        <div className="flex items-start gap-5 mb-10">
          {club.logoUrl ? (
            <Image
              src={club.logoUrl}
              alt={club.name}
              width={80}
              height={80}
              className="w-20 h-20 rounded-2xl object-contain flex-shrink-0"
            />
          ) : (
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0"
              style={{ backgroundColor: club.primaryColor ?? '#01696f' }}
            >
              {club.acronym.slice(0, 2)}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{club.name}</h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              <span className="font-medium text-zinc-700 dark:text-zinc-300">{club.acronym}</span>
              {(club.city ?? club.state) && (
                <span>{[club.city, club.state].filter(Boolean).join(', ')}</span>
              )}
            </div>
          </div>
        </div>

        {/* Atletas */}
        <section>
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider mb-4">
            Atletas
            <span className="ml-2 text-zinc-400 font-normal normal-case tracking-normal">
              ({club.athletes.length})
            </span>
          </h2>

          {club.athletes.length === 0 && (
            <div className="flex flex-col items-center py-12 text-center border border-zinc-100 dark:border-zinc-800 rounded-2xl">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-zinc-300 dark:text-zinc-600 mb-3"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Nenhum atleta ativo neste clube.</p>
            </div>
          )}

          {club.athletes.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {club.athletes.map((athlete) => (
                <Link
                  key={athlete.id}
                  href={`/athletes/${athlete.slug}`}
                  className="group flex flex-col items-center text-center p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 hover:border-emerald-200 dark:hover:border-emerald-800 hover:shadow-sm transition-all"
                >
                  {athlete.photoUrl ? (
                    <Image
                      src={athlete.photoUrl}
                      alt={athlete.name}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full object-cover mb-2"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center mb-2">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-zinc-400"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                    </div>
                  )}
                  <span className="text-xs font-medium text-zinc-900 dark:text-zinc-50 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                    {athlete.name}
                  </span>
                  {(athlete.city ?? athlete.state) && (
                    <span className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
                      {[athlete.city, athlete.state].filter(Boolean).join(', ')}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
