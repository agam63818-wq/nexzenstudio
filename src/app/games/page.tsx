import type { Metadata } from 'next';
import { listGames } from '@/lib/queries';
import { ContentCard, EmptyState } from '@/components/ui/content-card';

export const metadata: Metadata = { title: 'Games', description: 'Play online or download games with leaderboards and reviews.' };
export const revalidate = 60;

export default async function GamesPage() {
  const items = await listGames();
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
      <h1 className="text-4xl font-black md:text-5xl"><span className="text-gradient">Games</span></h1>
      <p className="mt-3 max-w-2xl text-slate-400">Play online, download, leaderboard, screenshots, trailer and reviews.</p>
      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.length === 0 && <EmptyState label="games" />}
        {items.map((g) => (
          <ContentCard key={g.id} href={`/games/${g.slug}`} title={g.title} subtitle={g.description ?? undefined} meta="Game" />
        ))}
      </div>
    </section>
  );
}
