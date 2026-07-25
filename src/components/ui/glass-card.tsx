import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
  /** Show animated gradient border on hover */
  gradientBorder?: boolean;
}

export function GlassCard({ children, className, gradientBorder = false }: Props) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl p-5 transition-all duration-300',
        'glass',
        gradientBorder && 'gradient-border',
        'hover:border-white/20 hover:shadow-card-hover',
        className
      )}
    >
      {/* Shine sweep on hover */}
      <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.04] to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      {children}
    </div>
  );
}
