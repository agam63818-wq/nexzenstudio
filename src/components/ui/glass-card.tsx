import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
}

export function GlassCard({ children, className }: Props) {
  return (
    <div className={cn('glass glow-hover rounded-2xl p-5', className)}>
      {children}
    </div>
  );
}
