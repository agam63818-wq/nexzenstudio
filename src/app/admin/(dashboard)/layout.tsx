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
} from 'lucide-react';
import { signOut } from '@/app/admin/actions';

const ITEMS = [
  { href: '/admin', label: 'Dashboard', Icon: LayoutDashboard },
  { href: '/admin/prompts', label: 'Prompts', Icon: Sparkles },
  { href: '/admin/images', label: 'Image Prompts', Icon: ImageIcon },
  { href: '/admin/videos', label: 'Video Prompts', Icon: Video },
  { href: '/admin/games', label: 'Games', Icon: Gamepad2 },
  { href: '/admin/apks', label: 'APK', Icon: Package },
  { href: '/admin/blogs', label: 'Blogs', Icon: BookOpen },
  { href: '/admin/categories', label: 'Categories', Icon: FolderTree },
  { href: '/admin/tags', label: 'Tags', Icon: Tags },
  { href: '/admin/comments', label: 'Comments', Icon: MessageSquare },
  { href: '/admin/analytics', label: 'Analytics', Icon: BarChart3 },
  { href: '/admin/users', label: 'Users', Icon: Users },
  { href: '/admin/storage', label: 'Storage', Icon: HardDrive },
  { href: '/admin/settings', label: 'Settings', Icon: Settings },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 md:flex-row md:px-8">
      {/* Sidebar — horizontal scroll strip on mobile, fixed column on desktop */}
      <aside className="md:w-56 md:shrink-0">
        <nav className="flex gap-1 overflow-x-auto md:flex-col">
          {ITEMS.map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              className="tap-target flex shrink-0 items-center gap-2 rounded-lg px-3 text-sm text-slate-300 hover:bg-white/5 hover:text-white"
            >
              <Icon size={16} /> {label}
            </Link>
          ))}
          <form action={signOut}>
            <button className="tap-target flex w-full items-center gap-2 rounded-lg px-3 text-sm text-red-300 hover:bg-red-500/10">
              <LogOut size={16} /> Sign out
            </button>
          </form>
        </nav>
      </aside>

      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
