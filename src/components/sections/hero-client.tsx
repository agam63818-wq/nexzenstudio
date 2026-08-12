'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRef, useState, useCallback, useEffect } from 'react';
import {
  Play,
  Sparkles,
  Send,
  ArrowRight,
  Brain,
  Gamepad2,
  Download,
  Bot,
  Code2,
  Cpu,
} from 'lucide-react';
import {
  motion,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { InstagramIcon, YoutubeIcon, GithubIcon } from '@/components/ui/brand-icons';
import { AdaptiveThree } from '@/components/three/adaptive-three';
import { SOCIALS } from '@/lib/nav';

const ICONS = { instagram: InstagramIcon, youtube: YoutubeIcon, github: GithubIcon, send: Send };

const BADGE_ITEMS = ['AI', 'Games', 'Apps', 'Automation', 'Resources'];

/* Floating holographic cards that orbit the portrait.
   `depth` drives parallax strength; `pos` places the card around the stage.
   `href` makes the card clickable; `table` shows a live published count.
   `mobile` gates whether the card shows on small screens (fewer + smaller). */
type FloatCard = {
  id: string;
  title: string;
  desc: string;
  icon: typeof Brain;
  accent: string;
  glow: string;
  pos: string;
  depth: number;
  delay: number;
  href?: string;
  table?: string;
  live?: boolean;
  mobile?: boolean;
};

const FLOAT_CARDS: FloatCard[] = [
  {
    id: 'prompts',
    title: 'AI Prompts',
    desc: 'ChatGPT, Claude, Gemini & more',
    icon: Brain,
    accent: 'from-neon-purple/25 to-neon-blue/10',
    glow: 'shadow-[0_0_40px_-8px_rgba(155,109,255,0.6)]',
    pos: 'left-[-6%] top-[12%] sm:left-[-7%] sm:top-[11%]',
    depth: 26,
    delay: 0.9,
    href: '/prompts',
    table: 'prompts',
    live: true,
    mobile: true,
  },
  {
    id: 'neurozen',
    title: 'NeuroZen',
    desc: 'Brain training · Boost your mind',
    icon: Cpu,
    accent: 'from-neon-magenta/25 to-neon-purple/10',
    glow: 'shadow-[0_0_40px_-8px_rgba(224,64,251,0.6)]',
    pos: 'right-[-6%] top-[10%] sm:right-[-9%] sm:top-[9%]',
    depth: 34,
    delay: 1.05,
    live: true,
    mobile: true,
  },
  {
    id: 'apk',
    title: 'APK Store',
    desc: 'Download latest apps & games',
    icon: Download,
    accent: 'from-neon-blue/25 to-neon-cyan/10',
    glow: 'shadow-[0_0_40px_-8px_rgba(79,142,247,0.6)]',
    pos: 'right-[-7%] top-[45%] sm:right-[-10%] sm:top-[43%]',
    depth: 40,
    delay: 1.2,
    href: '/apks',
    table: 'apks',
    mobile: true,
  },
  {
    id: 'games',
    title: 'Games',
    desc: 'Play online games & challenges',
    icon: Gamepad2,
    accent: 'from-neon-purple/25 to-neon-magenta/10',
    glow: 'shadow-[0_0_40px_-8px_rgba(155,109,255,0.6)]',
    pos: 'left-[-7%] top-[44%] sm:left-[-11%] sm:top-[40%]',
    depth: 30,
    delay: 1.35,
    href: '/games',
    table: 'games',
    mobile: true,
  },
  {
    id: 'resources',
    title: 'Resources',
    desc: 'Templates, tools & PDFs',
    icon: Code2,
    accent: 'from-neon-cyan/25 to-neon-blue/10',
    glow: 'shadow-[0_0_40px_-8px_rgba(0,229,255,0.55)]',
    pos: 'left-[-6%] bottom-[4%] sm:left-[-8%] sm:bottom-[3%]',
    depth: 22,
    delay: 1.5,
    href: '/resources',
    table: 'resources',
  },
  {
    id: 'tools',
    title: 'AI Tools',
    desc: 'Top AI tools, reviewed',
    icon: Bot,
    accent: 'from-neon-blue/25 to-neon-purple/10',
    glow: 'shadow-[0_0_40px_-8px_rgba(79,142,247,0.55)]',
    pos: 'right-[-4%] bottom-[6%] sm:right-[-5%] sm:bottom-[5%]',
    depth: 36,
    delay: 1.65,
    href: '/tools',
    table: 'tools',
  },
];

const STATS = [
  { val: '10K+', label: 'Downloads' },
  { val: '5K+', label: 'Visitors' },
  { val: '50+', label: 'AI Prompts' },
  { val: '25+', label: 'Tools' },
];

/* ── Magnetic button wrapper ────────────────────────────────────────────── */
function Magnetic({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 18 });
  const sy = useSpring(y, { stiffness: 260, damping: 18 });

  const onMove = (e: React.MouseEvent) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.35);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.35);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── Single floating glass card with 3D tilt + parallax ─────────────────── */
