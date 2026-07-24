import Link from 'next/link';
import {
  ArrowRight,
  Sparkles,
  Gamepad2,
  Package,
  FolderDown,
  BookOpen,
  Images,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { SectionReveal } from '@/components/ui/section-reveal';

const FEATURES = [
  { title: 'AI Prompts', desc: 'ChatGPT, Claude, Midjourney & more.', href: '/prompts', Icon: Sparkles },
  { title: 'Games', desc: 'Play online or download.', href: '/games', Icon: Gamepad2 },
  { title: 'APK Store', desc: 'Verified apps with changelogs.', href: '/apks', Icon: Package },
  { title: 'Resources', desc: 'Templates, presets, packs.', href: '/resources', Icon: FolderDown },
  { title: 'Blog', desc: 'Long-form, SEO-focused reads.', href: '/blog', Icon: BookOpen },
  { title: 'Gallery', desc: 'Images, videos & designs.', href: '/gallery', Icon: Images },
];

export function FeatureCards() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
      <SectionReveal>
        <h2 className="text-center text-3xl font-bold md:text-4xl">
          Everything in <span className="text-gradient">one hub</span>
        </h2>
      </SectionReveal>

      {/* 1 col mobile → 2 tablet → 3 desktop */}
      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(({ title, desc, href, Icon }, i) => (
          <SectionReveal key={title} delay={i * 0.05}>
            <Link href={href}>
              <GlassCard className="group h-full transition-transform duration-300 hover:-translate-y-1">
                <Icon className="text-neon-purple" size={28} />
                <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
                <p className="mt-1 text-sm text-slate-400">{desc}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm text-neon-blue">
                  Explore <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </span>
              </GlassCard>
            </Link>
          </SectionReveal>
        ))}
      </div>
    </section>
  );
}
