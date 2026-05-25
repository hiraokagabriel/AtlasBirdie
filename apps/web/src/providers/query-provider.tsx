'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { type ReactNode } from 'react'
import { getQueryClient } from '../lib/query-client'

// DevTools carregados só em dev e só no cliente, sem dynamic import
// que pode causar problemas de bundle em monorepo
let ReactQueryDevtools: React.ComponentType<{ initialIsOpen: boolean }> | null = null
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  import('@tanstack/react-query-devtools')
    .then((mod) => { ReactQueryDevtools = mod.ReactQueryDevtools })
    .catch(() => {})
}

export function QueryProvider({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {ReactQueryDevtools && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  )
}
