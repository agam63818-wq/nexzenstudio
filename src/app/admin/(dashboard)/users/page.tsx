import { Users as UsersIcon, ShieldCheck } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

export const metadata = { title: 'Users', robots: { index: false } };
export const dynamic = 'force-dynamic';

export default async function UsersPage() {
  let admins: Record<string, unknown>[] = [];
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const supabase = await createClient();
    const { data } = await supabase.from('admins').select('*').order('created_at', { ascending: true });
    admins = (data as Record<string, unknown>[]) ?? [];
  }

  return (
    <section className="pb-16">
      <h1 className="font-display text-2xl font-bold text-white">Users</h1>
      <p className="mt-1.5 max-w-2xl text-sm text-slate-400">
        Registered admins. There is no public signup — to add someone, create a Supabase Auth user, then insert a matching
        row in the <code className="rounded bg-white/5 px-1 font-mono text-xs">admins</code> table using the same user id.
      </p>

      <div className="mt-6 overflow-hidden rounded-2xl glass">
        {admins.length === 0 ? (
          <div className="flex flex-col items-center gap-2 p-12 text-center">
            <UsersIcon size={26} className="text-slate-700" />
            <p className="text-sm text-slate-400">No admins found.</p>
            <p className="text-xs text-slate-600">Add the first row in Supabase to unlock the CMS.</p>
          </div>
        ) : (
          <table className="w-full min-w-[420px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02]">
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">Email</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">Name</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">Added</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((a) => (
                <tr key={String(a.id)} className="border-b border-white/5">
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-2 text-white">
                      <ShieldCheck size={14} className="text-emerald-400" />
                      {String(a.email ?? '—')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-300">{String(a.name ?? '—')}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">
                    {a.created_at ? new Date(String(a.created_at)).toLocaleDateString() : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
