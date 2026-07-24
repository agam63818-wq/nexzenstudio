import type { ReactNode } from 'react';

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
      <h1 className="text-4xl font-black md:text-5xl">
        <span className="text-gradient">{title}</span>
      </h1>
      <p className="mt-3 max-w-2xl text-slate-400">{description}</p>
      {children}
      <p className="mt-10 rounded-xl border border-dashed border-white/15 p-6 text-sm text-slate-500">
        Coming soon — this section is database-driven and lands in a later phase.
      </p>
    </section>
  );
}
