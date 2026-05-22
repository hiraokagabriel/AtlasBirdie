'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Category, CreateCategoryInput, UpdateCategoryInput, Discipline } from '@atlas-birdie/types'

interface ListCategoriesParams {
  discipline?: Discipline
  isActive?: boolean
  page?: number
  perPage?: number
}

interface CategoriesResponse {
  data: Category[]
  meta: { total: number; page: number; perPage: number }
}

export function useCategories(params: ListCategoriesParams = {}) {
  return useQuery<CategoriesResponse>({
    queryKey: ['categories', params],
    queryFn: () => api.get<CategoriesResponse>('/categories', { params }),
  })
}

export function useCreateCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateCategoryInput) =>
      api.post<{ data: Category }>('/categories', input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
  })
}

export function useUpdateCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...input }: UpdateCategoryInput & { id: string }) =>
      api.patch<{ data: Category }>(`/categories/${id}`, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
  })
}

export function useDeleteCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/categories/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
  })
}

export function useDisciplines() {
  return useQuery({
    queryKey: ['disciplines'],
    queryFn: () => api.get<{ data: typeof import('@atlas-birdie/types').DISCIPLINE_LABELS }>('/disciplines'),
    staleTime: Infinity, // disciplines never change
  })
}
