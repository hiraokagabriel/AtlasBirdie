// Gestão de usuários é delegada ao Clerk Dashboard na Phase 1.
// Esta página serve como placeholder com orientações claras para o admin.
export default function AdminUsersPage() {
  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Usuários</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Gestão de contas, convites e atribuição de roles.
        </p>
      </div>

      <div className="rounded-xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 divide-y divide-zinc-100 dark:divide-zinc-800">
        <div className="p-5">
          <h2 className="text-sm font-medium text-zinc-900 dark:text-zinc-50 mb-1">Gerenciar via Clerk Dashboard</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
            Nesta fase, a criação de usuários administrativos e atribuição de roles é feita diretamente no painel do Clerk.
            A interface integrada de convites será implementada na Phase 2.
          </p>
          <a
            href="https://dashboard.clerk.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            Abrir Clerk Dashboard
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        </div>

        <div className="p-5">
          <h2 className="text-sm font-medium text-zinc-900 dark:text-zinc-50 mb-3">Roles disponíveis</h2>
          <ul className="flex flex-col gap-2">
            {[
              { role: 'super_admin', desc: 'Acesso total à plataforma. Gerencia federações e configurações globais.' },
              { role: 'federation_admin', desc: 'Gerencia torneios, atletas e rankings da federação.' },
              { role: 'tournament_organizer', desc: 'Cria e gerencia torneios específicos.' },
              { role: 'referee', desc: 'Registra resultados de partidas via interface móvel.' },
              { role: 'club_manager', desc: 'Gerencia o roster do seu clube.' },
              { role: 'athlete', desc: 'Acesso ao perfil próprio e inscrições.' },
            ].map(({ role, desc }) => (
              <li key={role} className="flex gap-3">
                <code className="shrink-0 text-xs font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 px-2 py-0.5 rounded h-fit mt-0.5">
                  {role}
                </code>
                <span className="text-sm text-zinc-500 dark:text-zinc-400">{desc}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
