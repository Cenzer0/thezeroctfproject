import { Markdown } from '@ctf/ui';

async function getChallenge(slug: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/challenges/${slug}`, { cache: 'no-store' });
  return res.json();
}

export default async function ChallengeDetail({ params }: { params: { slug: string } }) {
  const challenge = await getChallenge(params.slug);
  return (
    <main className="container py-6 space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">{challenge.title}</h1>
        <div className="text-muted-foreground">{challenge.points} pts</div>
      </div>
      <Markdown content={challenge.description} />
      {/* TODO: hints, attachments, spawn/stop/reset buttons, submit form */}
    </main>
  );
}
