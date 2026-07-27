import type { Metadata } from 'next';
import { listPrompts, listCategories } from '@/lib/queries';
import { ContentCard, EmptyState } from '@/components/ui/content-card';
import { PageHeader } from '@/components/ui/page-header';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'AI Prompt Library',
  description: 'Categorized AI prompts for ChatGPT, Claude, Gemini, Midjourney, Flux and more.',
};

export const revalidate = 60;

export default async function PromptsPage(props: { searchParams: Promise<{ category?: string }> }) {
  const searchParams = await props.searchParams;
  const categoryId = searchParams.category || undefined;
  
  const [prompts, categories] = await Promise.all([
    listPrompts(undefined, categoryId),
    listCategories('prompt')
  ]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
      <PageHeader
        title="AI Prompt Library"
        gradientTitle="AI Prompt Library"
        description="Categorized by tool — ChatGPT, Claude, Gemini, Qwen, Cursor, Midjourney, Flux, Kling, Veo, ElevenLabs, n8n and more."
        badge="50+ Prompts"
      />

      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          <Link
            href="/prompts"
            className={`tap-target rounded-full border px-4 py-2 text-sm ${!categoryId ? 'bg-white/10 border-white/30 text-white' : 'border-white/15 text-slate-400 hover:bg-white/5'}`}
          >
            All
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/prompts?category=${cat.id}`}
              className={`tap-target rounded-full border px-4 py-2 text-sm ${categoryId === cat.id ? 'bg-white/10 border-white/30 text-white' : 'border-white/15 text-slate-400 hover:bg-white/5'}`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {prompts.length === 0 && <EmptyState label="prompts" />}
        {prompts.map((p) => (
          <ContentCard
            key={p.id}
            href={`/prompts/${p.tool}/${p.slug}`}
            title={p.title}
            subtitle={p.description ?? undefined}
            meta={p.tool}
          />
        ))}
      </div>
    </section>
  );
}
