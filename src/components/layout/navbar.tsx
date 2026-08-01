'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Search, Sparkles, Zap } from 'lucide-react';
import { NAV_LINKS } from '@/lib/nav';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-500',
        scrolled
          ? 'glass border-b border-white/[0.08] shadow-[0_4px_30px_rgba(0,0,0,0.4)]'
          : 'bg-transparent border-b border-transparent'
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">

        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-xl bg-neon-gradient text-lg font-black text-white shadow-neon-sm transition-all duration-300 group-hover:shadow-neon-md group-hover:scale-105">
            <Zap size={18} className="relative z-10" />
            {/* Shine sweep */}
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-white">
            NexZen<span className="text-gradient"> Studio</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="animated-underline relative rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition-colors duration-200 hover:text-white"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <Link
            href="/search"
            aria-label="Search"
            className="tap-target grid place-items-center rounded-full p-2 text-slate-300 transition-all duration-200 hover:bg-white/10 hover:text-white"
          >
            <Search size={18} />
          </Link>
          <Link
            href="/admin/login"
            className="hidden items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-all duration-300 hover:border-neon-purple/50 hover:bg-white/10 hover:shadow-neon-sm sm:flex"
          >
            <Sparkles size={13} className="text-neon-purple" />
            Admin
          </Link>
          <button
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="tap-target grid place-items-center rounded-full p-2 text-white transition-all duration-200 hover:bg-white/10 lg:hidden"
          >
            <span className={cn('transition-all duration-300', open ? 'rotate-90 opacity-0 absolute' : 'rotate-0 opacity-100')}>
              <Menu size={22} />
            </span>
            <span className={cn('transition-all duration-300', open ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0 absolute')}>
              <X size={22} />
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile slide-out menu */}
      <div
        className={cn(
          'overflow-hidden transition-[max-height,opacity] duration-400 ease-in-out lg:hidden',
          open ? 'max-h-[32rem] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="border-t border-white/[0.08] px-4 py-4">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link, i) => (
              <li
                key={link.href}
                style={{ animationDelay: `${i * 40}ms` }}
                className={cn(open ? 'animate-slide-up' : '')}
              >
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="tap-target flex items-center rounded-xl px-4 text-slate-200 transition-all duration-200 hover:bg-white/[0.07] hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-3 border-t border-white/[0.08] pt-3">
            <Link
              href="/admin/login"
              onClick={() => setOpen(false)}
              className="tap-target flex items-center gap-2 rounded-xl border border-neon-purple/30 bg-neon-purple/10 px-4 font-medium text-white transition-all duration-200 hover:bg-neon-purple/20"
            >
              <Sparkles size={15} className="text-neon-purple" />
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
