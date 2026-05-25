'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import dynamic from 'next/dynamic'
import { type ReactNode } from 'react'
import { getQueryClient } from '../lib/query-client'

// Devtools are loaded from a separate file that only imports
// @tanstack/react-query-devtools. next/dynamic with ssr:false ensures
// Webpack never attempts to bundle this module in the server build.
// In production the chunk is never requested (NODE_ENV guard inside the file).
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
