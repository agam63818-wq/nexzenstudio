import { createClient } from '@/lib/supabase/server';
import { setStatus, deleteRow } from '@/app/admin/(dashboard)/manager-actions';

export const metadata = { robots: { index: false } };

export default async function CommentsPage() {
  let rows: Record<string, unknown>[] = [];
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const supabase = await createClient();
    const { data } = await supabase.from('comments').select('*').order('is_spam', { ascending: false }).order('created_at', { ascending: false });
    rows = (data as Record<string, unknown>[]) ?? [];
  }

  return (
    <section>
      <h1 className="text-2xl font-bold text-white">Comments</h1>
      <div className="mt-6 space-y-2">
        {rows.length === 0 && (
          <p className="rounded-xl border border-dashed border-white/15 p-6 text-sm text-slate-500">No comments.</p>
        )}
        {rows.map((c) => {
          const id = c.id as string;
          return (
            <div key={id} className="rounded-xl glass p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-white">{String(c.author_name ?? 'Anonymous')}</p>
                {(c.is_spam as boolean) && (
                  <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-xs text-red-300">spam</span>
                )}
              </div>
              <p className="mt-1 text-sm text-slate-300">{String(c.body)}</p>
              <div className="mt-3 flex gap-2">
                {!(c.approved as boolean) && (
                  <form action={setStatus.bind(null, 'comments', id, 'published')}>
                    <button className="tap-target rounded-lg border border-white/15 px-3 text-xs text-white hover:bg-white/10">Approve</button>
                  </form>
                )}
                <form action={deleteRow.bind(null, 'comments', id)}>
                  <button className="tap-target rounded-lg border border-red-500/30 px-3 text-xs text-red-300 hover:bg-red-500/10">Delete</button>
                </form>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
