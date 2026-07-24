import type { Metadata } from 'next';
import { listVideoPrompts } from '@/lib/queries';
import { ContentCard, EmptyState } from '@/components/ui/content-card';

export const metadata: Metadata = { title: 'Video Prompts', description: 'Video prompts for Seedance, Veo, Runway, Kling and Hailuo.' };
export const revalidate = 60;

export default async function VideosPage() {
  const items = await listVideoPrompts();
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
      <h1 className="text-4xl font-black md:text-5xl"><span className="text-gradient">Video Prompt Library</span></h1>
      <p className="mt-3 max-w-2xl text-slate-400">Prompt, scene, camera motion, voice, music, duration and style.</p>
      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.length === 0 && <EmptyState label="video prompts" />}
        {items.map((v) => (
          <ContentCard key={v.id} href={`/videos/${v.slug}`} title={v.title} subtitle={v.scene ?? undefined} meta={v.style ?? 'Video'} />
        ))}
      </div>
    </section>
  );
}
