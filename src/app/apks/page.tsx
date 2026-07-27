import type { Metadata } from 'next';
import { listApks, listCategories } from '@/lib/queries';
import { ContentCard, EmptyState } from '@/components/ui/content-card';
import { PageHeader } from '@/components/ui/page-header';
import Link from 'next/link';

export const metadata: Metadata = { title: 'APK Store', description: 'Verified APK downloads with screenshots, versions and changelogs.' };
export const revalidate = 60;

export default async function ApksPage(props: { searchParams: Promise<{ category?: string }> }) {
  const searchParams = await props.searchParams;
  const categoryId = searchParams.category || undefined;
  
  const [items, categories] = await Promise.all([
    listApks(categoryId),
    listCategories('apk')
  ]);
  
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
      <PageHeader
        title="APK Store"
        gradientTitle="APK Store"
        description="Icon, screenshots, description, version, size, what's new, virus-scan badge and old versions."
        badge="25+ Verified Files"
      />
      
      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          <Link
            href="/apks"
            className={`tap-target rounded-full border px-4 py-2 text-sm ${!categoryId ? 'bg-white/10 border-white/30 text-white' : 'border-white/15 text-slate-400 hover:bg-white/5'}`}
          >
            All
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/apks?category=${cat.id}`}
              className={`tap-target rounded-full border px-4 py-2 text-sm ${categoryId === cat.id ? 'bg-white/10 border-white/30 text-white' : 'border-white/15 text-slate-400 hover:bg-white/5'}`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.length === 0 && <EmptyState label="APKs" />}
        {items.map((a) => (
          <ContentCard key={a.id} href={`/apks/${a.slug}`} title={a.name} subtitle={a.description ?? undefined} meta={a.version ? `v${a.version}` : 'APK'} />
        ))}
      </div>
    </section>
  );
}
