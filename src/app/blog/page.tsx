import type { Metadata } from 'next';
import { listBlogs } from '@/lib/queries';
import { ContentCard, EmptyState } from '@/components/ui/content-card';

export const metadata: Metadata = { title: 'Blog', description: 'SEO-focused long-form posts from NexZen Studio.' };
export const revalidate = 60;

export default async function BlogPage() {
  const items = await listBlogs();
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
      <h1 className="text-4xl font-black md:text-5xl"><span className="text-gradient">Blog</span></h1>
      <p className="mt-3 max-w-2xl text-slate-400">SEO-focused long-form posts.</p>
      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.length === 0 && <EmptyState label="posts" />}
        {items.map((b) => (
          <ContentCard key={b.id} href={`/blog/${b.slug}`} title={b.title} subtitle={b.excerpt ?? undefined} meta="Article" />
        ))}
      </div>
    </section>
  );
}
