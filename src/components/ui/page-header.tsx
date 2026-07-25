import type { ReactNode } from 'react';
import { SectionReveal } from './section-reveal';

interface Props {
  title: string;
  /** Portion of the title to render with gradient (defaults to full title) */
  gradientTitle?: string;
  description?: string;
  badge?: string;
  children?: ReactNode;
}

/**
 * Consistent premium page header used across all list/detail pages.
 * Renders: optional badge pill → h1 with gradient → description → optional slot.
 */
export function PageHeader({ title, gradientTitle, description, badge, children }: Props) {
  const plain = gradientTitle ? title.replace(gradientTitle, '') : '';

  return (
    <div className="relative mb-12">
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 left-1/2 h-[300px] w-[500px] -translate-x-1/2 rounded-full bg-neon-purple/[0.07] blur-[80px]"
      />

      <SectionReveal>
        {badge && (
          <span className="mb-4 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
            {badge}
          </span>
        )}

        <h1 className="font-display text-4xl font-black tracking-tight md:text-5xl lg:text-6xl">
          {gradientTitle ? (
            <>
              {plain && <span className="text-white">{plain} </span>}
              <span className="text-gradient">{gradientTitle}</span>
            </>
          ) : (
            <span className="text-gradient">{title}</span>
          )}
        </h1>

        {description && (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-400">{description}</p>
        )}

        {children && <div className="mt-6">{children}</div>}
      </SectionReveal>

      {/* Decorative bottom line */}
      <div className="mt-8 h-px w-full bg-gradient-to-r from-neon-purple/30 via-neon-blue/20 to-transparent" />
    </div>
  );
}
