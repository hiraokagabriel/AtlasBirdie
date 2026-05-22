import { Navbar } from '@/components/shared/navbar';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-24 sm:py-32">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-3 py-1 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Temporada 2026 em andamento
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 leading-[1.1] mb-6">
              A plataforma oficial de campeonatos de badminton
            </h1>
            <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed mb-10 max-w-xl">
              Acompanhe torneios, rankings e resultados em tempo real. Gerencie inscrições, chaveamentos e estatísticas em um só lugar.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/tournaments"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 text-sm font-medium hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors"
              >
                Ver torneios
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
              <Link
                href="/rankings"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                Rankings nacionais
              </Link>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-y border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {[
              { label: 'Atletas cadastrados', value: '—' },
              { label: 'Clubes ativos', value: '—' },
              { label: 'Torneios realizados', value: '—' },
              { label: 'Partidas registradas', value: '—' },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col gap-1">
                <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{stat.value}</span>
                <span className="text-sm text-zinc-500 dark:text-zinc-400">{stat.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Cards */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                href: '/tournaments',
                icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 21h8M12 17v4M7 4H3v4a4 4 0 0 0 8 0V4M17 4h4v4a4 4 0 0 1-8 0V4"/></svg>),
                title: 'Torneios',
                description: 'Calendário de competições, inscrições abertas e resultados por categoria e disciplina.',
              },
              {
                href: '/rankings',
                icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 18h4v-6H3v6zM10 18h4V6h-4v12zM17 18h4v-9h-4v9z"/></svg>),
                title: 'Rankings',
                description: 'Classificação nacional por modalidade, categoria etária e pontuação acumulada na temporada.',
              },
              {
                href: '/athletes',
                icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>),
                title: 'Atletas',
                description: 'Perfis públicos, histórico de resultados, evolução de ranking e estatísticas individuais.',
              },
            ].map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="group flex flex-col gap-4 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-emerald-200 dark:hover:border-emerald-800 hover:shadow-sm transition-all"
              >
                <span className="w-10 h-10 flex items-center justify-center rounded-xl bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {card.icon}
                </span>
                <div>
                  <h2 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-1">{card.title}</h2>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{card.description}</p>
                </div>
                <span className="mt-auto text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Explorar
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-100 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400 dark:text-zinc-600">
          <span>© 2026 Atlas Birdie. Plataforma de gestão de badminton.</span>
          <nav className="flex gap-4">
            <Link href="/tournaments" className="hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors">Torneios</Link>
            <Link href="/rankings" className="hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors">Rankings</Link>
            <Link href="/athletes" className="hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors">Atletas</Link>
            <Link href="/clubs" className="hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors">Clubes</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
