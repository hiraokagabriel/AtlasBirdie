import { notFound } from 'next/navigation';
import Image from 'next/image';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getAthlete(slug: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/athletes/${slug}`, {
    next: { revalidate: 60 },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed to fetch athlete');
  const json = await res.json();
  return json.data;
}

export default async function AthletePublicPage({ params }: PageProps) {
  const { slug } = await params;
  const athlete = await getAthlete(slug);

  if (!athlete) notFound();

  return (
    <main className="container mx-auto max-w-3xl py-12 px-4">
      <div className="flex items-center gap-6">
        {athlete.photoUrl ? (
          <Image
            src={athlete.photoUrl}
            alt={athlete.name}
            width={96}
            height={96}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center text-3xl font-bold">
            {athlete.name[0]}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-semibold">{athlete.name}</h1>
          {athlete.club && (
            <p className="text-muted-foreground">
              {athlete.club.acronym} · {athlete.club.name}
            </p>
          )}
          {(athlete.city || athlete.state) && (
            <p className="text-sm text-muted-foreground">
              {[athlete.city, athlete.state].filter(Boolean).join(', ')}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
