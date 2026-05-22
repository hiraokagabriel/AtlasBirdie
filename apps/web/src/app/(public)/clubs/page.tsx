import { api } from '@/lib/api'
import type { PaginatedResponse, ClubWithAthleteCount } from '@atlas/types'
import Link from 'next/link'
import Image from 'next/image'

export const revalidate = 300

export default async function ClubsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>
}) {
  const { page = '1', search } = await searchParams
  const params = new URLSearchParams({ page, perPage: '20' })
  if (search) params.set('search', search)

  const result = await api
    .get<PaginatedResponse<ClubWithAthleteCount>>(`/api/clubs?${params}`, { revalidate: 300 })
    .catch(() => null)

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Clubes</h1>

      {!result || result.data.length === 0 ? (
        <p className="text-muted-foreground">Nenhum clube encontrado.</p>
      ) : (
        <>
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {result.data.map((club) => (
              <li key={club.id}>
                <Link
                  href={`/clubs/${club.slug}`}
                  className="flex items-center gap-4 p-4 rounded-lg border hover:bg-accent transition-colors"
                >
                  <div className="relative w-12 h-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
                    {club.logoUrl ? (
                      <Image
                        src={club.logoUrl}
                        alt={club.name}
                        fill
                        className="object-contain p-1"
                        sizes="48px"
                        loading="lazy"
                      />
                    ) : (
                      <span className="flex items-center justify-center w-full h-full text-sm font-bold text-muted-foreground">
                        {club.acronym}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium leading-tight">{club.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {club._count.athletes} atleta{club._count.athletes !== 1 ? 's' : ''}
                      {club.city ? ` · ${club.city}` : ''}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex items-center justify-between text-sm text-muted-foreground">
            <span>{result.meta.total} clube{result.meta.total !== 1 ? 's' : ''}</span>
            <span>Página {result.meta.page} de {result.meta.totalPages}</span>
          </div>
        </>
      )}
    </main>
  )
}
