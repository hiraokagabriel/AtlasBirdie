import Link from 'next/link';
import { Navbar } from '@/components/shared/navbar';

export const metadata = {
  title: 'Cadastro enviado — Atlas Birdie',
};

export default function RegisterSuccessPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <Navbar />
      <main className="max-w-lg mx-auto px-4 py-24 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center mb-6">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-600">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">Cadastro enviado!</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8">
          Recebemos suas informações. Você receberá um e-mail de confirmação e seu perfil será ativado em breve.
        </p>
        <Link
          href="/"
          className="px-6 py-2 text-sm font-medium rounded-full border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
        >
          Voltar ao início
        </Link>
      </main>
    </div>
  );
}
