import type { Metadata } from 'next';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { EmptyState } from '@/components/ui/content-card';

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
      <h1 className="text-4xl font-black md:text-5xl"><span className="text-gradient">Gallery</span></h1>
      <p className="mt-3 max-w-2xl text-slate-400">Images, videos, designs, wallpapers and logos.</p>

      {items.length === 0 ? (
        <div className="mt-10 grid grid-cols-1"><EmptyState label="gallery items" /></div>
      ) : (
        // Masonry via CSS columns: 1 → 2 → 3 → 4 across breakpoints.
        <div className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
          {items.map((it) => (
            <a
              key={it.id}
              href={it.media_url}
              target="_blank"
              rel="noopener noreferrer"
              className="group mb-4 block break-inside-avoid overflow-hidden rounded-xl glass"
            >
              <Image
                src={it.media_url}
                alt={it.title}
                width={600}
                height={800}
                className="h-auto w-full transition-transform duration-300 group-hover:scale-105"
              />
              <p className="p-3 text-sm text-slate-300">{it.title}</p>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
