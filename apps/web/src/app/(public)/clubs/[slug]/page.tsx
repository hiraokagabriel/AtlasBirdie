import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getClub(slug: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clubs/${slug}`, {
    next: { revalidate: 60 },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed to fetch club');
  const json = await res.json();
  return json.data;
}

export default async function ClubPublicPage({ params }: PageProps) {
  const { slug } = await params;
  const club = await getClub(slug);

  if (!club) notFound();

  return (
    <main className="container mx-auto max-w-4xl py-12 px-4">
      <div className="flex items-center gap-6 mb-10">
        {club.logoUrl ? (
          <Image
            src={club.logoUrl}
            alt={club.name}
            width={80}
            height={80}
            className="rounded-lg object-contain"
          />
        ) : (
          <div className="h-20 w-20 rounded-lg bg-muted flex items-center justify-center font-bold text-xl">
            {club.acronym}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-semibold">{club.name}</h1>
          <p className="text-muted-foreground">
            {[club.city, club.state].filter(Boolean).join(', ')}
          </p>
        </div>
      </div>

      {club.athletes?.length > 0 && (
        <section>
          <h2 className="text-lg font-medium mb-4">Atletas</h2>
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {club.athletes.map((a: { id: string; slug: string; name: string; photoUrl: string | null }) => (
              <li key={a.id}>
                <Link
                  href={`/athletes/${a.slug}`}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="h-8 w-8 rounded-full bg-muted-foreground/20 flex items-center justify-center text-xs font-medium shrink-0">
                    {a.name[0]}
                  </div>
                  <span className="text-sm truncate">{a.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