function HoloCard({
  card,
  mx,
  my,
  reduce,
  count,
}: {
  card: FloatCard;
  mx: MotionValue<number>;
  my: MotionValue<number>;
  reduce: boolean | null;
  count?: number;
}) {
  const Icon = card.icon;
  // Parallax offset relative to pointer (opposite direction, scaled by depth)
  const px = useTransform(mx, (v) => -v * card.depth);
  const py = useTransform(my, (v) => -v * card.depth);
  // Spring-smoothed 3D tilt + subtle counter-rotation so cards face the camera
  const tiltX = useSpring(useTransform(my, (v) => -v * 12), { stiffness: 260, damping: 26 });
  const tiltY = useSpring(useTransform(mx, (v) => v * 12), { stiffness: 260, damping: 26 });
  const tiltZ = useTransform(mx, (v) => v * 5);

  const glareRef = useRef<HTMLDivElement>(null);
  const onGlareMove = useCallback(
    (e: React.MouseEvent) => {
      if (reduce || !glareRef.current) return;
      const r = e.currentTarget.getBoundingClientRect();
      glareRef.current.style.setProperty('--gx', `${((e.clientX - r.left) / r.width) * 100}%`);
      glareRef.current.style.setProperty('--gy', `${((e.clientY - r.top) / r.height) * 100}%`);
    },
    [reduce]
  );

  const cardInner = (
    <motion.div
      onMouseMove={reduce ? undefined : onGlareMove}
      style={reduce ? {} : { rotateX: tiltX, rotateY: tiltY, rotateZ: tiltZ, transformStyle: 'preserve-3d' }}
      whileHover={reduce ? {} : { scale: 1.06 }}
      className={`gradient-border-animated group/card overflow-hidden rounded-2xl bg-gradient-to-br ${card.accent} ${card.glow} p-3 transition-shadow duration-300 hover:shadow-card-hover sm:p-3.5`}
    >
      {/* pointer-following glare */}
      <div className="card-glare" ref={glareRef} />
      {/* static top sheen */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-card-shine opacity-60" />

      {/* LIVE badge */}
      {card.live && (
        <span className="absolute right-2 top-2 z-10 flex items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-500/15 px-1.5 py-0.5 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.9)]" />
          <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-emerald-300">Live</span>
        </span>
      )}

      <div className="relative flex items-center gap-2.5">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-white/15 bg-white/10 sm:h-9 sm:w-9">
          <Icon size={16} className="text-white" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-[13px] font-semibold text-white sm:text-sm">{card.title}</p>
          <p className="truncate text-[10px] leading-tight text-slate-300/80 sm:text-[11px]">
            {card.desc}
          </p>
        </div>
      </div>

      {/* live published count */}
      {typeof count === 'number' && count > 0 && (
        <div className="relative mt-2 flex items-center justify-between border-t border-white/10 pt-1.5">
          <span className="font-display text-sm font-black text-gradient">{count}+</span>
          <span className="text-[9px] uppercase tracking-[0.15em] text-slate-400">
            {card.table === 'image_prompts' || card.table === 'video_prompts' ? 'Prompts' : card.title}
          </span>
        </div>
      )}
    </motion.div>
  );

  return (
    <motion.div
      className={`pointer-events-auto absolute ${card.pos} w-[136px] sm:w-[190px] ${card.mobile ? '' : 'hidden sm:block'}`}
      style={reduce ? {} : { x: px, y: py }}
      initial={reduce ? {} : { opacity: 0, scale: 0.6, y: 20 }}
      animate={reduce ? {} : { opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.7, delay: card.delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="animate-[card-levitate_var(--dur)_ease-in-out_infinite]"
        style={{ ['--dur' as string]: `${5 + card.depth * 0.06}s` }}
      >
        {card.href ? (
          <Link
            href={card.href}
            aria-label={`${card.title} — ${card.desc}`}
            className="tap-target flex flex-col justify-center rounded-2xl focus-visible:ring-2 focus-visible:ring-neon-purple focus-visible:ring-offset-2 focus-visible:ring-offset-space-950"
          >
            {cardInner}
          </Link>
        ) : (
          <div className="flex flex-col justify-center rounded-2xl">{cardInner}</div>
        )}
      </motion.div>
    </motion.div>
  );
}

export function HeroClient({
  exploreHref,
  workHref,
  counts,
}: {
  exploreHref: string;
  workHref: string;
  counts?: Record<string, number>;
}) {
  const reduce = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);

  // Normalised pointer -1..1 (springed for smoothness) — drives everything.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 120, damping: 20, mass: 0.4 });
  const smy = useSpring(my, { stiffness: 120, damping: 20, mass: 0.4 });

  // Plain pointer object for the R3F camera rig (updated via listener).
  const [scenePointer, setScenePointer] = useState({ x: 0, y: 0 });

  const onPointerMove = useCallback(
    (e: React.MouseEvent) => {
      if (reduce) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const nx = (e.clientX / w) * 2 - 1;
      const ny = (e.clientY / h) * 2 - 1;
      mx.set(nx);
      my.set(ny);
      setScenePointer({ x: nx, y: -ny });
    },
    [mx, my, reduce]
  );

  // Portrait parallax (moves WITH pointer slightly for depth)
  const portraitX = useTransform(smx, (v) => v * 14);
  const portraitY = useTransform(smy, (v) => v * 10);

  const fadeUp = (delay = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 28 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  // Split-text: animate each word of the headline.
  const words = ['Build.', 'Create.', 'Inspire.'];

  return (
    <section
      onMouseMove={onPointerMove}
      className="relative min-h-[92vh] overflow-hidden px-4 pt-8 pb-20 md:px-8 md:pt-14 xl:pl-24 flex items-center"
    >
      {/* ── Cosmic background layers ──────────────────────────────────── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* deep gradient base */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_90%_at_70%_10%,rgba(31,20,84,0.55),transparent_60%),radial-gradient(ellipse_100%_80%_at_20%_100%,rgba(9,20,64,0.5),transparent_55%)]" />
        {/* faint grid */}
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(155,109,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(155,109,255,0.05) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
            maskImage: 'radial-gradient(ellipse 80% 70% at 50% 40%, black, transparent)',
            WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 40%, black, transparent)',
          }}
        />
        {/* nebula blobs */}
        <div className="nebula-1 absolute -left-1/4 -top-1/4 h-[720px] w-[720px] rounded-full bg-neon-purple/[0.13] blur-[140px]" />
        <div className="nebula-2 absolute -right-1/5 top-1/4 h-[640px] w-[640px] rounded-full bg-neon-blue/[0.11] blur-[120px]" />
        <div className="nebula-3 absolute bottom-0 left-1/3 h-[520px] w-[520px] rounded-full bg-neon-magenta/[0.09] blur-[100px]" />
        {/* aurora sweep */}
        <div className="aurora-sweep absolute inset-x-0 top-0 h-[45%] opacity-40" />
        {/* light streaks */}
        <div className="light-streak light-streak-1" />
        <div className="light-streak light-streak-2" />
      </div>

      {/* ── Desktop vertical social rail ──────────────────────────────── */}
      <motion.div
        className="absolute left-4 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-3 xl:flex"
        {...(reduce
          ? {}
          : { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.6, delay: 0.9 } })}
      >
        <span className="mb-1 rotate-180 text-center text-[10px] uppercase tracking-[0.3em] text-slate-500 [writing-mode:vertical-rl]">
          Follow
        </span>
        {SOCIALS.map((s) => {
          const Icon = ICONS[s.icon];
          return (
            <motion.a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              whileHover={reduce ? {} : { scale: 1.18, y: -2 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              className="tap-target grid place-items-center rounded-full glass text-slate-400 transition-colors duration-200 hover:text-white hover:shadow-neon-sm"
            >
              <Icon size={17} />
            </motion.a>
          );
        })}
        <div className="mx-auto mt-1 h-14 w-px bg-gradient-to-b from-white/25 to-transparent" />
      </motion.div>

      {/* ── Main grid ─────────────────────────────────────────────────── */}
      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-4">
        {/* ─────────── LEFT: copy ─────────── */}
        <div className="order-2 text-center lg:order-1 lg:text-left">
          {/* pill badge */}
          <motion.div {...fadeUp(0.1)}>
            <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-300">
              <Sparkles size={12} className="text-neon-purple animate-pulse-glow" />
              {BADGE_ITEMS.join(' • ')}
            </span>
          </motion.div>

          {/* headline — split-text word reveal */}
          <h1 className="mt-6 font-display text-6xl font-black leading-[0.98] tracking-tight sm:text-7xl xl:text-[5.4rem]">
            {words.map((w, i) => (
              <span key={w} className="block overflow-hidden">
                <motion.span
                  className={`inline-block ${w === 'Inspire.' ? 'shimmer-text' : 'text-white'}`}
                  initial={reduce ? {} : { y: '110%', opacity: 0 }}
                  animate={reduce ? {} : { y: '0%', opacity: 1 }}
                  transition={{ duration: 0.85, delay: 0.25 + i * 0.13, ease: [0.22, 1, 0.36, 1] }}
                >
                  {w}
                </motion.span>
              </span>
            ))}
          </h1>

          {/* sub-copy */}
          <motion.p
            className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-slate-400 lg:mx-0"
            {...fadeUp(0.7)}
          >
            The ultimate hub for AI prompts, apps, games, tools & creative
            resources — crafted for creators. Explore, copy, and share in one tap.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center lg:justify-start"
            {...fadeUp(0.85)}
          >
            <Magnetic>
              <Link
                href={exploreHref}
                className="group relative flex tap-target items-center justify-center gap-2 overflow-hidden rounded-full bg-neon-gradient px-8 py-3.5 font-semibold text-white shadow-neon-md transition-shadow duration-300 hover:shadow-neon-lg"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                <Sparkles size={16} />
                Explore Now
                <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Magnetic>
            <Magnetic>
              <Link
                href={workHref}
                className="flex tap-target items-center justify-center gap-2 rounded-full border border-white/20 bg-white/[0.05] px-8 py-3.5 font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/40 hover:bg-white/10"
              >
                <Play size={15} className="text-neon-blue" />
                View My Work
              </Link>
            </Magnetic>
          </motion.div>

          {/* stats */}
          <motion.div
            className="mt-10 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 lg:justify-start"
            {...fadeUp(1)}
          >
            {STATS.map((s) => (
              <div key={s.label} className="flex items-baseline gap-1.5">
                <span className="font-display text-2xl font-black text-gradient">{s.val}</span>
                <span className="text-xs text-slate-500">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ─────────── RIGHT: portrait stage ─────────── */}
        <motion.div
          ref={stageRef}
          className="perspective-1000 order-1 relative mx-auto aspect-[4/5] w-full max-w-[560px] lg:order-2"
          initial={reduce ? {} : { opacity: 0, scale: 0.94 }}
          animate={reduce ? {} : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* R3F cosmic scene behind everything */}
          <AdaptiveThree pointer={scenePointer} />

          {/* Portrait + platform column */}
          <motion.div
            className="absolute inset-0 z-10 flex items-end justify-center"
            style={reduce ? {} : { x: portraitX, y: portraitY }}
          >
            <div className="relative flex h-full w-full items-end justify-center">
              {/* volumetric spotlight from platform up */}
              <div className="pointer-events-none absolute bottom-[8%] left-1/2 h-[70%] w-[60%] -translate-x-1/2 bg-[radial-gradient(ellipse_at_bottom,rgba(79,142,247,0.35),transparent_70%)] blur-2xl" />

              {/* portrait */}
              <div className="relative h-[82%] w-auto animate-[portrait-float_7s_ease-in-out_infinite]">
                <Image
                  src="/hero/portrait.png"
                  alt="NexZen Studio creator"
                  width={1000}
                  height={1282}
                  priority
                  sizes="(max-width: 1024px) 70vw, 480px"
                  className="h-full w-auto select-none object-contain object-bottom drop-shadow-[0_0_60px_rgba(79,142,247,0.45)]"
                  draggable={false}
                />
                {/* blue rim light on portrait */}
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,229,255,0.12)_100%)] mix-blend-screen" />
              </div>

              {/* holographic platform (CSS, layered under portrait feet) */}
              <div className="pointer-events-none absolute bottom-[3%] left-1/2 -translate-x-1/2">
                <div className="platform-disc" />
                <div className="platform-ring" />
                <div className="platform-glow" />
              </div>
            </div>
          </motion.div>

          {/* Floating glass cards (orbit + parallax + tilt) */}
          <div className="pointer-events-none absolute inset-0 z-20">
            {FLOAT_CARDS.map((c) => (
              <HoloCard
                key={c.id}
                card={c}
                mx={smx}
                my={smy}
                reduce={reduce}
                count={c.table ? counts?.[c.table] : undefined}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Bottom tagline / scroll cue ───────────────────────────────── */}
      <motion.div
        className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
        {...(reduce ? {} : { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 1.6, duration: 0.6 } })}
      >
        <p className="text-center text-xs text-slate-500">
          Powered by <span className="text-neon-magenta">Passion.</span> Driven by{' '}
          <span className="text-neon-blue">AI.</span> Built for the{' '}
          <span className="text-gradient font-semibold">Future.</span>
        </p>
        <div className="hidden h-7 w-px overflow-hidden rounded-full bg-white/10 md:block">
          <div className="h-3.5 w-full animate-[slide-up_1.5s_ease-in-out_infinite] bg-gradient-to-b from-neon-purple to-transparent" />
        </div>
      </motion.div>
    </section>
  );
}
