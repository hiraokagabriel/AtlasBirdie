'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createTournamentSchema, type CreateTournamentInput } from '@atlas/validators'
import { useWizard } from './wizard-context'
import { useCreateTournament } from '@/hooks/use-tournaments'
import { useAuth } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { slugify } from '@/lib/utils'

export function Step1General() {
  const { state, dispatch } = useWizard()
  const { getToken } = useAuth()
  const createMutation = useCreateTournament()

  const form = useForm<CreateTournamentInput>({
    resolver: zodResolver(createTournamentSchema),
    defaultValues: {
      name: state.draft.step1?.name ?? '',
      slug: state.draft.step1?.slug ?? '',
      description: state.draft.step1?.description ?? '',
      city: state.draft.step1?.city ?? '',
      state: state.draft.step1?.state ?? '',
      location: state.draft.step1?.location ?? '',
      startDate: state.draft.step1?.startDate ?? '',
      endDate: state.draft.step1?.endDate ?? '',
    },
  })

  const onSubmit = async (data: CreateTournamentInput) => {
    dispatch({ type: 'SET_ERROR', error: null })
    dispatch({ type: 'SET_SAVING', value: true })

    try {
      const token = await getToken()
      if (!token) throw new Error('Não autenticado')

      if (!state.createdTournamentId) {
        // token é obtido fresco aqui — nunca stale
        const result = await createMutation.mutateAsync({ ...data, token })
        dispatch({
          type: 'SET_CREATED',
          id: result.data.id,
          slug: result.data.slug,
        })
      }

      dispatch({ type: 'SAVE_DRAFT', step: 'step1', data })
      dispatch({ type: 'NEXT_STEP' })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao criar torneio'
      dispatch({ type: 'SET_ERROR', error: message })
    } finally {
      dispatch({ type: 'SET_SAVING', value: false })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Nome do Torneio *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ex: Open Nacional de Badminton 2026"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e)
                      if (!state.draft.step1?.slug) {
                        form.setValue('slug', slugify(e.target.value))
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Slug (URL amigável) *</FormLabel>
                <FormControl>
                  <div className="flex items-center">
                    <span className="inline-flex items-center px-3 h-9 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                      /torneios/
                    </span>
                    <Input
                      {...field}
                      className="rounded-l-none"
                      placeholder="open-nacional-2026"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Início *</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Término *</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cidade</FormLabel>
                <FormControl>
                  <Input placeholder="São Paulo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado</FormLabel>
                <FormControl>
                  <Input placeholder="SP" maxLength={2} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Local / Ginásio</FormLabel>
                <FormControl>
                  <Input placeholder="Centro Esportivo Ibirapuera" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Textarea
                    rows={3}
                    placeholder="Breve descrição do torneio visível ao público"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {state.error && (
          <p className="text-sm text-destructive" role="alert">
            {state.error}
          </p>
        )}

        <div className="flex justify-end">
          <Button type="submit" disabled={state.isSaving}>
            {state.isSaving ? 'Salvando...' : 'Próximo →'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
