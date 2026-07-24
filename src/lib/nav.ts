export interface NavLink {
  label: string;
  href: string;
}

export const NAV_LINKS: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Prompts', href: '/prompts' },
  { label: 'APKs', href: '/apks' },
  { label: 'Games', href: '/games' },
  { label: 'Tools', href: '/tools' },
  { label: 'Resources', href: '/resources' },
  { label: 'Blog', href: '/blog' },
  { label: 'Gallery', href: '/gallery' },
];

export const SOCIALS = [
  { label: 'Instagram', href: 'https://instagram.com/agam.nexgen.ai', icon: 'instagram' },
  { label: 'YouTube', href: '#', icon: 'youtube' },
  { label: 'GitHub', href: '#', icon: 'github' },
  { label: 'Telegram', href: '#', icon: 'send' },
] as const;
