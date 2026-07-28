import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Sparkles,
  Image as ImageIcon,
  Video,
  Gamepad2,
  Package,
  BookOpen,
  Download,
  Wrench,
  GalleryHorizontalEnd,
  ArrowRight,
  AlertTriangle,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = { title: 'Dashboard', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

interface SectionStat {
  label: string;
  href: string;
  table: string;
  Icon: typeof Sparkles;
  total: number;
  published: number;
}

const SECTIONS: Omit<SectionStat, 'total' | 'published'>[] = [
  { label: 'Prompts', href: '/admin/prompts', table: 'prompts', Icon: Sparkles },
  { label: 'Image Prompts', href: '/admin/images', table: 'image_prompts', Icon: ImageIcon },
  { label: 'Video Prompts', href: '/admin/videos', table: 'video_prompts', Icon: Video },
  { label: 'Games', href: '/admin/games', table: 'games', Icon: Gamepad2 },
  { label: 'APKs', href: '/admin/apks', table: 'apks', Icon: Package },
  { label: 'Blogs', href: '/admin/blogs', table: 'blogs', Icon: BookOpen },
  { label: 'Resources', href: '/admin/resources', table: 'resources', Icon: Download },
  { label: 'Tools', href: '/admin/tools', table: 'tools', Icon: Wrench },
  { label: 'Gallery', href: '/admin/gallery', table: 'gallery', Icon: GalleryHorizontalEnd },
];

export default async function AdminDashboardPage() {
  const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);

  let stats: SectionStat[] = SECTIONS.map((s) => ({ ...s, total: 0, published: 0 }));
  let engagement = { views: 0, downloads: 0, likes: 0, comments: 0 };

  if (configured) {
    const supabase = await createClient();

    const countOf = async (table: string, published?: boolean) => {
      let q = supabase.from(table).select('*', { count: 'exact', head: true });
      if (published) q = q.eq('status', 'published');
      const { count } = await q;
      return count ?? 0;
    };

    stats = await Promise.all(
      SECTIONS.map(async (s) => ({
        ...s,
        total: await countOf(s.table),
        published: await countOf(s.table, true),
      }))
    );

    const [views, downloads, likes, comments] = await Promise.all([
      countOf('views'),
      countOf('downloads'),
      countOf('likes'),
      countOf('comments'),
    ]);
    engagement = { views, downloads, likes, comments };
  }

  const totalItems = stats.reduce((a, s) => a + s.total, 0);
  const totalPublished = stats.reduce((a, s) => a + s.published, 0);
  const totalDrafts = totalItems - totalPublished;

  return (
    <section className="pb-16">
      <h1 className="font-display text-2xl font-bold text-white">Overview</h1>
      <p className="mt-1.5 text-sm text-slate-400">
        Everything across the studio at a glance. Click any card to jump straight into that section.
      </p>

      {!configured && (
        <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">
          <AlertTriangle size={16} className="mt-0.5 shrink-0" />
          <p>Supabase isn&apos;t configured, so all counts read zero. Add your Supabase environment variables to load live data.</p>
        </div>
      )}

      {/* Headline numbers */}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: 'Total items', value: totalItems, tone: 'text-gradient' },
          { label: 'Published', value: totalPublished, tone: 'text-emerald-300' },
          { label: 'Drafts', value: totalDrafts, tone: 'text-amber-300' },
          { label: 'Page views', value: engagement.views, tone: 'text-neon-blue' },
        ].map((s) => (
          <div key={s.label} className="glass rounded-xl p-5">
            <p className={`font-display text-3xl font-black ${s.tone}`}>{s.value}</p>
            <p className="mt-1 text-xs uppercase tracking-wider text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Per-section breakdown */}
      <h2 className="mt-10 font-display text-lg font-semibold text-white">Content sections</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map(({ label, href, Icon, total, published }) => (
          <Link
            key={href}
            href={href}
            className="group glass rounded-xl p-5 transition hover:-translate-y-0.5 hover:border-white/20"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-neon-purple">
                  <Icon size={16} />
                </span>
                <span className="font-medium text-white">{label}</span>
              </div>
              <ArrowRight size={15} className="text-slate-600 transition group-hover:translate-x-0.5 group-hover:text-white" />
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="font-display text-2xl font-bold text-white">{total}</span>
              <span className="text-xs text-slate-500">total</span>
            </div>
            <div className="mt-2 flex gap-3 text-[11px]">
              <span className="text-emerald-300">{published} published</span>
              <span className="text-amber-300">{total - published} draft</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Engagement */}
      <h2 className="mt-10 font-display text-lg font-semibold text-white">Engagement</h2>
      <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: 'Views', value: engagement.views },
          { label: 'Downloads', value: engagement.downloads },
          { label: 'Likes', value: engagement.likes },
          { label: 'Comments', value: engagement.comments },
        ].map((s) => (
          <div key={s.label} className="glass rounded-xl p-5">
            <p className="font-display text-2xl font-bold text-white">{s.value}</p>
            <p className="mt-1 text-xs uppercase tracking-wider text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
