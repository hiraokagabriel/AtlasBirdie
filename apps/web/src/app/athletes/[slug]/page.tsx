'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/shared/navbar';
import { useAthlete } from '@/hooks/use-athletes';

const DISCIPLINE_LABEL: Record<string, string> = {
  MS: 'Simples Masculino',
  WS: 'Simples Feminino',
  MD: 'Duplas Masculino',
  WD: 'Duplas Feminino',
  XD: 'Duplas Mistas',
};

const POSITION_DELTA = (current: number, previous: number | null) => {
  if (previous === null) return null;
  const delta = previous - current;
  if (delta > 0) return { label: `+${delta}`, color: 'text-emerald-500' };
  if (delta < 0) return { label: `${delta}`, color: 'text-red-500' };
  return { label: '=', color: 'text-zinc-400' };
};

export default function AthleteProfilePage() {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading, isError } = useAthlete(slug);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950">
        <Navbar />
        <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex items-center gap-5 mb-8 animate-pulse">
            <div className="w-24 h-24 rounded-full bg-zinc-100 dark:bg-zinc-800" />
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
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">Atleta não encontrado</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mb-6">O perfil que você procura não existe ou foi removido.</p>
          <Link href="/athletes" className="text-sm font-medium text-emerald-600 hover:underline">← Voltar para atletas</Link>
        </main>
      </div>
    );
  }

  const athlete = data.data;
  const age = athlete.birthDate
    ? Math.floor((Date.now() - new Date(athlete.birthDate).getTime()) / (1000 * 60 * 60 * 24 * 365.25))
    : null;

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        {/* Breadcrumb */}
        <nav className="text-xs text-zinc-400 dark:text-zinc-500 mb-6">
          <Link href="/athletes" className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">Atletas</Link>
          <span className="mx-2">/</span>
          <span className="text-zinc-600 dark:text-zinc-300">{athlete.name}</span>
        </nav>

        {/* Perfil header */}
        <div className="flex items-start gap-5 mb-10">
          {athlete.photoUrl ? (
            <Image
              src={athlete.photoUrl}
              alt={athlete.name}
              width={96}
              height={96}
              className="w-24 h-24 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-zinc-400"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{athlete.name}</h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              {athlete.club && (
                <Link href={`/clubs/${athlete.club.slug}`} className="hover:text-emerald-600 transition-colors">
                  {athlete.club.name}
                </Link>
              )}
              {age !== null && <span>{age} anos</span>}
              {(athlete.city ?? athlete.state) && (
                <span>{[athlete.city, athlete.state].filter(Boolean).join(', ')}</span>
              )}
              {athlete.handedness && (
                <span>{athlete.handedness === 'R' ? 'Destro' : 'Canhoto'}</span>
              )}
            </div>
          </div>
        </div>

        {/* Rankings */}
        {athlete.rankingEntries.length > 0 && (
          <section className="mb-10">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider mb-4">Rankings</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {athlete.rankingEntries.map((entry, i) => {
                const delta = POSITION_DELTA(entry.position, entry.previousPosition);
                return (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
                    <div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {DISCIPLINE_LABEL[entry.rankingConfig.discipline] ?? entry.rankingConfig.discipline} · {entry.rankingConfig.season}
                      </p>
                      <p className="text-lg font-bold text-zinc-900 dark:text-zinc-50">#{entry.position}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-zinc-400">{entry.points} pts</p>
                      {delta && (
                        <p className={`text-xs font-medium ${delta.color}`}>{delta.label}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Sem ranking ainda */}
        {athlete.rankingEntries.length === 0 && (
          <div className="flex flex-col items-center py-12 text-center border border-zinc-100 dark:border-zinc-800 rounded-2xl mb-10">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-zinc-300 dark:text-zinc-600 mb-3"><path d="M3 18h4v-6H3v6zM10 18h4V6h-4v12zM17 18h4v-9h-4v9z"/></svg>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Ainda sem entradas de ranking.</p>
          </div>
        )}
      </main>
    </div>
  );
}
