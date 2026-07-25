import type { Metadata } from 'next';
import { listResources } from '@/lib/queries';
import { ContentCard, EmptyState } from '@/components/ui/content-card';
import { PageHeader } from '@/components/ui/page-header';

export const metadata: Metadata = { title: 'Resources', description: 'Downloadable templates, presets, icons, fonts, Lottie and wallpapers.' };
export const revalidate = 60;

export default async function ResourcesPage() {
  const items = await listResources();
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
      <PageHeader
        title="Resources"
        gradientTitle="Resources"
        description="ZIP / PDF / JSON / TXT / Markdown / presets / templates / icons / fonts / Lottie / wallpapers."
        badge="100+ Files"
      />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.length === 0 && <EmptyState label="resources" />}
        {items.map((r) => (
          <ContentCard key={r.id} href={r.file_url ?? '#'} title={r.title} subtitle={r.description ?? undefined} meta={r.file_type ?? 'File'} />
        ))}
      </div>
    </section>
  );
}
