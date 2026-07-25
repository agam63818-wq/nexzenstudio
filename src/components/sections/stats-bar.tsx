'use client';

import { motion, useReducedMotion } from 'framer-motion';

const STATS = [
  { value: '50+',  label: 'AI Prompts',   color: 'from-neon-purple/20 to-transparent', glow: 'rgba(155,109,255,0.3)' },
  { value: '15+',  label: 'Games & Apps', color: 'from-neon-blue/20 to-transparent',   glow: 'rgba(79,142,247,0.3)' },
  { value: '25+',  label: 'APK Files',    color: 'from-neon-magenta/20 to-transparent',glow: 'rgba(224,64,251,0.3)' },
  { value: '100+', label: 'Resources',    color: 'from-neon-cyan/20 to-transparent',   glow: 'rgba(0,229,255,0.3)' },
  { value: '10K+', label: 'Downloads',    color: 'from-neon-purple/20 to-transparent', glow: 'rgba(155,109,255,0.3)' },
  { value: '5K+',  label: 'Visitors',     color: 'from-neon-blue/20 to-transparent',   glow: 'rgba(79,142,247,0.3)' },
];

export function StatsBar() {
  const reduce = useReducedMotion();

  return (
    <section className="relative mx-auto max-w-7xl px-4 py-10 md:px-8">
      {/* Divider line */}
      <div className="mb-8 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="flex snap-x gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-6 md:overflow-visible">
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: i * 0.07 }}
            whileHover={reduce ? {} : { y: -4, scale: 1.04 }}
            className="group relative min-w-[40%] shrink-0 snap-center overflow-hidden rounded-2xl sm:min-w-[30%] md:min-w-0"
          >
            {/* Glass base */}
            <div className="glass h-full rounded-2xl p-5 text-center transition-all duration-300 group-hover:border-white/20">
              {/* Gradient bg */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-b ${s.color} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />

              {/* Value */}
              <p
                className="relative font-display text-3xl font-black text-gradient"
                style={{ textShadow: `0 0 20px ${s.glow}` }}
              >
                {s.value}
              </p>

              {/* Label */}
              <p className="relative mt-1.5 text-xs font-medium uppercase tracking-wider text-slate-400 transition-colors duration-200 group-hover:text-slate-300">
                {s.label}
              </p>

              {/* Bottom glow line */}
              <div
                className="absolute bottom-0 left-1/2 h-[1px] w-0 -translate-x-1/2 rounded-full transition-all duration-300 group-hover:w-3/4"
                style={{ background: `linear-gradient(90deg, transparent, ${s.glow}, transparent)` }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Divider line */}
      <div className="mt-8 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}
