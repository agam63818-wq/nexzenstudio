import { createClient } from '@/lib/supabase/server';

export const metadata = { robots: { index: false } };

async function view(name: string): Promise<Record<string, unknown>[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];
  const supabase = await createClient();
  const { data } = await supabase.from(name).select('*');
  return (data as Record<string, unknown>[]) ?? [];
}

function Table({ title, rows, cols }: { title: string; rows: Record<string, unknown>[]; cols: [string, string] }) {
  return (
    <div className="glass rounded-2xl p-5">
      <h2 className="font-semibold text-white">{title}</h2>
      <div className="mt-3 space-y-1 text-sm">
        {rows.length === 0 && <p className="text-slate-500">No data yet.</p>}
        {rows.map((r, i) => (
          <div key={i} className="flex justify-between border-b border-white/5 py-1">
            <span className="truncate text-slate-300">{String(r[cols[0]])}</span>
            <span className="text-slate-400">{String(r[cols[1]])}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function AnalyticsPage() {
  const [paths, devices, countries] = await Promise.all([
    view('analytics_top_paths'),
    view('analytics_by_device'),
    view('analytics_by_country'),
  ]);

  return (
    <section>
      <h1 className="text-2xl font-bold text-white">Analytics</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Table title="Top paths" rows={paths} cols={['path', 'hits']} />
        <Table title="By device" rows={devices} cols={['device', 'hits']} />
        <Table title="By country" rows={countries} cols={['country', 'hits']} />
      </div>
    </section>
  );
}
