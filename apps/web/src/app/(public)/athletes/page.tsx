import { api } from '@/lib/api'
import type { PaginatedResponse, AthleteWithClub } from '@atlas/types'
import Link from 'next/link'
import Image from 'next/image'

export const revalidate = 300 // ISR 5 min

export default async function AthletesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>
}) {
  const { page = '1', search } = await searchParams
  const params = new URLSearchParams({ page, perPage: '24' })
  if (search) params.set('search', search)

  const result = await api
    .get<PaginatedResponse<AthleteWithClub>>(`/api/athletes?${params}`, { revalidate: 300 })
    .catch(() => null)

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Atletas</h1>

      {!result || result.data.length === 0 ? (
        <p className="text-muted-foreground">Nenhum atleta encontrado.</p>
      ) : (
        <>
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {result.data.map((athlete) => (
              <li key={athlete.id}>
                <Link
                  href={`/athletes/${athlete.slug}`}
                  className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="relative w-16 h-16 rounded-full overflow-hidden bg-muted">
                    {athlete.photoUrl ? (
                      <Image
                        src={athlete.photoUrl}
                        alt={athlete.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                        loading="lazy"
                      />
                    ) : (
                      <span className="flex items-center justify-center w-full h-full text-xl font-bold text-muted-foreground">
                        {athlete.name[0]}
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-medium text-center leading-tight">{athlete.name}</span>
                  {athlete.club && (
                    <span className="text-xs text-muted-foreground">{athlete.club.acronym}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex items-center justify-between text-sm text-muted-foreground">
            <span>
              {result.meta.total} atleta{result.meta.total !== 1 ? 's' : ''}
            </span>
            <span>
              Página {result.meta.page} de {result.meta.totalPages}
            </span>
          </div>
        </>
      )}
    </main>
  )
}
