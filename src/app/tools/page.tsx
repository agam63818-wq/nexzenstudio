import type { Metadata } from 'next';
import { listTools } from '@/lib/queries';
import { ContentCard, EmptyState } from '@/components/ui/content-card';
import { PageHeader } from '@/components/ui/page-header';

export const metadata: Metadata = { title: 'AI Tools Directory', description: 'Curated AI tools with categories, ratings and reviews.' };
export const revalidate = 60;

export default async function ToolsPage() {
  const items = await listTools();
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
      <PageHeader
        title="AI Tools Directory"
        gradientTitle="AI Tools Directory"
        description="Curated AI tools with categories, free/paid info, ratings and reviews."
        badge="Curated Directory"
      />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.length === 0 && <EmptyState label="tools" />}
        {items.map((t) => (
          <ContentCard key={t.id} href={t.website ?? '#'} title={t.name} subtitle={t.pricing ?? undefined} meta={t.category ?? 'Tool'} />
        ))}
      </div>
    </section>
  );
}
