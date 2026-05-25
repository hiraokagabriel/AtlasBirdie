'use client'

import { useState, useEffect, type ComponentType } from 'react'

interface DevtoolsProps {
  initialIsOpen: boolean
}

export function QueryDevtools() {
  const [Devtools, setDevtools] = useState<ComponentType<DevtoolsProps> | null>(null)

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return

    // @tanstack/react-query-devtools deve estar instalado — listado em package.json
    import('@tanstack/react-query-devtools')
      .then((mod) => {
        setDevtools(() => mod.ReactQueryDevtools as ComponentType<DevtoolsProps>)
      })
      .catch((err) => {
        console.warn('[QueryDevtools] pacote não encontrado — rode pnpm install na raiz', err)
      })
  }, [])

  if (!Devtools) return null
  return <Devtools initialIsOpen={false} />
}
