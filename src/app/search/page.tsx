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
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-4xl font-black md:text-5xl">
          <span className="text-gradient">Search</span>
        </h1>
        <p className="mt-2 text-slate-400">Find prompts, games, APKs, tools, resources and blog posts.</p>
      </div>

      {/* Search form */}
      <form
        action="/search"
        method="get"
        className="group flex items-center gap-3 rounded-2xl glass px-5 py-3.5 transition-all duration-300 focus-within:border-neon-purple/40 focus-within:shadow-neon-sm"
      >
        <Search size={20} className="shrink-0 text-slate-400 transition-colors duration-200 group-focus-within:text-neon-purple" />
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search prompts, games, APKs, tools…"
          className="w-full bg-transparent text-white outline-none placeholder:text-slate-500"
          autoFocus
        />
      </form>

      {/* Results count */}
      {q && (
        <p className="mt-6 text-sm text-slate-400">
          <span className="font-semibold text-white">{hits.length}</span>{' '}
          result{hits.length === 1 ? '' : 's'} for{' '}
          <span className="font-semibold text-neon-purple">&ldquo;{q}&rdquo;</span>
        </p>
      )}

      {/* Results grid */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {hits.map((h) => (
          <ContentCard key={h.href} href={h.href} title={h.title} meta={h.type} />
        ))}
      </div>

      {/* Empty state */}
      {q && hits.length === 0 && (
        <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-12 text-center">
          <div className="mb-3 text-3xl">🔍</div>
          <p className="text-sm font-medium text-slate-400">No results found for &ldquo;{q}&rdquo;</p>
          <p className="mt-1 text-xs text-slate-600">Try a different search term.</p>
        </div>
      )}
    </section>
  );
}
