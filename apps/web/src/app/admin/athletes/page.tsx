'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAthletes, useDeleteAthlete, useCreateAthlete } from '@/hooks/use-athletes';

interface CreateAthleteForm {
  name: string;
  email: string;
  birthDate: string;
  gender: 'MALE' | 'FEMALE';
  clubId?: string;
}

function CreateAthleteModal({ onClose }: { onClose: () => void }) {
  const createMutation = useCreateAthlete();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CreateAthleteForm>();

  const onSubmit = async (data: CreateAthleteForm) => {
    await createMutation.mutateAsync(data);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-athlete-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 id="create-athlete-title" className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
            Novo atleta
          </h2>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Nome completo</label>
            <input
              id="name"
              type="text"
              {...register('name', { required: 'Nome é obrigatório' })}
              className="border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Ex: João da Silva"
            />
            {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">E-mail</label>
            <input
              id="email"
              type="email"
              {...register('email', { required: 'E-mail é obrigatório' })}
              className="border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="atleta@email.com"
            />
            {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="birthDate" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Data de nascimento</label>
              <input
                id="birthDate"
                type="date"
                {...register('birthDate', { required: 'Data de nascimento obrigatória' })}
                className="border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {errors.birthDate && <span className="text-xs text-red-500">{errors.birthDate.message}</span>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="gender" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Gênero</label>
              <select
                id="gender"
                {...register('gender', { required: 'Gênero obrigatório' })}
                className="border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Selecione</option>
                <option value="MALE">Masculino</option>
                <option value="FEMALE">Feminino</option>
              </select>
              {errors.gender && <span className="text-xs text-red-500">{errors.gender.message}</span>}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="clubId" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              ID do clube <span className="text-zinc-400">(opcional)</span>
            </label>
            <input
              id="clubId"
              type="text"
              {...register('clubId')}
              className="border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="UUID do clube"
            />
          </div>

          {createMutation.isError && (
            <p className="text-xs text-red-500 bg-red-50 dark:bg-red-950/30 rounded-lg px-3 py-2">
              Erro ao criar atleta. Verifique os dados e tente novamente.
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || createMutation.isPending}
              className="px-5 py-2 text-sm font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {createMutation.isPending ? 'Criando...' : 'Criar atleta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminAthletesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const { data, isLoading } = useAthletes({ page, perPage: 20, search: search || undefined });
  const deleteMutation = useDeleteAthlete();

  return (
    <div className="p-6">
      {showCreate && <CreateAthleteModal onClose={() => setShowCreate(false)} />}

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Atletas</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Novo atleta
        </button>
      </div>

      <input
        type="search"
        placeholder="Buscar atleta..."
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        className="mb-4 w-full max-w-sm border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
      />

      {isLoading ? (
        <p className="text-sm text-zinc-400">Carregando...</p>
      ) : (
        <>
          <div className="rounded-xl border border-zinc-100 dark:border-zinc-800 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50 dark:bg-zinc-900">
                <tr className="border-b border-zinc-100 dark:border-zinc-800 text-left">
                  <th className="px-4 py-3 font-medium text-zinc-600 dark:text-zinc-400">Nome</th>
                  <th className="px-4 py-3 font-medium text-zinc-600 dark:text-zinc-400">Clube</th>
                  <th className="px-4 py-3 font-medium text-zinc-600 dark:text-zinc-400">Status</th>
                  <th className="px-4 py-3 font-medium text-zinc-600 dark:text-zinc-400">Ações</th>
                </tr>
              </thead>
              <tbody>
                {data?.data.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-12 text-center text-sm text-zinc-400">
                      Nenhum atleta encontrado. Crie o primeiro usando o botão acima.
                    </td>
                  </tr>
                ) : (
                  data?.data.map((athlete) => (
                    <tr key={athlete.id} className="border-b border-zinc-100 dark:border-zinc-800 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-50">{athlete.name}</td>
                      <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400">{athlete.clubId ?? '—'}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                          {athlete.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => {
                            if (confirm(`Remover atleta "${athlete.name}"?`)) {
                              deleteMutation.mutate(athlete.id);
                            }
                          }}
                          className="text-xs text-red-500 hover:text-red-700 hover:underline transition-colors"
                        >
                          Remover
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {data?.meta && (
            <div className="mt-4 flex items-center gap-3 text-sm text-zinc-500">
              <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="disabled:opacity-40 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
                ← Anterior
              </button>
              <span>{page} / {data.meta.totalPages}</span>
              <button disabled={page >= data.meta.totalPages} onClick={() => setPage((p) => p + 1)} className="disabled:opacity-40 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
                Próxima →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
