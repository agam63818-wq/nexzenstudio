'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Search, Sparkles } from 'lucide-react';
import { NAV_LINKS } from '@/lib/nav';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full glass">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-neon-gradient text-lg font-black text-white">
            N
          </span>
          <span className="text-lg font-bold tracking-tight">NexZen Studio</span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm text-slate-300 transition-colors hover:text-white"
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
            className="tap-target grid place-items-center rounded-full text-slate-300 hover:text-white"
          >
            <Search size={20} />
          </Link>
          <Link
            href="/admin/login"
            className="hidden rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10 sm:block"
          >
            Admin Login
          </Link>
          <button
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="tap-target grid place-items-center rounded-full text-white lg:hidden"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile slide-out menu */}
      <div
        className={cn(
          'overflow-hidden border-t border-white/10 transition-[max-height] duration-300 lg:hidden',
          open ? 'max-h-[28rem]' : 'max-h-0'
        )}
      >
        <ul className="flex flex-col gap-1 px-4 py-3">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className="tap-target flex items-center rounded-lg px-3 text-slate-200 hover:bg-white/5"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/admin/login"
              onClick={() => setOpen(false)}
              className="tap-target mt-2 flex items-center gap-2 rounded-lg border border-white/20 px-3 font-medium text-white"
            >
              <Sparkles size={16} /> Admin Login
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
