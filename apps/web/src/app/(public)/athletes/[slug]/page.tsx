import { api } from '@/lib/api'
import type { SingleResponse, AthleteWithClub } from '@atlas/types'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const revalidate = 300

export default async function AthleteProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const result = await api
    .get<SingleResponse<AthleteWithClub>>(`/api/athletes/${slug}`, { revalidate: 300 })
    .catch(() => null)

  if (!result) notFound()

  const { data: athlete } = result

  return (
    <main className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center gap-6 mb-8">
        <div className="relative w-24 h-24 rounded-full overflow-hidden bg-muted flex-shrink-0">
          {athlete.photoUrl ? (
            <Image
              src={athlete.photoUrl}
              alt={athlete.name}
              fill
              className="object-cover"
              sizes="96px"
              priority
            />
          ) : (
            <span className="flex items-center justify-center w-full h-full text-3xl font-bold text-muted-foreground">
              {athlete.name[0]}
            </span>
          )}
        </div>
        <div>
          <h1 className="text-2xl font-semibold">{athlete.name}</h1>
          {athlete.club && (
            <Link
              href={`/clubs/${athlete.club.slug}`}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {athlete.club.name}
            </Link>
          )}
          {athlete.city && (
            <p className="text-sm text-muted-foreground mt-1">
              {athlete.city}{athlete.state ? `, ${athlete.state}` : ''}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {athlete.gender && (
          <div className="rounded-lg border p-4">
            <p className="text-xs text-muted-foreground mb-1">Gênero</p>
            <p className="font-medium">{athlete.gender === 'M' ? 'Masculino' : athlete.gender === 'F' ? 'Feminino' : 'Outro'}</p>
          </div>
        )}
        {athlete.handedness && (
          <div className="rounded-lg border p-4">
            <p className="text-xs text-muted-foreground mb-1">Lateralidade</p>
            <p className="font-medium">{athlete.handedness === 'RIGHT' ? 'Destro' : 'Canhoto'}</p>
          </div>
        )}
        {athlete.birthDate && (
          <div className="rounded-lg border p-4">
            <p className="text-xs text-muted-foreground mb-1">Data de Nascimento</p>
            <p className="font-medium">
              {new Date(athlete.birthDate).toLocaleDateString('pt-BR')}
            </p>
          </div>
        )}
        <div className="rounded-lg border p-4">
          <p className="text-xs text-muted-foreground mb-1">Status</p>
          <p className="font-medium capitalize">{athlete.status.toLowerCase()}</p>
        </div>
      </div>
    </main>
  )
}
