import { Suspense } from 'react'
import { CategoriesManager } from '@/components/shared/categories-manager'

export const metadata = {
  title: 'Categories & Disciplines — Atlas Birdie Admin',
}

export default function CategoriesSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Categories &amp; Disciplines</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Configure the age categories and disciplines available in your federation.
        </p>
      </div>

      {/* BWF fixed disciplines — read-only */}
      <section>
        <h2 className="text-base font-medium mb-3">BWF Standard Disciplines</h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {(['MS', 'WS', 'MD', 'WD', 'XD'] as const).map((code) => (
            <div
              key={code}
              className="rounded-md border px-3 py-2 text-sm font-medium bg-muted/40"
            >
              <span className="font-mono text-primary">{code}</span>
              <span className="block text-xs text-muted-foreground mt-0.5">
                {{
                  MS: "Men's Singles",
                  WS: "Women's Singles",
                  MD: "Men's Doubles",
                  WD: "Women's Doubles",
                  XD: 'Mixed Doubles',
                }[code]}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Dynamic categories managed per tenant */}
      <section>
        <h2 className="text-base font-medium mb-3">Age Categories</h2>
        <Suspense fallback={<div className="h-48 animate-pulse rounded-lg bg-muted" />}>
          <CategoriesManager />
        </Suspense>
      </section>
    </div>
  )
}
