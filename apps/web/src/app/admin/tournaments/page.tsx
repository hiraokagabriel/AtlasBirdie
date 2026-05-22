'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTournaments } from '@/hooks/use-tournaments';
import { api } from '@/lib/api';
import Link from 'next/link';

function CreateTournamentModal({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient();
  const createMutation = useMutation({
    mutationFn: (data: unknown) => api.post('/tournaments', data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['tournaments'] }); onClose(); },
  });

  const [form, setForm] = useState({
    name: '',
    city: '',
    state: 'SP',
    startDate: '',
    endDate: '',
    registrationDeadline: '',
    description: '',
  });

  const set = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const STATES = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" role="dialog" aria-modal aria-label="Criar torneio">
      <div className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-700 p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">Criar torneio</h2>
          <button onClick={onClose} aria-label="Fechar" className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); createMutation.mutate(form); }} className="space-y-4">
          <div>
            <label htmlFor="t-name" className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Nome do torneio *</label>
            <input id="t-name" required value={form.name} onChange={(e) => set('name', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Ex: Campeonato Brasileiro 2026" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="t-city" className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Cidade *</label>
              <input id="t-city" required value={form.city} onChange={(e) => set('city', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label htmlFor="t-state" className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Estado *</label>
              <select id="t-state" value={form.state} onChange={(e) => set('state', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                {STATES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="t-start" className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Data de início *</label>
              <input id="t-start" required type="date" value={form.startDate} onChange={(e) => set('startDate', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label htmlFor="t-end" className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Data de fim *</label>
              <input id="t-end" required type="date" value={form.endDate} onChange={(e) => set('endDate', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
          </div>

          <div>
            <label htmlFor="t-deadline" className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Prazo de inscrição</label>
            <input id="t-deadline" type="date" value={form.registrationDeadline} onChange={(e) => set('registrationDeadline', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>

          <div>
            <label htmlFor="t-desc" className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Descrição</label>
            <textarea id="t-desc" rows={3} value={form.description} onChange={(e) => set('description', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              placeholder="Informações gerais sobre o torneio…" />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">Cancelar</button>
            <button type="submit" disabled={createMutation.isPending}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors">
              {createMutation.isPending ? 'Salvando…' : 'Criar torneio'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminTournamentsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const { data, isLoading } = useTournaments({ page, perPage: 20, search });

  return (
    <div>
      {showCreate && <CreateTournamentModal onClose={() => setShowCreate(false)} />}

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Torneios</h1>
        <button onClick={() => setShowCreate(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
          Criar torneio
        </button>
      </div>

      <input type="search" placeholder="Buscar torneio…" value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        className="mb-4 w-full max-w-sm border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500" />

      {isLoading ? (
        <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 animate-pulse" />)}</div>
      ) : (
        <>
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50 dark:bg-zinc-800/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wide">Nome</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wide">Local</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wide">Período</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {data?.data?.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-10 text-center text-sm text-zinc-400">Nenhum torneio cadastrado ainda.</td></tr>
                )}
                {data?.data?.map((tournament) => (
                  <tr key={tournament.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-50">
                      <Link href={`/tournaments/${tournament.slug}`} className="hover:text-emerald-600 transition-colors">{tournament.name}</Link>
                    </td>
                    <td className="px-4 py-3 text-zinc-500">{tournament.city}, {tournament.state}</td>
                    <td className="px-4 py-3 text-zinc-500">{tournament.periodLabel}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full px-2 py-0.5 text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">{tournament.statusLabel}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/admin/tournaments/${tournament.slug}`} className="text-emerald-600 text-xs hover:underline">Gerenciar</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {data?.meta && data.meta.totalPages > 1 && (
            <div className="mt-4 flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
              <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="disabled:opacity-40">← Anterior</button>
              <span className="tabular-nums">{page} / {data.meta.totalPages}</span>
              <button disabled={page >= data.meta.totalPages} onClick={() => setPage((p) => p + 1)} className="disabled:opacity-40">Próxima →</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
