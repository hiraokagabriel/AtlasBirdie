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
import { Switch } from '@/components/ui/switch'
import { Trash2, Plus } from 'lucide-react'

interface CourtRow {
  name: string
  type: 'MAIN' | 'SECONDARY'
  isShowCourt: boolean
  openTime: string
  closeTime: string
  minIntervalMinutes: number
}

const EMPTY_COURT: CourtRow = {
  name: '',
  type: 'SECONDARY',
  isShowCourt: false,
  openTime: '08:00',
  closeTime: '22:00',
  minIntervalMinutes: 15,
}

export function Step5Courts() {
  const { state, dispatch } = useWizard()
  const [courts, setCourts] = useState<CourtRow[]>(
    state.draft.step5?.courts ?? [],
  )
  const [error, setError] = useState<string | null>(null)

  const addCourt = () => {
    setCourts((prev) => [...prev, { ...EMPTY_COURT }])
    setError(null)
  }

  const removeCourt = (index: number) => {
    setCourts((prev) => prev.filter((_, i) => i !== index))
  }

  const update = (index: number, field: keyof CourtRow, value: unknown) => {
    setCourts((prev) =>
      prev.map((c, i) => (i === index ? { ...c, [field]: value } : c)),
    )
  }

  const onNext = () => {
    const invalid = courts.some((c) => !c.name.trim())
    if (invalid) {
      setError('Todos as quadras precisam ter um nome')
      return
    }
    dispatch({ type: 'SAVE_DRAFT', step: 'step5', data: { courts } })
    dispatch({ type: 'NEXT_STEP' })
  }

  return (
    <div className="space-y-4">
      {courts.map((court, i) => (
        <div key={i} className="rounded-lg border border-[var(--color-border)] p-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">Quadra {i + 1}</span>
            <button
              type="button"
              onClick={() => removeCourt(i)}
              className="text-[var(--color-text-muted)] hover:text-destructive transition-colors"
              aria-label="Remover quadra"
            >
              <Trash2 size={14} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div className="col-span-2">
              <Label>Nome</Label>
              <Input
                value={court.name}
                onChange={(e) => update(i, 'name', e.target.value)}
                placeholder="Ex: Quadra 1 Principal"
              />
            </div>

            <div>
              <Label>Tipo</Label>
              <Select value={court.type} onValueChange={(v) => update(i, 'type', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MAIN">Principal</SelectItem>
                  <SelectItem value="SECONDARY">Secundária</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Abertura</Label>
              <Input
                type="time"
                value={court.openTime}
                onChange={(e) => update(i, 'openTime', e.target.value)}
              />
            </div>

            <div>
              <Label>Fechamento</Label>
              <Input
                type="time"
                value={court.closeTime}
                onChange={(e) => update(i, 'closeTime', e.target.value)}
              />
            </div>

            <div>
              <Label>Intervalo mín. (min)</Label>
              <Input
                type="number"
                min={0}
                value={court.minIntervalMinutes}
                onChange={(e) => update(i, 'minIntervalMinutes', Number(e.target.value))}
              />
            </div>

            <div className="col-span-2 sm:col-span-3 flex items-center gap-2">
              <Switch
                id={`show-court-${i}`}
                checked={court.isShowCourt}
                onCheckedChange={(v) => update(i, 'isShowCourt', v)}
              />
              <Label htmlFor={`show-court-${i}`} className="cursor-pointer">
                Quadra central (transmissão)
              </Label>
            </div>
          </div>
        </div>
      ))}

      <Button type="button" variant="outline" onClick={addCourt} className="w-full gap-2">
        <Plus size={14} /> Adicionar Quadra
      </Button>

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      {courts.length === 0 && (
        <p className="text-sm text-[var(--color-text-muted)] text-center py-4">
          Quadras são opcionais — você pode adicioná-las depois
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
