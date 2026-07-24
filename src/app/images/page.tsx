import type { Metadata } from 'next';
import { listImagePrompts } from '@/lib/queries';
import { ContentCard, EmptyState } from '@/components/ui/content-card';

export const metadata: Metadata = { title: 'Image Prompts', description: 'Image generation prompts with model, style, aspect ratio and more.' };
export const revalidate = 60;

export default async function ImagesPage() {
  const items = await listImagePrompts();
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
      <h1 className="text-4xl font-black md:text-5xl"><span className="text-gradient">Image Prompt Library</span></h1>
      <p className="mt-3 max-w-2xl text-slate-400">Preview, prompt, negative prompt, model, style, aspect ratio, camera and lighting.</p>
      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.length === 0 && <EmptyState label="image prompts" />}
        {items.map((i) => (
          <ContentCard key={i.id} href={`/images/${i.slug}`} title={i.title} subtitle={i.model ?? undefined} meta={i.style ?? 'Image'} />
        ))}
      </div>
    </section>
  );
}
