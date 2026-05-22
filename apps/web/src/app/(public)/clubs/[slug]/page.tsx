import { api } from '@/lib/api'
import type { SingleResponse, ClubWithAthleteCount, PaginatedResponse, AthleteWithClub } from '@atlas/types'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const revalidate = 300

export default async function ClubProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const [clubResult, athletesResult] = await Promise.all([
    api
      .get<SingleResponse<ClubWithAthleteCount>>(`/api/clubs/${slug}`, { revalidate: 300 })
      .catch(() => null),
    api
      .get<PaginatedResponse<AthleteWithClub>>(`/api/athletes?clubId=${slug}&perPage=50`, {
        revalidate: 300,
      })
      .catch(() => null),
  ])

  if (!clubResult) notFound()

  const { data: club } = clubResult
  const athletes = athletesResult?.data ?? []

  return (
    <main className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="flex items-center gap-6 mb-8">
        <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-muted flex-shrink-0">
          {club.logoUrl ? (
            <Image
              src={club.logoUrl}
              alt={club.name}
              fill
              className="object-contain p-2"
              sizes="80px"
              priority
            />
          ) : (
            <span className="flex items-center justify-center w-full h-full text-2xl font-bold text-muted-foreground">
              {club.acronym}
            </span>
          )}
        </div>
        <div>
          <h1 className="text-2xl font-semibold">{club.name}</h1>
          <p className="text-sm text-muted-foreground">
            {club.acronym}
            {club.city ? ` · ${club.city}` : ''}
            {club.state ? `/${club.state}` : ''}
          </p>
          <p className="text-sm text-muted-foreground">
            {club._count.athletes} atleta{club._count.athletes !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {athletes.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-4">Atletas</h2>
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {athletes.map((athlete) => (
              <li key={athlete.id}>
                <Link
                  href={`/athletes/${athlete.slug}`}
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors"
                >
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-muted flex-shrink-0">
                    {athlete.photoUrl ? (
                      <Image
                        src={athlete.photoUrl}
                        alt={athlete.name}
                        fill
                        className="object-cover"
                        sizes="40px"
                        loading="lazy"
                      />
                    ) : (
                      <span className="flex items-center justify-center w-full h-full text-sm font-bold text-muted-foreground">
                        {athlete.name[0]}
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-medium leading-tight">{athlete.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  )
}
