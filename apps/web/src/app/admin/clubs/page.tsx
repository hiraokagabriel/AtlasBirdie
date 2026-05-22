'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useClubs, useDeleteClub, useCreateClub } from '@/hooks/use-clubs';

const STATES = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'];

function CreateClubModal({ onClose }: { onClose: () => void }) {
  const createMutation = useCreateClub();
  const [form, setForm] = useState({ name: '', acronym: '', city: '', state: 'SP', email: '', phone: '', website: '' });

  const set = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await createMutation.mutateAsync({
      ...form,
      phone: form.phone || undefined,
      website: form.website || undefined,
      email: form.email || undefined,
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" role="dialog" aria-modal aria-label="Adicionar clube">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-700 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">Adicionar clube</h2>
          <button onClick={onClose} aria-label="Fechar" className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label htmlFor="club-name" className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Nome do clube *</label>
              <input id="club-name" required value={form.name} onChange={(e) => set('name', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Ex: Associação Atlética Paulista" />
            </div>
            <div>
              <label htmlFor="club-acronym" className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Sigla *</label>
              <input id="club-acronym" required maxLength={8} value={form.acronym} onChange={(e) => set('acronym', e.target.value.toUpperCase())}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="AAP" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="club-city" className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Cidade *</label>
              <input id="club-city" required value={form.city} onChange={(e) => set('city', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="São Paulo" />
            </div>
            <div>
              <label htmlFor="club-state" className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Estado *</label>
              <select id="club-state" value={form.state} onChange={(e) => set('state', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="club-email" className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">E-mail</label>
            <input id="club-email" type="email" value={form.email} onChange={(e) => set('email', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="contato@clube.com.br" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="club-phone" className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Telefone</label>
              <input id="club-phone" type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="(11) 99999-9999" />
            </div>
            <div>
              <label htmlFor="club-website" className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Site</label>
              <input id="club-website" type="url" value={form.website} onChange={(e) => set('website', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="https://" />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">Cancelar</button>
            <button type="submit" disabled={createMutation.isPending}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors">
              {createMutation.isPending ? 'Salvando…' : 'Adicionar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminClubsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const { data, isLoading } = useClubs({ page, perPage: 20, search: search || undefined });
  const deleteMutation = useDeleteClub();

  return (
    <div>
      {showCreate && <CreateClubModal onClose={() => setShowCreate(false)} />}

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Clubes</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
          Adicionar clube
        </button>
      </div>

      <input type="search" placeholder="Buscar clube…" value={search}
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wide">Sigla</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wide">Cidade</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {data?.data?.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-10 text-center text-sm text-zinc-400">Nenhum clube cadastrado ainda.</td></tr>
                )}
                {data?.data?.map((club) => (
                  <tr key={club.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-50">
                      <Link href={`/clubs/${club.slug}`} className="hover:text-emerald-600 transition-colors">{club.name}</Link>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-zinc-500">{club.acronym}</td>
                    <td className="px-4 py-3 text-zinc-500">{club.city ?? '—'}, {club.state}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full px-2 py-0.5 text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">{club.status}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => { if (confirm('Remover clube?')) deleteMutation.mutate(club.id); }}
                        className="text-red-500 hover:text-red-700 text-xs transition-colors">Remover</button>
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
