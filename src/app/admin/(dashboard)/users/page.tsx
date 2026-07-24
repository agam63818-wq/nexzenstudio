import { createClient } from '@/lib/supabase/server';
export const metadata = { robots: { index: false } };

export default async function UsersPage() {
  let admins: Record<string, unknown>[] = [];
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const supabase = await createClient();
    const { data } = await supabase.from('admins').select('*');
    admins = (data as Record<string, unknown>[]) ?? [];
  }
  return (
    <section>
      <h1 className="text-2xl font-bold text-white">Users</h1>
      <p className="mt-2 text-sm text-slate-400">Registered admins (no public signup). Add via Supabase Auth + an <code>admins</code> row.</p>
      <div className="mt-6 space-y-2">
        {admins.map((a) => (
          <div key={a.id as string} className="rounded-xl glass p-4 text-sm text-white">{String(a.email)}</div>
        ))}
        {admins.length === 0 && <p className="text-sm text-slate-500">No admins found.</p>}
      </div>
    </section>
  );
}
