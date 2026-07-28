import { MessageSquare } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { CommentActions } from '@/components/admin/comment-actions';

export const metadata = { title: 'Comments', robots: { index: false } };
export const dynamic = 'force-dynamic';

function fmt(value: unknown) {
  if (!value) return '—';
  const d = new Date(String(value));
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleString();
}

export default async function CommentsPage() {
  let rows: Record<string, unknown>[] = [];
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const supabase = await createClient();
    const { data } = await supabase
      .from('comments')
      .select('*')
      .order('is_spam', { ascending: false })
      .order('created_at', { ascending: false });
    rows = (data as Record<string, unknown>[]) ?? [];
  }

  const pending = rows.filter((c) => !c.approved && !c.is_spam);
  const spam = rows.filter((c) => c.is_spam);
  const approved = rows.filter((c) => c.approved && !c.is_spam);

  return (
    <section className="pb-16">
      <h1 className="font-display text-2xl font-bold text-white">Comments</h1>
      <p className="mt-1.5 text-sm text-slate-400">
        Moderate visitor comments. Approving publishes the comment on its content page; marking as spam hides it without
        deleting the record.
      </p>

      <div className="mt-6 grid grid-cols-3 gap-4">
        {[
          { label: 'Awaiting review', value: pending.length, tone: 'text-amber-300' },
          { label: 'Approved', value: approved.length, tone: 'text-emerald-300' },
          { label: 'Spam', value: spam.length, tone: 'text-red-300' },
        ].map((s) => (
          <div key={s.label} className="glass rounded-xl p-4">
            <p className={`font-display text-2xl font-bold ${s.tone}`}>{s.value}</p>
            <p className="mt-1 text-[11px] uppercase tracking-wider text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        {rows.length === 0 && (
          <div className="flex flex-col items-center gap-2 rounded-2xl glass p-12 text-center">
            <MessageSquare size={26} className="text-slate-700" />
            <p className="text-sm text-slate-400">No comments yet.</p>
            <p className="text-xs text-slate-600">They will appear here as soon as visitors start commenting.</p>
          </div>
        )}

        {rows.map((c) => {
          const id = c.id as string;
          const isSpam = Boolean(c.is_spam);
          const isApproved = Boolean(c.approved);
          return (
            <div key={id} className="rounded-xl glass p-4">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold text-white">{String(c.author_name ?? 'Anonymous')}</p>
                <span className="text-[11px] text-slate-500">{fmt(c.created_at)}</span>
                {c.content_type ? (
                  <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-slate-400">
                    {String(c.content_type)}
                  </span>
                ) : null}
                {isSpam && (
                  <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] font-semibold text-red-300">spam</span>
                )}
                {isApproved && !isSpam && (
                  <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                    approved
                  </span>
                )}
              </div>

              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-300">{String(c.body ?? '')}</p>

              <CommentActions id={id} isApproved={isApproved} isSpam={isSpam} />
            </div>
          );
        })}
      </div>
    </section>
  );
}
