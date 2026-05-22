'use client'

import { useState } from 'react'
import { useCategories, useCreateCategory, useDeleteCategory, useUpdateCategory } from '@/hooks/use-categories'
import type { Category, CreateCategoryInput } from '@atlas-birdie/types'

const ALL_DISCIPLINES = ['MS', 'WS', 'MD', 'WD', 'XD'] as const

function CategoryRow({ category, onDelete, onToggle }: {
  category: Category
  onDelete: (id: string) => void
  onToggle: (id: string, isActive: boolean) => void
}) {
  return (
    <tr className="border-b last:border-0">
      <td className="py-3 pr-4 font-medium text-sm">{category.name}</td>
      <td className="py-3 pr-4 text-sm text-muted-foreground">
        {category.disciplines.join(', ')}
      </td>
      <td className="py-3 pr-4 text-sm">
        {category.minAge ?? '—'} – {category.maxAge ?? '∞'}
      </td>
      <td className="py-3 pr-4">
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
            category.isActive
              ? 'bg-green-100 text-green-700'
              : 'bg-muted text-muted-foreground'
          }`}
        >
          {category.isActive ? 'Active' : 'Inactive'}
        </span>
      </td>
      <td className="py-3 text-right">
        <button
          onClick={() => onToggle(category.id, !category.isActive)}
          className="text-xs text-muted-foreground hover:text-foreground mr-3 transition-colors"
        >
          {category.isActive ? 'Deactivate' : 'Activate'}
        </button>
        <button
          onClick={() => onDelete(category.id)}
          className="text-xs text-destructive hover:text-destructive/80 transition-colors"
        >
          Delete
        </button>
      </td>
    </tr>
  )
}

function CreateCategoryForm({ onSuccess }: { onSuccess: () => void }) {
  const createMutation = useCreateCategory()
  const [form, setForm] = useState<CreateCategoryInput>({
    name: '',
    disciplines: ['MS', 'WS', 'MD', 'WD', 'XD'],
    allowedGender: 'ANY',
    minAge: null,
    maxAge: null,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await createMutation.mutateAsync(form)
    onSuccess()
  }

  const toggleDiscipline = (d: string) => {
    setForm((prev) => ({
      ...prev,
      disciplines: prev.disciplines.includes(d as never)
        ? (prev.disciplines.filter((x) => x !== d) as CreateCategoryInput['disciplines'])
        : ([...prev.disciplines, d] as CreateCategoryInput['disciplines']),
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border p-4 bg-muted/20">
      <h3 className="text-sm font-medium">New Category</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium mb-1" htmlFor="cat-name">Name</label>
          <input
            id="cat-name"
            required
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            placeholder="e.g. Sub-17"
            className="w-full rounded-md border px-3 py-1.5 text-sm bg-background"
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Allowed Gender</label>
          <select
            value={form.allowedGender}
            onChange={(e) => setForm((p) => ({ ...p, allowedGender: e.target.value as 'M' | 'F' | 'ANY' }))}
            className="w-full rounded-md border px-3 py-1.5 text-sm bg-background"
          >
            <option value="ANY">Any</option>
            <option value="M">Male only</option>
            <option value="F">Female only</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1" htmlFor="min-age">Min age</label>
          <input
            id="min-age"
            type="number"
            value={form.minAge ?? ''}
            onChange={(e) => setForm((p) => ({ ...p, minAge: e.target.value ? Number(e.target.value) : null }))}
            className="w-full rounded-md border px-3 py-1.5 text-sm bg-background"
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1" htmlFor="max-age">Max age</label>
          <input
            id="max-age"
            type="number"
            value={form.maxAge ?? ''}
            onChange={(e) => setForm((p) => ({ ...p, maxAge: e.target.value ? Number(e.target.value) : null }))}
            className="w-full rounded-md border px-3 py-1.5 text-sm bg-background"
          />
        </div>
      </div>
      <div>
        <span className="block text-xs font-medium mb-1">Disciplines</span>
        <div className="flex flex-wrap gap-2">
          {ALL_DISCIPLINES.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => toggleDiscipline(d)}
              className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
                form.disciplines.includes(d)
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background text-muted-foreground border-border'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={createMutation.isPending}
          className="rounded-md bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {createMutation.isPending ? 'Creating…' : 'Create Category'}
        </button>
      </div>
      {createMutation.isError && (
        <p className="text-xs text-destructive">{(createMutation.error as Error).message}</p>
      )}
    </form>
  )
}

export function CategoriesManager() {
  const { data, isLoading } = useCategories()
  const deleteMutation = useDeleteCategory()
  const updateMutation = useUpdateCategory()
  const [showForm, setShowForm] = useState(false)

  if (isLoading) {
    return <div className="h-48 animate-pulse rounded-lg bg-muted" />
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={() => setShowForm((v) => !v)}
          className="rounded-md border px-3 py-1.5 text-sm font-medium hover:bg-muted transition-colors"
        >
          {showForm ? 'Cancel' : '+ New Category'}
        </button>
      </div>

      {showForm && (
        <CreateCategoryForm onSuccess={() => setShowForm(false)} />
      )}

      {!data?.data.length ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
          <p className="text-sm font-medium text-muted-foreground">No categories yet</p>
          <p className="text-xs text-muted-foreground mt-1">Create your first category to get started.</p>
        </div>
      ) : (
        <div className="rounded-lg border overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-muted/40">
              <tr>
                <th className="px-0 py-2 pr-4 text-xs font-medium text-muted-foreground pl-4">Name</th>
                <th className="py-2 pr-4 text-xs font-medium text-muted-foreground">Disciplines</th>
                <th className="py-2 pr-4 text-xs font-medium text-muted-foreground">Age range</th>
                <th className="py-2 pr-4 text-xs font-medium text-muted-foreground">Status</th>
                <th className="py-2 text-right pr-4 text-xs font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="pl-4">
              {data.data.map((cat) => (
                <CategoryRow
                  key={cat.id}
                  category={cat}
                  onDelete={(id) => deleteMutation.mutate(id)}
                  onToggle={(id, isActive) => updateMutation.mutate({ id, isActive })}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
