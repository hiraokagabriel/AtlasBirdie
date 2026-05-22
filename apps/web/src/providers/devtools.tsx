'use client'

import { useState, useEffect } from 'react'

// eval() prevents Webpack from statically analysing the require path.
// This chunk is only loaded in the browser (next/dynamic ssr:false in
// query-provider.tsx) and only renders in development.
export function QueryDevtools() {
  const [Devtools, setDevtools] = useState<React.ComponentType<{ initialIsOpen: boolean }> | null>(null)

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return
    // eslint-disable-next-line no-eval
    const mod = eval("require")('@tanstack/react-query-devtools') as {
      ReactQueryDevtools: React.ComponentType<{ initialIsOpen: boolean }>
    }
    setDevtools(() => mod.ReactQueryDevtools)
  }, [])

  if (!Devtools) return null
  return <Devtools initialIsOpen={false} />
}
