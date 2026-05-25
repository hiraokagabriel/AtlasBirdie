'use client'

import { useState } from 'react'
import { useWizard } from './wizard-context'
import { useUpdateTournament } from '@/hooks/use-tournaments'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'

export function Step6Regulation() {
  const { state, dispatch } = useWizard()
  const router = useRouter()

  const [regulationUrl, setRegulationUrl] = useState(
    state.draft.step6?.regulationUrl ?? '',
  )
  const [regulationText, setRegulationText] = useState(
    state.draft.step6?.regulationText ?? '',
  )

  // ✅ Hook chamado no corpo do componente — não dentro de onFinish
  const updateMutation = useUpdateTournament(state.createdTournamentId ?? '')

  const onFinish = async () => {
    if (!state.createdTournamentId) return

    dispatch({ type: 'SET_SAVING', value: true })
    dispatch({ type: 'SET_ERROR', error: null })

    try {
      await updateMutation.mutateAsync({
        regulationUrl: regulationUrl || undefined,
        regulationText: regulationText || undefined,
      })

      dispatch({ type: 'SAVE_DRAFT', step: 'step6', data: { regulationUrl, regulationText } })
      router.push(`/admin/tournaments/${state.createdTournamentSlug}`)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido'
      dispatch({ type: 'SET_ERROR', error: message })
    } finally {
      dispatch({ type: 'SET_SAVING', value: false })
    }
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-[var(--color-text-muted)]">
        Adicione o regulamento do torneio. Você pode informar uma URL para um PDF externo ou
        escrever o texto direto neste campo. Ambos são opcionais.
      </p>

      <div className="space-y-2">
        <Label>URL do Regulamento (PDF/link externo)</Label>
        <Input
          type="url"
          placeholder="https://exemplo.com/regulamento.pdf"
          value={regulationUrl}
          onChange={(e) => setRegulationUrl(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Texto do Regulamento (Markdown)</Label>
        <Textarea
          rows={12}
          placeholder="# Regulamento\n\n## Art. 1 — Objetivo..."
          value={regulationText}
          onChange={(e) => setRegulationText(e.target.value)}
          className="font-mono text-sm"
        />
      </div>

      {state.error && (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      )}

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={() => dispatch({ type: 'PREV_STEP' })}>
          ← Anterior
        </Button>
        <Button type="button" onClick={onFinish} disabled={state.isSaving}>
          {state.isSaving ? 'Salvando...' : 'Concluir e Publicar'}
        </Button>
      </div>
    </div>
  )
}
