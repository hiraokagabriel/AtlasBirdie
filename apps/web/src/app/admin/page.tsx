import Link from 'next/link';

const kpis = [
  {
    label: 'Atletas cadastrados',
    value: '—',
    href: '/admin/athletes',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    ),
  },
  {
    label: 'Clubes ativos',
    value: '—',
    href: '/admin/clubs',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
        <path d="M3 21V9l9-6 9 6v12" />
        <path d="M9 21V12h6v9" />
      </svg>
    ),
  },
  {
    label: 'Torneios em andamento',
    value: '—',
    href: '/admin/tournaments',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
        <path d="M8 21h8M12 17v4M7 4H3v4a4 4 0 0 0 8 0V4M17 4h4v4a4 4 0 0 1-8 0V4" />
      </svg>
    ),
  },
  {
    label: 'Rankings publicados',
    value: '—',
    href: '/admin/rankings',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
        <path d="M3 18h4v-6H3v6zM10 18h4V6h-4v12zM17 18h4v-9h-4v9z" />
      </svg>
    ),
  },
];

const quickLinks = [
  { href: '/admin/athletes', label: 'Gerenciar atletas' },
  { href: '/admin/clubs', label: 'Gerenciar clubes' },
  { href: '/admin/tournaments', label: 'Gerenciar torneios' },
  { href: '/admin/rankings', label: 'Gerenciar rankings' },
  { href: '/admin/users', label: 'Gerenciar usuários' },
  { href: '/admin/reports', label: 'Exportar relatórios' },
];

export default function AdminDashboardPage() {
  return (
    <div className="p-6 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Dashboard</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Visão geral da plataforma Atlas Birdie.</p>
      </div>

      {/* KPIs */}
      <section aria-labelledby="kpis-heading" className="mb-10">
        <h2 id="kpis-heading" className="sr-only">Indicadores</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi) => (
            <Link
              key={kpi.href}
              href={kpi.href}
              className="group flex flex-col gap-3 p-5 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-emerald-200 dark:hover:border-emerald-800 hover:shadow-sm transition-all"
            >
              <span className="text-zinc-400 dark:text-zinc-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {kpi.icon}
              </span>
              <div>
                <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 tabular-nums">{kpi.value}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{kpi.label}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Acesso rápido */}
      <section aria-labelledby="quick-links-heading">
        <h2 id="quick-links-heading" className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">Acesso rápido</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center justify-between px-4 py-3 rounded-lg border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm text-zinc-700 dark:text-zinc-300 hover:border-zinc-200 dark:hover:border-zinc-700 hover:text-zinc-900 dark:hover:text-zinc-50 transition-all group"
            >
              {link.label}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-zinc-300 dark:text-zinc-600 group-hover:text-zinc-500 transition-colors" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </section>

      {/* Nota de construção */}
      <div className="mt-10 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-700 p-6 text-center">
        <p className="text-sm text-zinc-400 dark:text-zinc-500">
          Os KPIs serão populados com dados reais na Phase 2, após a implementação dos endpoints de agregação.
        </p>
      </div>
    </div>
  );
}
