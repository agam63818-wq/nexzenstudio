import type { Metadata } from 'next';
import { listPrompts } from '@/lib/queries';
import { ContentCard, EmptyState } from '@/components/ui/content-card';
import { SectionReveal } from '@/components/ui/section-reveal';

export const metadata: Metadata = {
  title: 'AI Prompt Library',
  description: 'Categorized AI prompts for ChatGPT, Claude, Gemini, Midjourney, Flux and more.',
};

export const revalidate = 60;

export default async function PromptsPage() {
  const prompts = await listPrompts();

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
      <SectionReveal>
        <h1 className="text-4xl font-black md:text-5xl">
          <span className="text-gradient">AI Prompt Library</span>
        </h1>
        <p className="mt-3 max-w-2xl text-slate-400">
          Categorized by tool — ChatGPT, Claude, Gemini, Qwen, Cursor, Midjourney,
          Flux, Kling, Veo, ElevenLabs, n8n and more.
        </p>
      </SectionReveal>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
