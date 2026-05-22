import type { Metadata } from 'next'
import { TournamentWizard } from '@/components/tournament/wizard/tournament-wizard'

export const metadata: Metadata = {
  title: 'Novo Torneio | Atlas Birdie Admin',
}

export default function NewTournamentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Criar Torneio</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
          Preencha as etapas abaixo para configurar o novo torneio
        </p>
      </div>

      <TournamentWizard />
    </div>
  )
}
