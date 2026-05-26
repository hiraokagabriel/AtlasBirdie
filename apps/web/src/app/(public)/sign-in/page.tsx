'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

export default function SignInPage() {
  const { signIn, isSignedIn } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Se já está logado, redireciona
  if (isSignedIn) {
    router.replace('/');
    return null;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signIn(email, password);

    setLoading(false);

    if (!result.success) {
      setError(result.error ?? 'Erro ao fazer login.');
      return;
    }

    router.push('/');
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center gap-2 mb-6">
            <svg width="32" height="32" viewBox="0 0 28 28" fill="none" aria-label="Atlas Birdie" className="text-emerald-600">
              <circle cx="14" cy="14" r="13" stroke="currentColor" strokeWidth="2" />
              <path d="M8 18 C10 10, 18 8, 20 14 C22 20, 14 24, 10 20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
              <circle cx="14" cy="9" r="2" fill="currentColor" />
            </svg>
            <span className="font-semibold text-zinc-900 dark:text-zinc-50 text-lg tracking-tight">Atlas Birdie</span>
          </Link>
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Entrar na conta</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Sistema de autenticação local (desenvolvimento)</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Senha
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 text-sm font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        {/* Mock users hint */}
        <div className="mt-6 p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2">Usuários de teste:</p>
          <div className="space-y-1 text-xs text-zinc-400 dark:text-zinc-500 font-mono">
            <div>admin@atlasbirdie.com / admin123</div>
            <div>fed@atlasbirdie.com / fed123</div>
            <div>org@atlasbirdie.com / org123</div>
            <div>atleta@atlasbirdie.com / atleta123</div>
          </div>
        </div>

        <p className="text-center mt-6 text-xs text-zinc-400 dark:text-zinc-500">
          Ainda não tem conta?{' '}
          <Link href="/register" className="text-emerald-600 hover:text-emerald-700 transition-colors">
            Cadastrar-se
          </Link>
        </p>
      </div>
    </main>
  );
}
