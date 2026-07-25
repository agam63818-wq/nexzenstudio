'use client';

import Link from 'next/link';
import {
  ArrowRight,
  Sparkles,
  Gamepad2,
  Package,
  FolderDown,
  BookOpen,
  Images,
  ExternalLink,
} from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { SectionReveal } from '@/components/ui/section-reveal';

const FEATURES = [
  {
    title: 'AI Prompts',
    desc: 'ChatGPT, Claude, Midjourney & more — categorized and ready to copy.',
    href: '/prompts',
    Icon: Sparkles,
    gradient: 'from-neon-purple/25 via-neon-blue/10 to-transparent',
    iconBg: 'bg-neon-purple/20 border-neon-purple/30',
    iconColor: 'text-neon-purple',
    glow: 'rgba(155,109,255,0.35)',
  },
  {
    title: 'Games',
    desc: 'Play online or download — with leaderboards, screenshots & trailers.',
    href: '/games',
    Icon: Gamepad2,
    gradient: 'from-neon-blue/25 via-neon-cyan/10 to-transparent',
    iconBg: 'bg-neon-blue/20 border-neon-blue/30',
    iconColor: 'text-neon-blue',
    glow: 'rgba(79,142,247,0.35)',
  },
  {
    title: 'APK Store',
    desc: 'Verified apps with changelogs, screenshots and virus-scan badges.',
    href: '/apks',
    Icon: Package,
    gradient: 'from-neon-magenta/25 via-neon-purple/10 to-transparent',
    iconBg: 'bg-neon-magenta/20 border-neon-magenta/30',
    iconColor: 'text-neon-magenta',
    glow: 'rgba(224,64,251,0.35)',
  },
  {
    title: 'Resources',
    desc: 'Templates, presets, icons, fonts, Lottie files and wallpapers.',
    href: '/resources',
    Icon: FolderDown,
    gradient: 'from-neon-cyan/25 via-neon-blue/10 to-transparent',
    iconBg: 'bg-neon-cyan/20 border-neon-cyan/30',
    iconColor: 'text-neon-cyan',
    glow: 'rgba(0,229,255,0.35)',
  },
  {
    title: 'Blog',
    desc: 'Long-form, SEO-focused reads on AI, tech and creative workflows.',
    href: '/blog',
    Icon: BookOpen,
    gradient: 'from-neon-purple/25 via-neon-magenta/10 to-transparent',
    iconBg: 'bg-neon-purple/20 border-neon-purple/30',
    iconColor: 'text-neon-purple',
    glow: 'rgba(155,109,255,0.35)',
  },
  {
    title: 'Gallery',
    desc: 'AI-generated images, videos, designs and wallpapers.',
    href: '/gallery',
    Icon: Images,
    gradient: 'from-neon-blue/25 via-neon-purple/10 to-transparent',
    iconBg: 'bg-neon-blue/20 border-neon-blue/30',
    iconColor: 'text-neon-blue',
    glow: 'rgba(79,142,247,0.35)',
  },
];

export function FeatureCards() {
  const reduce = useReducedMotion();

  return (
    <section className="relative mx-auto max-w-7xl px-4 py-20 md:px-8">
      {/* Section header */}
      <SectionReveal>
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-slate-400">
            <ExternalLink size={11} />
            Explore the Hub
          </span>
          <h2 className="mt-4 font-display text-4xl font-black tracking-tight md:text-5xl">
            Everything in{' '}
            <span className="text-gradient">one place</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-400">
            From AI prompts to games, APKs to resources — all your creative tools under one roof.
          </p>
        </div>
      </SectionReveal>

      {/* Cards grid */}
      <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(({ title, desc, href, Icon, gradient, iconBg, iconColor, glow }, i) => (
          <motion.div
            key={title}
            initial={reduce ? false : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link href={href} className="group block h-full">
              <div
                className="relative h-full overflow-hidden rounded-2xl transition-all duration-400"
                style={{ transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease' }}
                onMouseEnter={(e) => {
                  if (reduce) return;
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-6px) scale(1.01)';
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 20px 60px ${glow}, 0 0 0 1px ${glow.replace('0.35', '0.4')}`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = '';
                  (e.currentTarget as HTMLElement).style.boxShadow = '';
                }}
              >
                {/* Glass base */}
                <div className="glass h-full rounded-2xl p-6">
                  {/* Gradient overlay on hover */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />

                  {/* Shine sweep */}
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.04] to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                  {/* Content */}
                  <div className="relative">
                    {/* Icon */}
                    <div className={`inline-flex rounded-xl border p-3 ${iconBg} transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_20px_${glow}]`}>
                      <Icon size={22} className={iconColor} />
                    </div>

                    <h3 className="mt-4 font-display text-xl font-bold text-white">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-400">{desc}</p>

                    {/* CTA */}
                    <span className={`mt-5 inline-flex items-center gap-1.5 text-sm font-semibold ${iconColor} transition-all duration-200`}>
                      Explore
                      <ArrowRight
                        size={14}
                        className="transition-transform duration-300 group-hover:translate-x-1.5"
                      />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
