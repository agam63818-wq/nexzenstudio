import type { Metadata } from 'next';
import { listTools } from '@/lib/queries';
import { ContentCard, EmptyState } from '@/components/ui/content-card';

export const metadata: Metadata = { title: 'AI Tools Directory', description: 'Curated AI tools with categories, ratings and reviews.' };
export const revalidate = 60;

export default async function ToolsPage() {
  const items = await listTools();
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
      <h1 className="text-4xl font-black md:text-5xl"><span className="text-gradient">AI Tools Directory</span></h1>
      <p className="mt-3 max-w-2xl text-slate-400">Name, website, category, free/paid, review, rating and share.</p>
      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.length === 0 && <EmptyState label="tools" />}
        {items.map((t) => (
          <ContentCard key={t.id} href={t.website ?? '#'} title={t.name} subtitle={t.pricing ?? undefined} meta={t.category ?? 'Tool'} />
        ))}
      </div>
    </section>
  );
}
