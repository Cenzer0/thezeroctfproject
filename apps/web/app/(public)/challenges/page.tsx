import Link from 'next/link';

async function getChallenges() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/challenges`, { next: { revalidate: 60 } });
  return res.json();
}

export default async function ChallengesCatalog() {
  const challenges = await getChallenges();
  return (
    <main className="container py-6">
      <h1 className="text-2xl font-semibold mb-4">Challenges</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {challenges.map((c: any) => (
          <Link key={c.id} href={`/challenges/${c.slug}`} className="border rounded p-4 hover:shadow">
            <div className="text-lg font-medium">{c.title}</div>
            <div className="text-sm text-muted-foreground">{c.points} pts</div>
          </Link>
        ))}
      </div>
    </main>
  );
}
