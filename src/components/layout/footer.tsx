import Link from 'next/link';
import { Send, Zap, ArrowUpRight } from 'lucide-react';
import { InstagramIcon, YoutubeIcon, GithubIcon } from '@/components/ui/brand-icons';
import { SOCIALS, NAV_LINKS } from '@/lib/nav';

const ICONS = { instagram: InstagramIcon, youtube: YoutubeIcon, github: GithubIcon, send: Send };

export function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden">
      {/* Top gradient divider */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-neon-purple/40 to-transparent" />

      {/* Ambient glow */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -bottom-1/2 left-1/2 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-neon-purple/[0.06] blur-[100px]" />
      </div>

      <div className="relative bg-space-900/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-8">

          {/* Top row: brand + nav links */}
          <div className="grid gap-10 md:grid-cols-[1fr_auto]">

            {/* Brand */}
            <div>
              <Link href="/" className="group inline-flex items-center gap-2.5">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-neon-gradient text-white shadow-neon-sm transition-all duration-300 group-hover:shadow-neon-md">
                  <Zap size={18} />
                </span>
                <span className="font-display text-xl font-bold text-white">
                  NexZen<span className="text-gradient"> Studio</span>
                </span>
              </Link>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-500">
                A premium digital asset hub for AI prompts, games, APKs, tools and resources — crafted for creators.
              </p>

              {/* Social icons */}
              <div className="mt-5 flex gap-2">
                {SOCIALS.map((s) => {
                  const Icon = ICONS[s.icon];
                  return (
                    <a
                      key={s.label}
                      href={s.href}
                      aria-label={s.label}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="tap-target grid place-items-center rounded-full glass text-slate-400 transition-all duration-200 hover:scale-110 hover:text-white hover:shadow-neon-sm"
                    >
                      <Icon size={17} />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Nav links */}
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500">Explore</p>
              <ul className="grid grid-cols-2 gap-x-8 gap-y-2">
                {NAV_LINKS.filter(l => l.href !== '/').map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-1 text-sm text-slate-400 transition-colors duration-200 hover:text-white"
                    >
                      {link.label}
                      <ArrowUpRight size={11} className="opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="my-10 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

          {/* Bottom row */}
          <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
            <p className="font-display text-base font-semibold text-slate-300 md:text-lg">
              Powered by <span className="text-gradient">Passion</span>. Driven by{' '}
              <span className="text-gradient">AI</span>. Built for the{' '}
              <span className="text-gradient">Future</span>.
            </p>
            <p className="text-xs text-slate-600">
              © {new Date().getFullYear()} NexZen Studio. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
