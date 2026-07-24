import type { Metadata } from 'next';
import { listResources } from '@/lib/queries';
import { ContentCard, EmptyState } from '@/components/ui/content-card';

export const metadata: Metadata = { title: 'Resources', description: 'Downloadable templates, presets, icons, fonts, Lottie and wallpapers.' };
export const revalidate = 60;

export default async function ResourcesPage() {
  const items = await listResources();
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
      <h1 className="text-4xl font-black md:text-5xl"><span className="text-gradient">Resources</span></h1>
      <p className="mt-3 max-w-2xl text-slate-400">ZIP / PDF / JSON / TXT / Markdown / presets / templates / icons / fonts / Lottie / wallpapers.</p>
      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.length === 0 && <EmptyState label="resources" />}
        {items.map((r) => (
          <ContentCard key={r.id} href={r.file_url ?? '#'} title={r.title} subtitle={r.description ?? undefined} meta={r.file_type ?? 'File'} />
        ))}
      </div>
    </section>
  );
}
