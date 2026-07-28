import type { ReactNode } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Sparkles,
  Image as ImageIcon,
  Video,
  Gamepad2,
  Package,
  BookOpen,
  FolderTree,
  Tags,
  MessageSquare,
  BarChart3,
  Users,
  HardDrive,
  Settings,
  LogOut,
  Wrench,
  Download,
  GalleryHorizontalEnd,
  ExternalLink,
} from 'lucide-react';
import { signOut } from '@/app/admin/actions';

interface NavItem {
  href: string;
  label: string;
  Icon: typeof LayoutDashboard;
}

const GROUPS: { heading: string; items: NavItem[] }[] = [
  {
    heading: 'Overview',
    items: [{ href: '/admin', label: 'Dashboard', Icon: LayoutDashboard }],
  },
  {
    heading: 'Content',
    items: [
      { href: '/admin/prompts', label: 'Prompts', Icon: Sparkles },
      { href: '/admin/images', label: 'Image Prompts', Icon: ImageIcon },
      { href: '/admin/videos', label: 'Video Prompts', Icon: Video },
      { href: '/admin/games', label: 'Games', Icon: Gamepad2 },
      { href: '/admin/apks', label: 'APK', Icon: Package },
      { href: '/admin/blogs', label: 'Blogs', Icon: BookOpen },
      { href: '/admin/resources', label: 'Resources', Icon: Download },
      { href: '/admin/tools', label: 'Tools', Icon: Wrench },
      { href: '/admin/gallery', label: 'Gallery', Icon: GalleryHorizontalEnd },
    ],
  },
  {
    heading: 'Taxonomy',
    items: [
      { href: '/admin/categories', label: 'Categories', Icon: FolderTree },
      { href: '/admin/tags', label: 'Tags', Icon: Tags },
    ],
  },
  {
    heading: 'Community & data',
    items: [
      { href: '/admin/comments', label: 'Comments', Icon: MessageSquare },
      { href: '/admin/analytics', label: 'Analytics', Icon: BarChart3 },
    ],
  },
  {
    heading: 'System',
    items: [
      { href: '/admin/users', label: 'Users', Icon: Users },
      { href: '/admin/storage', label: 'Storage', Icon: HardDrive },
      { href: '/admin/settings', label: 'Settings', Icon: Settings },
    ],
  },
];

const ALL_ITEMS = GROUPS.flatMap((g) => g.items);

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex max-w-[90rem] flex-col gap-6 px-4 py-6 md:flex-row md:gap-8 md:px-8 md:py-8">
      {/* ── Sidebar: horizontal strip on mobile, grouped column on desktop ── */}
      <aside className="md:w-56 md:shrink-0">
        <div className="mb-4 hidden items-center justify-between md:flex">
          <Link href="/admin" className="font-display text-sm font-bold text-gradient">
            NexZen CMS
          </Link>
          <Link
            href="/"
            target="_blank"
            title="View live site"
            className="text-slate-500 transition hover:text-white"
          >
            <ExternalLink size={14} />
          </Link>
        </div>

        {/* Mobile: flat scrolling strip */}
        <nav className="flex gap-1 overflow-x-auto pb-1 md:hidden" aria-label="Admin sections">
          {ALL_ITEMS.map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              className="tap-target flex shrink-0 items-center gap-2 rounded-lg px-3 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
            >
              <Icon size={16} /> {label}
            </Link>
          ))}
        </nav>

        {/* Desktop: grouped sections */}
        <nav className="hidden md:sticky md:top-6 md:block" aria-label="Admin sections">
          {GROUPS.map((group) => (
            <div key={group.heading} className="mb-5">
              <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
                {group.heading}
              </p>
              <div className="flex flex-col gap-0.5">
                {group.items.map(({ href, label, Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
                  >
                    <Icon size={15} className="shrink-0 text-slate-500" /> {label}
                  </Link>
                ))}
              </div>
            </div>
          ))}

          <form action={signOut} className="border-t border-white/10 pt-3">
            <button className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-red-300 transition hover:bg-red-500/10">
              <LogOut size={15} className="shrink-0" /> Sign out
            </button>
          </form>
        </nav>

        {/* Mobile sign out */}
        <form action={signOut} className="mt-2 md:hidden">
          <button className="tap-target flex w-full items-center justify-center gap-2 rounded-lg border border-red-500/20 px-3 text-sm text-red-300 transition hover:bg-red-500/10">
            <LogOut size={15} /> Sign out
          </button>
        </form>
      </aside>

      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
