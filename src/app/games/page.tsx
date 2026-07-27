import type { Metadata } from 'next';
import { listGames, listCategories } from '@/lib/queries';
import { ContentCard, EmptyState } from '@/components/ui/content-card';
import { PageHeader } from '@/components/ui/page-header';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Games', description: 'Play online or download games with leaderboards and reviews.' };
export const revalidate = 60;

export default async function GamesPage(props: { searchParams: Promise<{ category?: string }> }) {
  const searchParams = await props.searchParams;
  const categoryId = searchParams.category || undefined;
  
  const [items, categories] = await Promise.all([
    listGames(categoryId),
    listCategories('game')
  ]);
  
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
      <PageHeader
        title="Games"
        gradientTitle="Games"
        description="Play online or download — with leaderboards, screenshots, trailers and reviews."
        badge="15+ Builds"
      />
      
      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          <Link
            href="/games"
            className={`tap-target rounded-full border px-4 py-2 text-sm ${!categoryId ? 'bg-white/10 border-white/30 text-white' : 'border-white/15 text-slate-400 hover:bg-white/5'}`}
          >
            All
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/games?category=${cat.id}`}
              className={`tap-target rounded-full border px-4 py-2 text-sm ${categoryId === cat.id ? 'bg-white/10 border-white/30 text-white' : 'border-white/15 text-slate-400 hover:bg-white/5'}`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.length === 0 && <EmptyState label="games" />}
        {items.map((g) => (
          <ContentCard key={g.id} href={`/games/${g.slug}`} title={g.title} subtitle={g.description ?? undefined} meta="Game" />
        ))}
      </div>
    </section>
  );
}
