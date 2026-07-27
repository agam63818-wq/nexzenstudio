import type { Metadata } from 'next';
import { listCategories, listGames } from '@/lib/queries';
import { ContentCard, EmptyState } from '@/components/ui/content-card';
import { CategoryFilter } from '@/components/ui/category-filter';
import { PageHeader } from '@/components/ui/page-header';

export const metadata: Metadata = { title: 'Games', description: 'Play online or download games with leaderboards and reviews.' };
export const revalidate = 60;

interface Props {
  searchParams?: Promise<{ category?: string }>;
}

export default async function GamesPage({ searchParams }: Props) {
  const params = await searchParams;
  const selectedCategory = params?.category;
  const [items, categories] = await Promise.all([
    listGames(selectedCategory),
    listCategories('games'),
  ]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
      <PageHeader
        title="Games"
        gradientTitle="Games"
        description="Play online or download — with leaderboards, screenshots, trailers and reviews."
        badge="15+ Builds"
      />
      <CategoryFilter basePath="/games" categories={categories} selectedCategory={selectedCategory} />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.length === 0 && <EmptyState label="games" />}
        {items.map((g) => (
          <ContentCard key={g.id} href={`/games/${g.slug}`} title={g.title} subtitle={g.description ?? undefined} meta="Game" />
        ))}
      </div>
    </section>
  );
}
