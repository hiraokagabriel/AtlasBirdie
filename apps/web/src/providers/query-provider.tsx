'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import dynamic from 'next/dynamic'
import { type ReactNode } from 'react'
import { getQueryClient } from '../lib/query-client'

// Loaded only in the browser (ssr:false) so Webpack never bundles
// @tanstack/react-query-devtools in the server/production build.
const QueryDevtools = dynamic(
  () => import('./devtools').then((mod) => ({ default: mod.QueryDevtools })),
  { ssr: false }
)

export function QueryProvider({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <QueryDevtools />
    </QueryClientProvider>
  )
}
