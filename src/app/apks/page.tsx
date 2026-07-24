import type { Metadata } from 'next';
import { listApks } from '@/lib/queries';
import { ContentCard, EmptyState } from '@/components/ui/content-card';

export const metadata: Metadata = { title: 'APK Store', description: 'Verified APK downloads with screenshots, versions and changelogs.' };
export const revalidate = 60;

export default async function ApksPage() {
  const items = await listApks();
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
      <h1 className="text-4xl font-black md:text-5xl"><span className="text-gradient">APK Store</span></h1>
      <p className="mt-3 max-w-2xl text-slate-400">Icon, screenshots, description, version, size, what&apos;s new, virus-scan badge and old versions.</p>
      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.length === 0 && <EmptyState label="APKs" />}
        {items.map((a) => (
          <ContentCard key={a.id} href={`/apks/${a.slug}`} title={a.name} subtitle={a.description ?? undefined} meta={a.version ? `v${a.version}` : 'APK'} />
        ))}
      </div>
    </section>
  );
}
