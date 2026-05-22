'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useClubs, useDeleteClub } from '@/hooks/use-clubs';

export default function AdminClubsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data, isLoading } = useClubs({ page, perPage: 20, search: search || undefined });
  const deleteMutation = useDeleteClub();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Clubes</h1>
      </div>

      <input
        type="search"
        placeholder="Buscar clube..."
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        className="mb-4 w-full max-w-sm border rounded-md px-3 py-2 text-sm"
      />

      {isLoading ? (
        <p className="text-muted-foreground text-sm">Carregando...</p>
      ) : (
        <>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="pb-2 font-medium">Nome</th>
                <th className="pb-2 font-medium">Sigla</th>
                <th className="pb-2 font-medium">Cidade</th>
                <th className="pb-2 font-medium">Status</th>
                <th className="pb-2 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {data?.data.map((club) => (
                <tr key={club.id} className="border-b last:border-0">
                  <td className="py-2">
                    <Link href={`/clubs/${club.slug}`} className="hover:underline">
                      {club.name}
                    </Link>
                  </td>
                  <td className="py-2 font-mono text-xs">{club.acronym}</td>
                  <td className="py-2 text-muted-foreground">{club.city ?? '—'}</td>
                  <td className="py-2">
                    <span className="rounded-full px-2 py-0.5 text-xs bg-muted">{club.status}</span>
                  </td>
                  <td className="py-2">
                    <button
                      onClick={() => deleteMutation.mutate(club.id)}
                      className="text-destructive text-xs hover:underline"
                    >
                      Remover
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {data?.meta && (
            <div className="mt-4 flex items-center gap-3 text-sm">
              <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="disabled:opacity-40">
                ← Anterior
              </button>
              <span>{page} / {data.meta.totalPages}</span>
              <button disabled={page >= data.meta.totalPages} onClick={() => setPage((p) => p + 1)} className="disabled:opacity-40">
                Próxima →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
