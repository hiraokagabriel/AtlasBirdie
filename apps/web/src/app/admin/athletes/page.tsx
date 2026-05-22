'use client';

import { useState } from 'react';
import { useAthletes, useDeleteAthlete, useCreateAthlete } from '@/hooks/use-athletes';
import { useClubs } from '@/hooks/use-clubs';

function CreateAthleteModal({ onClose }: { onClose: () => void }) {
  const createMutation = useCreateAthlete();
  const { data: clubsData } = useClubs({ perPage: 100 });
  const [form, setForm] = useState({ name: '', birthDate: '', gender: 'MALE', clubId: '', handedness: 'RIGHT' });

  const set = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await createMutation.mutateAsync({
      ...form,
      clubId: form.clubId || undefined,
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" role="dialog" aria-modal aria-label="Cadastrar atleta">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-700 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">Cadastrar atleta</h2>
          <button onClick={onClose} aria-label="Fechar" className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="athlete-name" className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Nome completo *</label>
            <input
              id="athlete-name"
              required
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Nome do atleta"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="athlete-birth" className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Data de nascimento *</label>
              <input
                id="athlete-birth"
                required
                type="date"
                value={form.birthDate}
                onChange={(e) => set('birthDate', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label htmlFor="athlete-gender" className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Gênero *</label>
              <select
                id="athlete-gender"
                value={form.gender}
                onChange={(e) => set('gender', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="MALE">Masculino</option>
                <option value="FEMALE">Feminino</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="athlete-handedness" className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Lateralidade</label>
            <select
              id="athlete-handedness"
              value={form.handedness}
              onChange={(e) => set('handedness', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="RIGHT">Destro</option>
              <option value="LEFT">Canhoto</option>
            </select>
          </div>

          <div>
            <label htmlFor="athlete-club" className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Clube</label>
            <select
              id="athlete-club"
              value={form.clubId}
              onChange={(e) => set('clubId', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Sem clube</option>
              {clubsData?.data?.map((club) => (
                <option key={club.id} value={club.id}>{club.name}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors"
            >
              {createMutation.isPending ? 'Salvando…' : 'Cadastrar'}
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
    <div>
      {showCreate && <CreateAthleteModal onClose={() => setShowCreate(false)} />}

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Atletas</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
          Cadastrar atleta
        </button>
      </div>

      <input
        type="search"
        placeholder="Buscar atleta…"
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        className="mb-4 w-full max-w-sm border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
      />

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50 dark:bg-zinc-800/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Nome</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Clube</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {data?.data?.length === 0 && (
                  <tr><td colSpan={4} className="px-4 py-10 text-center text-sm text-zinc-400">Nenhum atleta cadastrado ainda.</td></tr>
                )}
                {data?.data?.map((athlete) => (
                  <tr key={athlete.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-50">{athlete.name}</td>
                    <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400">{athlete.clubId ?? '—'}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full px-2 py-0.5 text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                        {athlete.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => { if (confirm('Remover atleta?')) deleteMutation.mutate(athlete.id); }}
                        className="text-red-500 hover:text-red-700 text-xs transition-colors"
                      >
                        Remover
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {data?.meta && data.meta.totalPages > 1 && (
            <div className="mt-4 flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
              <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="disabled:opacity-40 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">← Anterior</button>
              <span className="tabular-nums">{page} / {data.meta.totalPages}</span>
              <button disabled={page >= data.meta.totalPages} onClick={() => setPage((p) => p + 1)} className="disabled:opacity-40 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">Próxima →</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
