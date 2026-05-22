'use client'

import { useWizard } from './wizard-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'

const DISCIPLINE_LABELS: Record<string, string> = {
  MS: 'Simples M',
  WS: 'Simples F',
  MD: 'Duplas M',
  WD: 'Duplas F',
  XD: 'Mistas',
}

interface EventLimit {
  discipline: string
  category: string
  maxInscriptions: string
}

export function Step4Registrations() {
  const { state, dispatch } = useWizard()
  const events = state.draft.step2?.events ?? []

  const [registrationOpenAt, setRegistrationOpenAt] = useState(
    state.draft.step4?.registrationOpenAt ?? '',
  )
  const [registrationCloseAt, setRegistrationCloseAt] = useState(
    state.draft.step4?.registrationCloseAt ?? '',
  )
  const [maxGlobal, setMaxGlobal] = useState(
    state.draft.step4?.maxInscriptionsGlobal ? String(state.draft.step4.maxInscriptionsGlobal) : '',
  )
  const [limits, setLimits] = useState<EventLimit[]>(
    events.map((ev) => {
      const existing = state.draft.step4?.events?.find(
        (e) => e.discipline === ev.discipline && e.category === ev.category,
      )
      return {
        discipline: ev.discipline,
        category: ev.category,
        maxInscriptions: existing?.maxInscriptions ? String(existing.maxInscriptions) : '',
      }
    }),
  )

  const updateLimit = (index: number, value: string) => {
    setLimits((prev) =>
      prev.map((l, i) => (i === index ? { ...l, maxInscriptions: value } : l)),
    )
  }

  const onNext = () => {
    dispatch({
      type: 'SAVE_DRAFT',
      step: 'step4',
      data: {
        registrationOpenAt,
        registrationCloseAt,
        maxInscriptionsGlobal: maxGlobal ? Number(maxGlobal) : undefined,
        events: limits.map((l) => ({
          ...l,
          maxInscriptions: l.maxInscriptions ? Number(l.maxInscriptions) : undefined,
        })),
      },
    })
    dispatch({ type: 'NEXT_STEP' })
  }

  return (
    <div className="space-y-6">
      {/* Datas */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label>Abertura das Inscrições</Label>
          <Input
            type="datetime-local"
            value={registrationOpenAt}
            onChange={(e) => setRegistrationOpenAt(e.target.value)}
          />
        </div>
        <div>
          <Label>Encerramento das Inscrições</Label>
          <Input
            type="datetime-local"
            value={registrationCloseAt}
            onChange={(e) => setRegistrationCloseAt(e.target.value)}
          />
        </div>
      </div>

      {/* Limite global */}
      <div className="max-w-xs">
        <Label>Limite Global de Inscrições</Label>
        <Input
          type="number"
          min={1}
          placeholder="Sem limite"
          value={maxGlobal}
          onChange={(e) => setMaxGlobal(e.target.value)}
        />
      </div>

      {/* Limites por modalidade */}
      {limits.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold">Limite por Modalidade (opcional)</h3>
          {limits.map((l, i) => (
            <div key={i} className="flex items-center gap-3">
              <Badge variant="secondary" className="w-8 justify-center">
                {l.discipline}
              </Badge>
              <span className="text-sm flex-1">
                {DISCIPLINE_LABELS[l.discipline]} — {l.category}
              </span>
              <Input
                type="number"
                min={1}
                placeholder="Sem limite"
                className="w-28"
                value={l.maxInscriptions}
                onChange={(e) => updateLimit(i, e.target.value)}
              />
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={() => dispatch({ type: 'PREV_STEP' })}>
          ← Anterior
        </Button>
        <Button type="button" onClick={onNext}>
          Próximo →
        </Button>
      </div>
    </div>
  )
}
