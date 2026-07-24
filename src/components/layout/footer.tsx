import Link from 'next/link';
import { Instagram, Youtube, Github, Send } from 'lucide-react';
import { SOCIALS } from '@/lib/nav';

const ICONS = { instagram: Instagram, youtube: Youtube, github: Github, send: Send };

export function Footer() {
  return (
    <footer className="mt-24 border-t border-white/10 bg-space-900">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <p className="text-center text-xl font-bold md:text-2xl">
          Powered by <span className="text-gradient">Passion</span>. Driven by{' '}
          <span className="text-gradient">AI</span>. Built for the{' '}
          <span className="text-gradient">Future</span>.
        </p>

        <div className="mt-6 flex justify-center gap-3">
          {SOCIALS.map((s) => {
            const Icon = ICONS[s.icon];
            return (
              <Link
                key={s.label}
                href={s.href}
                aria-label={s.label}
                target="_blank"
                rel="noopener noreferrer"
                className="tap-target grid place-items-center rounded-full glass text-slate-300 hover:text-white"
              >
                <Icon size={20} />
              </Link>
            );
          })}
        </div>

        <p className="mt-8 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} NexZen Studio. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
