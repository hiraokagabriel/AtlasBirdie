'use client';

import { useActionState } from 'react';

interface RegisterFormProps {
  action: (prevState: unknown, formData: FormData) => Promise<{ error?: string } | void>;
}

const STATES_BR = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS',
  'MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC',
  'SP','SE','TO',
];

export function RegisterForm({ action }: RegisterFormProps) {
  const [state, formAction, isPending] = useActionState(action, null);

  return (
    <form action={formAction} className="space-y-5">
      {/* Nome */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
          Nome completo <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          className="w-full px-4 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {/* E-mail */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
          E-mail <span className="text-red-500">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full px-4 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {/* Data de nascimento + Gênero */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="birthDate" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            Data de nascimento <span className="text-red-500">*</span>
          </label>
          <input
            id="birthDate"
            name="birthDate"
            type="date"
            required
            className="w-full px-4 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            Gênero <span className="text-red-500">*</span>
          </label>
          <select
            id="gender"
            name="gender"
            required
            className="w-full px-4 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">Selecione</option>
            <option value="M">Masculino</option>
            <option value="F">Feminino</option>
          </select>
        </div>
      </div>

      {/* Cidade + Estado */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Cidade</label>
          <input
            id="city"
            name="city"
            type="text"
            className="w-full px-4 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div>
          <label htmlFor="state" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Estado</label>
          <select
            id="state"
            name="state"
            className="w-full px-4 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">UF</option>
            {STATES_BR.map((uf) => (
              <option key={uf} value={uf}>{uf}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Erro */}
      {state && typeof state === 'object' && 'error' in state && state.error && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {state.error}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full py-2.5 text-sm font-medium rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? 'Enviando...' : 'Enviar cadastro'}
      </button>

      <p className="text-xs text-center text-zinc-400 dark:text-zinc-500">
        Seu cadastro será analisado em até 48 horas.
      </p>
    </form>
  );
}
