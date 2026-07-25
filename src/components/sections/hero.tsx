'use client';

import Link from 'next/link';
import { Play, Sparkles, Send } from 'lucide-react';
import { InstagramIcon, YoutubeIcon, GithubIcon } from '@/components/ui/brand-icons';
import { AdaptiveThree } from '@/components/three/adaptive-three';
import { SOCIALS } from '@/lib/nav';

const ICONS = { instagram: InstagramIcon, youtube: YoutubeIcon, github: GithubIcon, send: Send };

const PREVIEW_CARDS = [
  { title: 'AI Prompt Library', desc: '50+ curated prompts' },
  { title: 'My Games & Apps', desc: '15+ builds to explore' },
  { title: 'APK Store', desc: '25+ verified files' },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pt-12 md:px-8 md:pt-20 xl:pl-24">
      {/* Animated nebula background — CSS only, GPU-composited, safe on mobile */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="nebula-1 absolute -left-1/4 top-0 h-[600px] w-[600px] rounded-full bg-neon-purple/10 blur-[120px]" />
        <div className="nebula-2 absolute -right-1/4 top-1/4 h-[500px] w-[500px] rounded-full bg-neon-blue/10 blur-[100px]" />
        <div className="nebula-3 absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-neon-magenta/[0.08] blur-[80px]" />
      </div>

      {/* Desktop-only vertical social rail */}
      <div className="absolute left-4 top-1/2 hidden -translate-y-1/2 flex-col gap-3 xl:flex">
        {SOCIALS.map((s) => {
          const Icon = ICONS[s.icon];
          return (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="tap-target grid place-items-center rounded-full glass text-slate-300 hover:text-white"
            >
              <Icon size={18} />
            </a>
          );
        })}
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
        {/* Copy — stacks above visual on mobile */}
        <div className="order-1 text-center lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium tracking-wide text-slate-300">
            <Sparkles size={14} className="text-neon-purple" />
            AI • GAMES • APPS • AUTOMATION • RESOURCES
          </span>

          <h1 className="mt-5 text-4xl font-black leading-tight sm:text-5xl md:text-6xl">
            Build. Create.
            <br />
            <span className="text-gradient">Inspire.</span>
          </h1>

          <p className="mx-auto mt-4 max-w-lg text-slate-400 lg:mx-0">
            A digital asset hub for AI prompts, games, APKs, tools and resources —
            crafted for creators. Explore, copy, and share in one tap.
          </p>

          <div className="mt-7 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <Link
              href="/prompts"
              className="tap-target inline-flex items-center justify-center rounded-full bg-neon-gradient px-6 font-semibold text-white glow-hover"
            >
              Explore Now
            </Link>
            <Link
              href="/gallery"
              className="tap-target inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 font-semibold text-white hover:bg-white/10"
            >
              <Play size={16} /> View My Work
            </Link>
          </div>
        </div>

        {/* Visual + floating preview cards */}
        <div className="order-2 flex flex-col items-center gap-6">
          <AdaptiveThree />

          {/* Stacked/swipeable on mobile, floating layout on desktop */}
          <div className="flex w-full snap-x gap-3 overflow-x-auto pb-2 lg:grid lg:grid-cols-3 lg:overflow-visible">
            {PREVIEW_CARDS.map((c) => (
              <div
                key={c.title}
                className="glass min-w-[70%] shrink-0 snap-center rounded-xl p-4 sm:min-w-[45%] lg:min-w-0 lg:animate-float"
              >
                <p className="text-sm font-semibold text-white">{c.title}</p>
                <p className="mt-1 text-xs text-slate-400">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
