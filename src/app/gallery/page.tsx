import type { Metadata } from 'next';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { EmptyState } from '@/components/ui/content-card';
import { PageHeader } from '@/components/ui/page-header';

export const metadata: Metadata = { title: 'Gallery', description: 'Images, videos, designs, wallpapers and logos.' };
export const revalidate = 60;

interface Item { id: string; title: string; media_url: string; media_type: string; }

async function listGallery(): Promise<Item[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];
  const supabase = await createClient();
  const { data } = await supabase.from('gallery').select('*').eq('status', 'published').order('created_at', { ascending: false });
  return (data as Item[]) ?? [];
}

export default async function GalleryPage() {
  const items = await listGallery();
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
      <PageHeader
        title="Gallery"
        gradientTitle="Gallery"
        description="AI-generated images, videos, designs, wallpapers and logos."
        badge="Visual Showcase"
      />

      {items.length === 0 ? (
        <div className="grid grid-cols-1"><EmptyState label="gallery items" /></div>
      ) : (
        /* Masonry via CSS columns: 1 → 2 → 3 → 4 across breakpoints */
        <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 xl:columns-4">
          {items.map((it) => (
            <a
              key={it.id}
              href={it.media_url}
              target="_blank"
              rel="noopener noreferrer"
              className="group mb-5 block break-inside-avoid overflow-hidden rounded-2xl glass transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
            >
              <div className="relative overflow-hidden">
                <Image
                  src={it.media_url}
                  alt={it.title}
                  width={600}
                  height={800}
                  className="h-auto w-full transition-transform duration-500 group-hover:scale-105"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
              <p className="px-4 py-3 text-sm font-medium text-slate-300 transition-colors duration-200 group-hover:text-white">
                {it.title}
              </p>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
