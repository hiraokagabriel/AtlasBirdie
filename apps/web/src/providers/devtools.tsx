'use client'

// This file is only ever loaded in the browser (via next/dynamic ssr:false).
// The NODE_ENV check ensures the heavy devtools package is never evaluated
// in production — if the condition is false, nothing is imported or rendered.
export function QueryDevtools() {
  if (process.env.NODE_ENV !== 'development') return null

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { ReactQueryDevtools } = require('@tanstack/react-query-devtools') as {
    ReactQueryDevtools: React.ComponentType<{ initialIsOpen: boolean }>
  }

  return <ReactQueryDevtools initialIsOpen={false} />
}
