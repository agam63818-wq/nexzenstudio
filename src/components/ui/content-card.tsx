import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';

interface Props {
  href: string;
  title: string;
  subtitle?: string;
  meta?: string;
}

/** Generic content list card used across library pages. */
export function ContentCard({ href, title, subtitle, meta }: Props) {
  return (
    <Link href={href}>
      <GlassCard className="group h-full transition-transform duration-300 hover:-translate-y-1">
        {meta && (
          <span className="text-xs uppercase tracking-wide text-neon-blue">{meta}</span>
        )}
        <h3 className="mt-1 line-clamp-2 text-lg font-semibold text-white">{title}</h3>
        {subtitle && <p className="mt-1 line-clamp-2 text-sm text-slate-400">{subtitle}</p>}
        <span className="mt-4 inline-flex items-center gap-1 text-sm text-neon-blue">
          Open <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
        </span>
      </GlassCard>
    </Link>
  );
}

/** Shown when a list has no published rows yet. */
export function EmptyState({ label }: { label: string }) {
  return (
    <p className="col-span-full rounded-xl border border-dashed border-white/15 p-8 text-center text-sm text-slate-500">
      No {label} published yet. Add some from the admin dashboard.
    </p>
  );
}
