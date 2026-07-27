import type { Metadata } from 'next';
import { listCategories, listPrompts } from '@/lib/queries';
import { ContentCard, EmptyState } from '@/components/ui/content-card';
import { CategoryFilter } from '@/components/ui/category-filter';
import { PageHeader } from '@/components/ui/page-header';

export const metadata: Metadata = {
  title: 'AI Prompt Library',
  description: 'Categorized AI prompts for ChatGPT, Claude, Gemini, Midjourney, Flux and more.',
};

export const revalidate = 60;

interface Props {
  searchParams?: Promise<{ category?: string }>;
}

export default async function PromptsPage({ searchParams }: Props) {
  const params = await searchParams;
  const selectedCategory = params?.category;
  const [prompts, categories] = await Promise.all([
    listPrompts(undefined, selectedCategory),
    listCategories('prompts'),
  ]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
      <PageHeader
        title="AI Prompt Library"
        gradientTitle="AI Prompt Library"
        description="Categorized by tool — ChatGPT, Claude, Gemini, Qwen, Cursor, Midjourney, Flux, Kling, Veo, ElevenLabs, n8n and more."
        badge="50+ Prompts"
      />

      <CategoryFilter basePath="/prompts" categories={categories} selectedCategory={selectedCategory} />

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
