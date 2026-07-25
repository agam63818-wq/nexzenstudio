'use client';

import Link from 'next/link';
import { Play, Sparkles, Send, ArrowRight, Zap, Brain, Gamepad2 } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { InstagramIcon, YoutubeIcon, GithubIcon } from '@/components/ui/brand-icons';
import { AdaptiveThree } from '@/components/three/adaptive-three';
import { SOCIALS } from '@/lib/nav';

const ICONS = { instagram: InstagramIcon, youtube: YoutubeIcon, github: GithubIcon, send: Send };

const PREVIEW_CARDS = [
  { title: 'AI Prompt Library', desc: '50+ curated prompts', icon: Brain, color: 'from-neon-purple/20 to-neon-blue/10', border: 'border-neon-purple/30' },
  { title: 'Games & Apps', desc: '15+ builds to explore', icon: Gamepad2, color: 'from-neon-blue/20 to-neon-cyan/10', border: 'border-neon-blue/30' },
  { title: 'APK Store', desc: '25+ verified files', icon: Zap, color: 'from-neon-magenta/20 to-neon-purple/10', border: 'border-neon-magenta/30' },
];

const BADGE_ITEMS = ['AI Prompts', 'Games', 'APKs', 'Tools', 'Resources'];

export function Hero() {
  const reduce = useReducedMotion();

  const fadeUp = (delay = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 30 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
        };

  return (
    <section className="relative min-h-[90vh] overflow-hidden px-4 pt-10 pb-16 md:px-8 md:pt-16 xl:pl-24 flex items-center">

      {/* ── Background layers ─────────────────────────────────────────── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Grid */}
        <div className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: 'linear-gradient(rgba(155,109,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(155,109,255,0.06) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        {/* Nebula blobs */}
        <div className="nebula-1 absolute -left-1/4 -top-1/4 h-[700px] w-[700px] rounded-full bg-neon-purple/[0.12] blur-[130px]" />
        <div className="nebula-2 absolute -right-1/4 top-1/3 h-[600px] w-[600px] rounded-full bg-neon-blue/[0.10] blur-[110px]" />
        <div className="nebula-3 absolute bottom-0 left-1/3 h-[500px] w-[500px] rounded-full bg-neon-magenta/[0.08] blur-[90px]" />
        {/* Radial vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(155,109,255,0.15),transparent)]" />
      </div>

      {/* ── Desktop vertical social rail ──────────────────────────────── */}
      <motion.div
        className="absolute left-4 top-1/2 hidden -translate-y-1/2 flex-col gap-3 xl:flex"
        {...(reduce ? {} : { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.6, delay: 0.8 } })}
      >
        {SOCIALS.map((s, i) => {
          const Icon = ICONS[s.icon];
          return (
            <motion.a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              whileHover={reduce ? {} : { scale: 1.15, y: -2 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              style={{ animationDelay: `${i * 100}ms` }}
              className="tap-target grid place-items-center rounded-full glass text-slate-400 transition-colors duration-200 hover:text-white"
            >
              <Icon size={17} />
            </motion.a>
          );
        })}
        {/* Vertical line */}
        <div className="mx-auto mt-2 h-16 w-px bg-gradient-to-b from-white/20 to-transparent" />
      </motion.div>

      {/* ── Main grid ─────────────────────────────────────────────────── */}
      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-2">

        {/* Copy */}
        <div className="order-1 text-center lg:text-left">

          {/* Pill badge */}
          <motion.div {...fadeUp(0.1)}>
            <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-semibold tracking-widest text-slate-300 uppercase">
              <Sparkles size={13} className="text-neon-purple animate-pulse-glow" />
              {BADGE_ITEMS.join(' • ')}
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="mt-6 font-display text-5xl font-black leading-[1.08] tracking-tight sm:text-6xl md:text-7xl"
            {...fadeUp(0.2)}
          >
            Build.{' '}
            <span className="relative inline-block">
              Create.
              {/* Underline glow */}
              <span className="absolute -bottom-1 left-0 h-[3px] w-full rounded-full bg-neon-gradient opacity-70" />
            </span>
            <br />
            <span className="shimmer-text">Inspire.</span>
          </motion.h1>

          {/* Sub-copy */}
          <motion.p
            className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-slate-400 lg:mx-0"
            {...fadeUp(0.3)}
          >
            A premium digital asset hub for AI prompts, games, APKs, tools and
            resources — crafted for creators. Explore, copy, and share in one tap.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center lg:justify-start"
            {...fadeUp(0.4)}
          >
            <Link
              href="/prompts"
              className="group tap-target relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-neon-gradient px-7 py-3 font-semibold text-white shadow-neon-md transition-all duration-300 hover:shadow-neon-lg hover:scale-[1.03]"
            >
              {/* Shine sweep */}
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
              <Sparkles size={16} />
              Explore Now
              <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/gallery"
              className="tap-target inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/[0.05] px-7 py-3 font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/40 hover:bg-white/10"
            >
              <Play size={15} className="text-neon-blue" />
              View My Work
            </Link>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 lg:justify-start"
            {...fadeUp(0.5)}
          >
            {[['10K+', 'Downloads'], ['5K+', 'Visitors'], ['50+', 'AI Prompts']].map(([val, lbl]) => (
              <div key={lbl} className="flex items-baseline gap-1.5">
                <span className="font-display text-xl font-black text-gradient">{val}</span>
                <span className="text-xs text-slate-500">{lbl}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Visual */}
        <motion.div
          className="order-2 flex flex-col items-center gap-6"
          {...(reduce ? {} : { initial: { opacity: 0, scale: 0.92 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] } })}
        >
          <AdaptiveThree />

          {/* Preview cards */}
          <div className="flex w-full snap-x gap-3 overflow-x-auto pb-2 lg:grid lg:grid-cols-3 lg:overflow-visible">
            {PREVIEW_CARDS.map((c, i) => {
              const Icon = c.icon;
              return (
                <motion.div
                  key={c.title}
                  whileHover={reduce ? {} : { y: -6, scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className={`gradient-border min-w-[70%] shrink-0 snap-center rounded-2xl bg-gradient-to-br ${c.color} p-4 sm:min-w-[45%] lg:min-w-0`}
                  style={{ animationDelay: `${i * 150}ms` }}
                >
                  <div className={`mb-2 inline-flex rounded-lg border ${c.border} bg-white/5 p-1.5`}>
                    <Icon size={14} className="text-white/80" />
                  </div>
                  <p className="text-sm font-semibold text-white">{c.title}</p>
                  <p className="mt-0.5 text-xs text-slate-400">{c.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* ── Scroll indicator ──────────────────────────────────────────── */}
      <motion.div
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 md:flex"
        {...(reduce ? {} : { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 1.2, duration: 0.6 } })}
      >
        <span className="text-[10px] uppercase tracking-widest text-slate-500">Scroll</span>
        <div className="h-8 w-px overflow-hidden rounded-full bg-white/10">
          <div className="h-4 w-full animate-[slide-up_1.5s_ease-in-out_infinite] bg-gradient-to-b from-neon-purple to-transparent" />
        </div>
      </motion.div>
    </section>
  );
}
