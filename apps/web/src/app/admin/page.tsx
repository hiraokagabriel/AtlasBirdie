'use client';

import Link from 'next/link';
import { useAthletes } from '@/hooks/use-athletes';
import { useClubs } from '@/hooks/use-clubs';
import { useTournaments } from '@/hooks/use-tournaments';

function KpiCard({ label, value, href, icon }: { label: string; value: string | number; href: string; icon: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="flex flex-col gap-3 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-sm transition-all"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">{label}</span>
        <span className="text-zinc-400 dark:text-zinc-600">{icon}</span>
      </div>
      <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 tabular-nums">
        {value}
      </span>
    </Link>
  );
}

export default function AdminDashboardPage() {
  const { data: athletesData } = useAthletes({ perPage: 1 });
  const { data: clubsData } = useClubs({ perPage: 1 });
  const { data: tournamentsData } = useTournaments({ perPage: 1 });

  const kpis = [
    {
      label: 'Atletas',
      value: athletesData?.meta?.total ?? '—',
      href: '/admin/athletes',
      icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>),
    },
    {
      label: 'Clubes',
      value: clubsData?.meta?.total ?? '—',
      href: '/admin/clubs',
      icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 21V7l9-4 9 4v14"/><path d="M9 21v-6h6v6"/></svg>),
    },
    {
      label: 'Torneios',
      value: tournamentsData?.meta?.total ?? '—',
      href: '/admin/tournaments',
      icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 21h8M12 17v4M7 4H3v4a4 4 0 0 0 8 0V4M17 4h4v4a4 4 0 0 1-8 0V4"/></svg>),
    },
    {
      label: 'Rankings ativos',
      value: '—',
      href: '/admin/rankings',
      icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 18h4v-6H3v6zM10 18h4V6h-4v12zM17 18h4v-9h-4v9z"/></svg>),
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Dashboard</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Visão geral da plataforma</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} />
        ))}
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: 'Cadastrar atleta', href: '/admin/athletes', description: 'Adicionar novo atleta à plataforma' },
          { label: 'Criar torneio', href: '/admin/tournaments', description: 'Iniciar um novo campeonato' },
          { label: 'Adicionar clube', href: '/admin/clubs', description: 'Registrar novo clube na federação' },
        ].map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="flex flex-col gap-1 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors"
          >
            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">{action.label}</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">{action.description}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
