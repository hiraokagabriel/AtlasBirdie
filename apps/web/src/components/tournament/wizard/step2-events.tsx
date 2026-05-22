'use client'

import { useState } from 'react'
import { useWizard } from './wizard-context'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Trash2, Plus } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

const DISCIPLINES = [
  { value: 'MS', label: 'Simples Masculino' },
  { value: 'WS', label: 'Simples Feminino' },
  { value: 'MD', label: 'Duplas Masculinas' },
  { value: 'WD', label: 'Duplas Femininas' },
  { value: 'XD', label: 'Duplas Mistas' },
]

const PRESET_CATEGORIES = ['Sub-13', 'Sub-15', 'Sub-17', 'Sub-19', 'Adulto', 'Master 35+', 'Master 45+']

interface EventRow {
  discipline: string
  category: string
}

export function Step2Events() {
  const { state, dispatch } = useWizard()

  const [events, setEvents] = useState<EventRow[]>(
    state.draft.step2?.events ?? [],
  )
  const [newDiscipline, setNewDiscipline] = useState('MS')
  const [newCategory, setNewCategory] = useState('')
  const [error, setError] = useState<string | null>(null)

  const addEvent = () => {
    setError(null)
    if (!newCategory.trim()) {
      setError('Informe a categoria')
      return
    }
    const duplicate = events.some(
      (e) => e.discipline === newDiscipline && e.category === newCategory.trim(),
    )
    if (duplicate) {
      setError('Esta modalidade + categoria já foi adicionada')
      return
    }
    setEvents((prev) => [...prev, { discipline: newDiscipline, category: newCategory.trim() }])
    setNewCategory('')
  }

  const removeEvent = (index: number) => {
    setEvents((prev) => prev.filter((_, i) => i !== index))
  }

  const onNext = () => {
    if (events.length === 0) {
      setError('Adicione pelo menos uma modalidade')
      return
    }
    dispatch({ type: 'SAVE_DRAFT', step: 'step2', data: { events } })
    dispatch({ type: 'NEXT_STEP' })
  }

  return (
    <div className="space-y-6">
      {/* Adicionador */}
      <div className="rounded-lg border border-[var(--color-border)] p-4 space-y-4">
        <h3 className="text-sm font-semibold">Adicionar Modalidade</h3>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div>
            <Label>Disciplina</Label>
            <Select value={newDiscipline} onValueChange={setNewDiscipline}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DISCIPLINES.map((d) => (
                  <SelectItem key={d.value} value={d.value}>
                    {d.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="sm:col-span-2">
            <Label>Categoria</Label>
            <div className="flex gap-2">
              <Input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Ex: Adulto, Sub-17..."
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addEvent())}
              />
              <Button type="button" size="icon" onClick={addEvent}>
                <Plus size={16} />
              </Button>
            </div>
          </div>
        </div>

        {/* Atalhos de categoria */}
        <div className="flex flex-wrap gap-1.5">
          {PRESET_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setNewCategory(cat)}
              className="px-2 py-0.5 rounded-full text-xs border border-[var(--color-border)] hover:bg-[var(--color-surface-offset)] transition-colors"
            >
              {cat}
            </button>
          ))}
        </div>

        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
      </div>

      {/* Lista */}
      {events.length > 0 ? (
        <ul className="space-y-2">
          {events.map((ev, i) => {
            const disc = DISCIPLINES.find((d) => d.value === ev.discipline)
            return (
              <li
                key={i}
                className="flex items-center justify-between rounded-md border border-[var(--color-border)] px-4 py-2.5"
              >
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">{ev.discipline}</Badge>
                  <span className="text-sm">
                    {disc?.label} — <span className="font-medium">{ev.category}</span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeEvent(i)}
                  className="text-[var(--color-text-muted)] hover:text-destructive transition-colors"
                  aria-label="Remover"
                >
                  <Trash2 size={14} />
                </button>
              </li>
            )
          })}
        </ul>
      ) : (
        <div className="flex flex-col items-center gap-2 py-10 text-[var(--color-text-muted)]">
          <span className="text-sm">Nenhuma modalidade adicionada ainda</span>
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
