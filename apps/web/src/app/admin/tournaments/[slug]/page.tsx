'use client'

import { use } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { useTournament } from '@/hooks/use-tournaments'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ExternalLink, Calendar, MapPin, Users } from 'lucide-react'

const STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Rascunho',
  REGISTRATIONS_OPEN: 'Inscrições abertas',
  REGISTRATIONS_CLOSED: 'Inscrições encerradas',
  IN_PROGRESS: 'Em andamento',
  FINISHED: 'Encerrado',
  ARCHIVED: 'Arquivado',
}

const STATUS_VARIANTS: Record<string, 'default' | 'secondary' | 'outline'> = {
  DRAFT: 'secondary',
  REGISTRATIONS_OPEN: 'default',
  REGISTRATIONS_CLOSED: 'secondary',
  IN_PROGRESS: 'default',
  FINISHED: 'outline',
  ARCHIVED: 'outline',
}

const DISCIPLINE_LABELS: Record<string, string> = {
  MENS_SINGLES: 'Simples Masc.',
  WOMENS_SINGLES: 'Simples Fem.',
  MENS_DOUBLES: 'Duplas Masc.',
  WOMENS_DOUBLES: 'Duplas Fem.',
  MIXED_DOUBLES: 'Duplas Mistas',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export default function AdminTournamentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const { data, isLoading, isError } = useTournament(slug)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded bg-[var(--color-surface-offset)] animate-pulse" />
          <div className="h-6 w-48 rounded bg-[var(--color-surface-offset)] animate-pulse" />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 rounded-lg bg-[var(--color-surface-offset)] animate-pulse" />
          ))}
        </div>
        <div className="h-48 rounded-lg bg-[var(--color-surface-offset)] animate-pulse" />
      </div>
    )
  }

  if (isError || !data?.data) {
    notFound()
  }

  const t = data.data

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Button variant="ghost" size="icon" asChild className="mt-0.5 shrink-0">
            <Link href="/admin/tournaments" aria-label="Voltar para lista">
              <ArrowLeft size={16} />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-semibold">{t.name}</h1>
              <Badge variant={STATUS_VARIANTS[t.status] ?? 'secondary'}>
                {STATUS_LABELS[t.status] ?? t.status}
              </Badge>
            </div>
            <p className="text-sm text-[var(--color-text-muted)] mt-0.5">{t.slug}</p>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/torneios/${t.slug}`} target="_blank" rel="noopener noreferrer">
              <ExternalLink size={14} className="mr-1.5" />
              Ver público
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link href={`/admin/tournaments/${t.slug}/edit`}>
              Editar torneio
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] mb-1">
            <Calendar size={14} />
            Período
          </div>
          <p className="text-sm font-medium">
            {formatDate(t.startDate)} — {formatDate(t.endDate)}
          </p>
        </div>
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] mb-1">
            <MapPin size={14} />
            Local
          </div>
          <p className="text-sm font-medium">
            {[t.location, t.city, t.state].filter(Boolean).join(', ') || '—'}
          </p>
        </div>
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] mb-1">
            <Users size={14} />
            Vagas globais
          </div>
          <p className="text-sm font-medium tabular-nums">
            {t.maxInscriptionsGlobal ?? 'Ilimitadas'}
          </p>
        </div>
      </div>

      {t.description && (
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <h2 className="text-sm font-semibold mb-2">Descrição</h2>
          <p className="text-sm text-[var(--color-text-muted)] whitespace-pre-line">{t.description}</p>
        </div>
      )}

      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)]">
          <h2 className="text-sm font-semibold">Modalidades ({t.events.length})</h2>
        </div>
        {t.events.length === 0 ? (
          <div className="py-10 text-center text-sm text-[var(--color-text-muted)]">
            Nenhuma modalidade cadastrada ainda.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-offset)]">
                <th className="px-4 py-2.5 text-left font-medium text-[var(--color-text-muted)]">Modalidade</th>
                <th className="px-4 py-2.5 text-left font-medium text-[var(--color-text-muted)]">Categoria</th>
                <th className="px-4 py-2.5 text-left font-medium text-[var(--color-text-muted)]">Formato</th>
                <th className="px-4 py-2.5 text-left font-medium text-[var(--color-text-muted)]">Vagas</th>
                <th className="px-4 py-2.5 text-left font-medium text-[var(--color-text-muted)]">Status</th>
              </tr>
            </thead>
            <tbody>
              {t.events.map((ev, i) => (
                <tr
                  key={ev.id}
                  className={i < t.events.length - 1 ? 'border-b border-[var(--color-border)]' : ''}
                >
                  <td className="px-4 py-3 font-medium">
                    {DISCIPLINE_LABELS[ev.discipline] ?? ev.discipline}
                  </td>
                  <td className="px-4 py-3 text-[var(--color-text-muted)]">{ev.category}</td>
                  <td className="px-4 py-3 text-[var(--color-text-muted)]">{ev.bracketFormat}</td>
                  <td className="px-4 py-3 tabular-nums">{ev.maxInscriptions ?? '—'}</td>
                  <td className="px-4 py-3">
                    <Badge variant={STATUS_VARIANTS[ev.status] ?? 'secondary'} className="text-xs">
                      {STATUS_LABELS[ev.status] ?? ev.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
