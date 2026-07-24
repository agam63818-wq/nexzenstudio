import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = { title: 'Dashboard', robots: { index: false, follow: false } };

async function countRows(table: string): Promise<number> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return 0;
  const supabase = await createClient();
  const { count } = await supabase.from(table).select('*', { count: 'exact', head: true });
  return count ?? 0;
}

export default async function AdminDashboardPage() {
  const [prompts, images, apks, games, blogs, downloads, views] = await Promise.all([
    countRows('prompts'),
    countRows('image_prompts'),
    countRows('apks'),
    countRows('games'),
    countRows('blogs'),
    countRows('downloads'),
    countRows('views'),
  ]);

  const stats = [
    { label: 'Prompts', value: prompts },
    { label: 'Image Prompts', value: images },
    { label: 'APKs', value: apks },
    { label: 'Games', value: games },
    { label: 'Blogs', value: blogs },
    { label: 'Downloads', value: downloads },
    { label: 'Views', value: views },
  ];

  return (
    <section>
      <h1 className="text-2xl font-bold text-white">Overview</h1>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="glass rounded-xl p-5">
            <p className="text-3xl font-black text-gradient">{s.value}</p>
            <p className="mt-1 text-sm text-slate-400">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
