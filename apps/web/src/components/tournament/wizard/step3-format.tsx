'use client'

import { useState } from 'react'
import { useWizard } from './wizard-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'

const BRACKET_FORMATS = [
  { value: 'SINGLE_ELIMINATION', label: 'Mata-mata simples' },
  { value: 'DOUBLE_ELIMINATION', label: 'Mata-mata duplo' },
  { value: 'ROUND_ROBIN', label: 'Round Robin' },
  { value: 'GROUPS_WITH_KNOCKOUT', label: 'Grupos + Mata-mata' },
  { value: 'SWISS', label: 'Sistema Suíço' },
]

const DISCIPLINE_LABELS: Record<string, string> = {
  MS: 'Simples M',
  WS: 'Simples F',
  MD: 'Duplas M',
  WD: 'Duplas F',
  XD: 'Mistas',
}

interface EventFormatRow {
  discipline: string
  category: string
  bracketFormat: string
  seedCount: number
  bestOf: number
  pointsPerGame: number
  minIntervalMinutes: number
}

export function Step3Format() {
  const { state, dispatch } = useWizard()
  const events = state.draft.step2?.events ?? []

  const [formats, setFormats] = useState<EventFormatRow[]>(
    events.map((ev) => {
      const existing = state.draft.step3?.events?.find(
        (e) => e.discipline === ev.discipline && e.category === ev.category,
      )
      return {
        discipline: ev.discipline,
        category: ev.category,
        bracketFormat: existing?.bracketFormat ?? 'SINGLE_ELIMINATION',
        seedCount: existing?.seedCount ?? 4,
        bestOf: existing?.bestOf ?? 3,
        pointsPerGame: existing?.pointsPerGame ?? 21,
        minIntervalMinutes: existing?.minIntervalMinutes ?? 30,
      }
    }),
  )

  const update = (index: number, field: keyof EventFormatRow, value: unknown) => {
    setFormats((prev) =>
      prev.map((f, i) => (i === index ? { ...f, [field]: value } : f)),
    )
  }

  const onNext = () => {
    dispatch({ type: 'SAVE_DRAFT', step: 'step3', data: { events: formats } })
    dispatch({ type: 'NEXT_STEP' })
  }

  return (
    <div className="space-y-6">
      {formats.map((fmt, i) => (
        <div key={i} className="rounded-lg border border-[var(--color-border)] p-4 space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{fmt.discipline}</Badge>
            <span className="text-sm font-medium">
              {DISCIPLINE_LABELS[fmt.discipline]} — {fmt.category}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div className="col-span-2 sm:col-span-3">
              <Label>Formato de Chave</Label>
              <Select
                value={fmt.bracketFormat}
                onValueChange={(v) => update(i, 'bracketFormat', v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BRACKET_FORMATS.map((b) => (
                    <SelectItem key={b.value} value={b.value}>
                      {b.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Cabeças-de-chave</Label>
              <Input
                type="number"
                min={0}
                max={32}
                value={fmt.seedCount}
                onChange={(e) => update(i, 'seedCount', Number(e.target.value))}
              />
            </div>

            <div>
              <Label>Melhor de</Label>
              <Select
                value={String(fmt.bestOf)}
                onValueChange={(v) => update(i, 'bestOf', Number(v))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 game</SelectItem>
                  <SelectItem value="3">3 games</SelectItem>
                  <SelectItem value="5">5 games</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Pontos por game</Label>
              <Input
                type="number"
                min={11}
                max={30}
                value={fmt.pointsPerGame}
                onChange={(e) => update(i, 'pointsPerGame', Number(e.target.value))}
              />
            </div>

            <div>
              <Label>Intervalo mín. (min)</Label>
              <Input
                type="number"
                min={0}
                value={fmt.minIntervalMinutes}
                onChange={(e) => update(i, 'minIntervalMinutes', Number(e.target.value))}
              />
            </div>
          </div>
        </div>
      ))}

      {formats.length === 0 && (
        <p className="text-sm text-[var(--color-text-muted)] text-center py-8">
          Volte ao passo anterior e adicione modalidades
        </p>
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
