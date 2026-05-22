'use client';

export default function AdminUsersPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Usuários</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Gestão de convites e roles — Phase 2</p>
      </div>
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-12 text-center">
        <div className="w-12 h-12 mx-auto mb-4 text-zinc-300 dark:text-zinc-700">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/><path d="M16 3.13a4 4 0 0 1 0 7.75M21 21v-2a4 4 0 0 0-3-3.87"/></svg>
        </div>
        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Gestão de usuários e roles</p>
        <p className="text-xs text-zinc-400">Convites, permissões e gestão de acessos serão implementados na Phase 2.</p>
      </div>
    </div>
  );
}
