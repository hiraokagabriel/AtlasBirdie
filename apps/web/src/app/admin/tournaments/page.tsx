'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTournaments, useDeleteTournament, type TournamentListItem } from '@/hooks/use-tournaments'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { MoreHorizontal, Plus, Search, Pencil, Trash2, Eye } from 'lucide-react'
import { useDebounce } from '@/hooks/use-debounce'

const STATUS_COLORS: Record<string, string> = {
  DRAFT: 'secondary',
  REGISTRATIONS_OPEN: 'default',
  REGISTRATIONS_CLOSED: 'secondary',
  IN_PROGRESS: 'default',
  FINISHED: 'outline',
  ARCHIVED: 'outline',
}

export default function AdminTournamentsPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [deleteTarget, setDeleteTarget] = useState<TournamentListItem | null>(null)

  const [debouncedSearch] = useDebounce(search, 300)

  const { data, isLoading } = useTournaments({
    search: debouncedSearch,
    page,
    perPage: 20,
  })

  const deleteMutation = useDeleteTournament()

  const handleDelete = async () => {
    if (!deleteTarget) return
    await deleteMutation.mutateAsync({ id: deleteTarget.id })
    setDeleteTarget(null)
  }

  const tournaments = data?.data ?? []
  const meta = data?.meta

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Torneios</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
            Gerencie todos os torneios da federação
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/tournaments/new">
            <Plus size={16} className="mr-1.5" />
            Novo Torneio
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <div className="relative flex-1 max-w-xs">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
          />
          <Input
            placeholder="Buscar torneio..."
            className="pl-8"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-[var(--color-border)] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Local</TableHead>
              <TableHead>Período</TableHead>
              <TableHead>Modalidades</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <TableCell key={j}>
                      <div className="h-4 rounded bg-[var(--color-surface-offset)] animate-pulse" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : tournaments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-[var(--color-text-muted)]">
                  Nenhum torneio encontrado.{' '}
                  <Link href="/admin/tournaments/new" className="underline text-[var(--color-primary)]">
                    Criar o primeiro
                  </Link>
                </TableCell>
              </TableRow>
            ) : (
              tournaments.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">{t.name}</TableCell>
                  <TableCell className="text-sm text-[var(--color-text-muted)]">
                    {[t.city, t.state].filter(Boolean).join(', ') || '—'}
                  </TableCell>
                  <TableCell className="text-sm">{t.periodLabel}</TableCell>
                  <TableCell className="text-sm tabular-nums">{t.eventsCount}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        (STATUS_COLORS[t.status] ?? 'secondary') as
                          | 'default'
                          | 'secondary'
                          | 'outline'
                      }
                    >
                      {t.statusLabel}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" aria-label="Ações">
                          <MoreHorizontal size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/torneios/${t.slug}`}>
                            <Eye size={14} className="mr-2" /> Ver página pública
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/tournaments/${t.slug}`}>
                            <Pencil size={14} className="mr-2" /> Editar
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => setDeleteTarget(t)}
                        >
                          <Trash2 size={14} className="mr-2" /> Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-[var(--color-text-muted)]">
          <span>
            {meta.total} torneio{meta.total !== 1 ? 's' : ''}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= meta.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Próxima
            </Button>
          </div>
        </div>
      )}

      {/* Delete dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir torneio?</AlertDialogTitle>
            <AlertDialogDescription>
              O torneio <strong>{deleteTarget?.name}</strong> será arquivado e não ficará mais
              visível. Esta ação pode ser revertida pelo suporte.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
