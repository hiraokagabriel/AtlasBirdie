'use client'

import { QueryClient } from '@tanstack/react-query'

let client: QueryClient | undefined

export function getQueryClient(): QueryClient {
  if (typeof window === 'undefined') {
    return new QueryClient({
      defaultOptions: {
        queries: { staleTime: 60 * 1000, retry: 1 },
      },
    })
  }

  if (!client) {
    client = new QueryClient({
      defaultOptions: {
        queries: { staleTime: 60 * 1000, retry: 1 },
      },
    })
  }

  return client
}
