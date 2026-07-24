const STATS = [
  { value: '50+', label: 'AI Prompts' },
  { value: '15+', label: 'Games & Apps' },
  { value: '25+', label: 'APK Files' },
  { value: '100+', label: 'Resources' },
  { value: '10K+', label: 'Downloads' },
  { value: '5K+', label: 'Visitors' },
];

export function StatsBar() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      {/* Horizontal scroll on mobile, wrapped grid on larger screens */}
      <div className="flex snap-x gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-6 md:overflow-visible">
        {STATS.map((s) => (
          <div
            key={s.label}
            className="glass min-w-[40%] shrink-0 snap-center rounded-xl p-4 text-center sm:min-w-[30%] md:min-w-0"
          >
            <p className="text-2xl font-black text-gradient">{s.value}</p>
            <p className="mt-1 text-xs text-slate-400">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
