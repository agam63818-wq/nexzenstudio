import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  href: string;
  title: string;
  subtitle?: string;
  meta?: string;
  className?: string;
}

/** Generic content list card used across library pages. */
export function ContentCard({ href, title, subtitle, meta, className }: Props) {
  return (
    <Link href={href} className="group block h-full">
      <div
        className={cn(
          'relative h-full overflow-hidden rounded-2xl p-5 transition-all duration-300',
          'glass',
          'hover:border-white/20 hover:shadow-card-hover hover:-translate-y-1',
          className
        )}
      >
        {/* Shine sweep */}
        <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.04] to-transparent transition-transform duration-600 group-hover:translate-x-full" />

        {/* Meta badge */}
        {meta && (
          <span className="inline-flex items-center rounded-full border border-neon-blue/30 bg-neon-blue/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-neon-blue">
            {meta}
          </span>
        )}

        <h3 className={cn('line-clamp-2 font-display text-lg font-bold text-white', meta ? 'mt-2' : 'mt-0')}>
          {title}
        </h3>

        {subtitle && (
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-slate-400">{subtitle}</p>
        )}

        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-neon-blue">
          Open
          <ArrowRight
            size={13}
            className="transition-transform duration-300 group-hover:translate-x-1.5"
          />
        </span>

        {/* Bottom glow line */}
        <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-magenta transition-all duration-400 group-hover:w-full" />
      </div>
    </Link>
  );
}

/** Shown when a list has no published rows yet. */
export function EmptyState({ label }: { label: string }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-12 text-center">
      <div className="mb-3 h-12 w-12 rounded-full bg-white/5 flex items-center justify-center">
        <span className="text-2xl">✨</span>
      </div>
      <p className="text-sm font-medium text-slate-400">No {label} published yet.</p>
      <p className="mt-1 text-xs text-slate-600">Add some from the admin dashboard.</p>
    </div>
  );
}
