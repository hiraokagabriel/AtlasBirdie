'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const sidebarLinks = [
  {
    href: '/admin',
    label: 'Dashboard',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
    exact: true,
  },
  {
    href: '/admin/tournaments',
    label: 'Torneios',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
        <path d="M8 21h8M12 17v4M7 4H3v4a4 4 0 0 0 8 0V4M17 4h4v4a4 4 0 0 1-8 0V4" />
      </svg>
    ),
  },
  {
    href: '/admin/athletes',
    label: 'Atletas',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    ),
  },
  {
    href: '/admin/clubs',
    label: 'Clubes',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
        <path d="M3 21V9l9-6 9 6v12" />
        <path d="M9 21V12h6v9" />
      </svg>
    ),
  },
  {
    href: '/admin/rankings',
    label: 'Rankings',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
        <path d="M3 18h4v-6H3v6zM10 18h4V6h-4v12zM17 18h4v-9h-4v9z" />
      </svg>
    ),
  },
  {
    href: '/admin/reports',
    label: 'Relatórios',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    href: '/admin/users',
    label: 'Usuários',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    href: '/admin/settings',
    label: 'Configurações',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
];

function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 shrink-0 border-r border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col">
      {/* Logo */}
      <div className="h-14 flex items-center px-5 border-b border-zinc-100 dark:border-zinc-800">
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          <svg width="22" height="22" viewBox="0 0 28 28" fill="none" aria-label="Atlas Birdie" className="text-emerald-600">
            <circle cx="14" cy="14" r="13" stroke="currentColor" strokeWidth="2" />
            <path d="M8 18 C10 10, 18 8, 20 14 C22 20, 14 24, 10 20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
            <circle cx="14" cy="9" r="2" fill="currentColor" />
          </svg>
          Atlas Birdie
        </Link>
      </div>

      {/* Badge painel */}
      <div className="px-5 py-3 border-b border-zinc-100 dark:border-zinc-800">
        <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Painel Admin</span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto py-3 px-3" aria-label="Navegação admin">
        <ul role="list" className="flex flex-col gap-0.5">
          {sidebarLinks.map((link) => {
            const isActive = link.exact
              ? pathname === link.href
              : pathname.startsWith(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                    isActive
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 font-medium'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-50'
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer da sidebar */}
      <div className="px-5 py-4 border-t border-zinc-100 dark:border-zinc-800">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Voltar ao portal
        </Link>
      </div>
    </aside>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // TODO(Phase-3): Adicionar guard de autenticação quando Auth.js ou Clerk
  // for configurado como dependência em apps/web/package.json.
  // Por enquanto o painel admin é acessível sem autenticação no frontend;
  // a proteção real está no middleware da API (requireAuth).
  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50 dark:bg-zinc-950">
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
