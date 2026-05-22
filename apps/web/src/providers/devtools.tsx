'use client'

import { useState, useEffect, type ComponentType } from 'react'

interface DevtoolsProps {
  initialIsOpen: boolean
}

export function QueryDevtools() {
  const [Devtools, setDevtools] = useState<ComponentType<DevtoolsProps> | null>(null)

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return

    import('@tanstack/react-query-devtools').then((mod) => {
      setDevtools(() => mod.ReactQueryDevtools as ComponentType<DevtoolsProps>)
    }).catch(() => {
      // silently ignore if devtools are unavailable
    })
  }, [])

  if (!Devtools) return null
  return <Devtools initialIsOpen={false} />
}
