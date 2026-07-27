import type { Metadata } from 'next';
import { listApks, listCategories } from '@/lib/queries';
import { ContentCard, EmptyState } from '@/components/ui/content-card';
import { CategoryFilter } from '@/components/ui/category-filter';
import { PageHeader } from '@/components/ui/page-header';

export const metadata: Metadata = { title: 'APK Store', description: 'Verified APK downloads with screenshots, versions and changelogs.' };
export const revalidate = 60;

interface Props {
  searchParams?: Promise<{ category?: string }>;
}

export default async function ApksPage({ searchParams }: Props) {
  const params = await searchParams;
  const selectedCategory = params?.category;
  const [items, categories] = await Promise.all([
    listApks(selectedCategory),
    listCategories('apks'),
  ]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
      <PageHeader
        title="APK Store"
        gradientTitle="APK Store"
        description="Icon, screenshots, description, version, size, what's new, virus-scan badge and old versions."
        badge="25+ Verified Files"
      />
      <CategoryFilter basePath="/apks" categories={categories} selectedCategory={selectedCategory} />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.length === 0 && <EmptyState label="APKs" />}
        {items.map((a) => (
          <ContentCard key={a.id} href={`/apks/${a.slug}`} title={a.name} subtitle={a.description ?? undefined} meta={a.version ? `v${a.version}` : 'APK'} />
        ))}
      </div>
    </section>
  );
}
