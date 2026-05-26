'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { LogOut, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const navLinks = [
  { href: '/tournaments', label: 'Torneios' },
  { href: '/athletes', label: 'Atletas' },
  { href: '/clubs', label: 'Clubes' },
  { href: '/rankings', label: 'Rankings' },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isSignedIn, user, signOut } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  function handleSignOut() {
    signOut();
    setDropdownOpen(false);
    router.push('/');
  }

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
          {isSignedIn && user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors px-2 py-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800"
                aria-label="Menu do usuário"
                aria-expanded={dropdownOpen}
              >
                {/* Avatar */}
                <span className="w-7 h-7 rounded-full bg-emerald-600 text-white text-xs font-semibold flex items-center justify-center select-none">
                  {user.avatarInitials}
                </span>
                <span className="hidden sm:inline">{user.name}</span>
                <ChevronDown size={14} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-lg py-1 z-50">
                  <div className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-800">
                    <p className="text-xs font-medium text-zinc-900 dark:text-zinc-50 truncate">{user.name}</p>
                    <p className="text-xs text-zinc-400 truncate">{user.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-medium px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300">
                      {user.role}
                    </span>
                  </div>

                  {(user.role === 'super_admin' || user.role === 'federation_admin') && (
                    <Link
                      href="/admin"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                    >
                      Painel Admin
                    </Link>
                  )}

                  {user.role === 'athlete' && (
                    <Link
                      href="/athlete"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                    >
                      Meu Perfil
                    </Link>
                  )}

                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                  >
                    <LogOut size={14} />
                    Sair
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
              >
                Entrar
              </Link>
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
