import { createClient } from '@/lib/supabase/server';
import { saveRow, deleteRow, setStatus, duplicateRow } from '@/app/admin/(dashboard)/manager-actions';

export interface Field {
  name: string;
  label: string;
  type?: 'text' | 'textarea' | 'url';
}

interface Props {
  table: string;
  title: string;
  fields: Field[];
  titleKey?: string;
}

/**
 * Reusable content manager: list rows with publish/draft, duplicate and delete
 * controls, plus an inline create form. Powers every admin manager.
 */
export async function ContentManager({ table, title, fields, titleKey = 'title' }: Props) {
  let rows: Record<string, unknown>[] = [];
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const supabase = await createClient();
    const { data } = await supabase.from(table).select('*').order('created_at', { ascending: false });
    rows = (data as Record<string, unknown>[]) ?? [];
  }

  return (
    <section>
      <h1 className="text-2xl font-bold text-white">{title}</h1>

      <form action={saveRow.bind(null, table)} className="mt-6 grid gap-3 rounded-2xl glass p-5">
        {fields.map((f) =>
          f.type === 'textarea' ? (
            <textarea key={f.name} name={f.name} placeholder={f.label} rows={4} className="rounded-lg bg-black/30 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500" />
          ) : (
            <input key={f.name} name={f.name} type={f.type === 'url' ? 'url' : 'text'} placeholder={f.label} className="rounded-lg bg-black/30 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500" />
          )
        )}
        <button className="tap-target justify-self-start rounded-lg bg-neon-gradient px-5 text-sm font-semibold text-white">Create draft</button>
      </form>

      <div className="mt-6 space-y-2">
        {rows.length === 0 && (
          <p className="rounded-xl border border-dashed border-white/15 p-6 text-sm text-slate-500">No rows yet.</p>
        )}
        {rows.map((r) => {
          const id = r.id as string;
          const status = (r.status as string) ?? 'draft';
          return (
            <div key={id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl glass p-4">
              <div className="min-w-0">
                <p className="truncate font-medium text-white">{String(r[titleKey] ?? '(untitled)')}</p>
                <span className={`text-xs ${status === 'published' ? 'text-emerald-300' : 'text-amber-300'}`}>{status}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {status !== 'published' ? (
                  <form action={setStatus.bind(null, table, id, 'published')}>
                    <button className="tap-target rounded-lg border border-white/15 px-3 text-xs text-white hover:bg-white/10">Publish</button>
                  </form>
                ) : (
                  <form action={setStatus.bind(null, table, id, 'draft')}>
                    <button className="tap-target rounded-lg border border-white/15 px-3 text-xs text-white hover:bg-white/10">Unpublish</button>
                  </form>
                )}
                <form action={duplicateRow.bind(null, table, id)}>
                  <button className="tap-target rounded-lg border border-white/15 px-3 text-xs text-white hover:bg-white/10">Duplicate</button>
                </form>
                <form action={deleteRow.bind(null, table, id)}>
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
