import type { ReactNode } from 'react';
import { PageHeader } from '@/components/ui/page-header';

/** Shared shell for placeholder list routes (filled in later phases). */
export function PagePlaceholder({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
      <PageHeader title={title} gradientTitle={title} description={description} />
      {children}
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-12 text-center">
        <div className="mb-3 h-12 w-12 rounded-full bg-neon-purple/10 flex items-center justify-center">
          <span className="text-2xl">🚀</span>
        </div>
        <p className="text-sm font-medium text-slate-400">Coming soon</p>
        <p className="mt-1 text-xs text-slate-600">This section is database-driven and lands in a later phase.</p>
      </div>
    </section>
  );
}
