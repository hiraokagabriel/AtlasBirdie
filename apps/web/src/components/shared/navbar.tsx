'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth, UserButton, OrganizationSwitcher } from '@clerk/nextjs';

const navLinks = [
  { href: '/tournaments', label: 'Torneios' },
  { href: '/athletes', label: 'Atletas' },
  { href: '/clubs', label: 'Clubes' },
  { href: '/rankings', label: 'Rankings' },
];

export function Navbar() {
  const pathname = usePathname();
  const { isSignedIn } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-100 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-label="Atlas Birdie" className="text-emerald-600">
            <circle cx="14" cy="14" r="13" stroke="currentColor" strokeWidth="2" />
            <path d="M8 18 C10 10, 18 8, 20 14 C22 20, 14 24, 10 20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
            <circle cx="14" cy="9" r="2" fill="currentColor" />
          </svg>
          <span className="font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">Atlas Birdie</span>
        </Link>

        {/* Nav links — desktop */}
        <nav className="hidden sm:flex items-center gap-6 text-sm" aria-label="Navegação principal">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors ${
                pathname.startsWith(link.href)
                  ? 'text-zinc-900 dark:text-zinc-50 font-medium'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Auth area */}
        <div className="flex items-center gap-3">
          {isSignedIn ? (
            <>
              {/*
               * OrganizationSwitcher permite ao usuário selecionar a organização
               * ativa na sessão. Isso é necessário para que o Clerk popule orgRole
               * no token — sem uma org ativa, orgRole retorna null e o AdminRoleGuard
               * bloqueia o acesso ao painel admin.
               *
               * TODO Phase 2: mover para um componente dedicado no AdminSidebar
               * e remover da Navbar pública quando o fluxo de org for consolidado.
               */}
              <OrganizationSwitcher
                hidePersonal
                afterSelectOrganizationUrl="/admin"
                appearance={{
                  elements: {
                    rootBox: 'flex items-center',
                    organizationSwitcherTrigger:
                      'text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors px-2 py-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800',
                  },
                }}
              />
              <UserButton />
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
              >
                Entrar
              </Link>
              {/*
               * Aponta para /register (cadastro público de atleta — PR #68).
               * /sign-up (Clerk) é reservado para usuários administrativos
               * que recebem convite pelo painel admin (Phase 2).
               */}
              <Link
                href="/register"
                className="text-sm font-medium px-4 py-2 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
              >
                Cadastrar-se
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
