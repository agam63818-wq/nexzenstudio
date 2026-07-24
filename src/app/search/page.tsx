import type { Metadata } from 'next';
import { Search } from 'lucide-react';
import { search } from '@/lib/queries';
import { ContentCard } from '@/components/ui/content-card';

export const metadata: Metadata = { title: 'Search', description: 'Search across prompts, games, APKs, images, videos, tools and blogs.' };

interface Props { searchParams: Promise<{ q?: string }>; }

export default async function SearchPage({ searchParams }: Props) {
  const { q = '' } = await searchParams;
  const hits = q ? await search(q) : [];

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 md:px-8">
      <h1 className="text-4xl font-black"><span className="text-gradient">Search</span></h1>

      <form action="/search" method="get" className="mt-6 flex items-center gap-3 rounded-full glass px-5 py-3">
        <Search size={20} className="text-slate-400" />
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search prompts, games, APKs, tools…"
          className="w-full bg-transparent text-white outline-none placeholder:text-slate-500"
        />
      </form>

      {q && (
        <p className="mt-6 text-sm text-slate-400">
          {hits.length} result{hits.length === 1 ? '' : 's'} for &ldquo;{q}&rdquo;
        </p>
      )}

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {hits.map((h) => (
          <ContentCard key={h.href} href={h.href} title={h.title} meta={h.type} />
        ))}
      </div>
    </section>
  );
}
