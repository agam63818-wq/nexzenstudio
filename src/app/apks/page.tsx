import type { Metadata } from 'next';
import { listApks } from '@/lib/queries';
import { ContentCard, EmptyState } from '@/components/ui/content-card';
import { PageHeader } from '@/components/ui/page-header';

export const metadata: Metadata = { title: 'APK Store', description: 'Verified APK downloads with screenshots, versions and changelogs.' };
export const revalidate = 60;

export default async function ApksPage() {
  const items = await listApks();
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
      <PageHeader
        title="APK Store"
        gradientTitle="APK Store"
        description="Icon, screenshots, description, version, size, what's new, virus-scan badge and old versions."
        badge="25+ Verified Files"
      />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.length === 0 && <EmptyState label="APKs" />}
        {items.map((a) => (
          <ContentCard key={a.id} href={`/apks/${a.slug}`} title={a.name} subtitle={a.description ?? undefined} meta={a.version ? `v${a.version}` : 'APK'} />
        ))}
      </div>
    </section>
  );
}
