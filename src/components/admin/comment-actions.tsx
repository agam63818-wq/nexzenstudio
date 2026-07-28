'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Check, ShieldAlert, Trash2, Loader2, AlertTriangle } from 'lucide-react';
import {
  approveComment,
  markSpam,
  deleteRow,
  type ActionResult,
} from '@/app/admin/(dashboard)/manager-actions';

interface Props {
  id: string;
  isApproved: boolean;
  isSpam: boolean;
}

/**
 * Moderation controls for a single comment.
 *
 * Lives in a client component so the ActionResult returned by each server
 * action can be surfaced — a silent failure during moderation is worse than
 * no button at all.
 */
export function CommentActions({ id, isApproved, isSpam }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function run(action: () => Promise<ActionResult>) {
    setError(null);
    startTransition(async () => {
      const result = await action();
      if (!result.ok) setError(result.message ?? 'Action failed.');
      router.refresh();
    });
  }

  const btn =
    'tap-target inline-flex items-center gap-1.5 rounded-lg border px-3 text-xs transition disabled:opacity-50';

  return (
    <div className="mt-3">
      <div className="flex flex-wrap items-center gap-2">
        {!isApproved && (
          <button
            type="button"
            disabled={pending}
            onClick={() => run(() => approveComment(id))}
            className={`${btn} border-emerald-500/25 text-emerald-300 hover:bg-emerald-500/10`}
          >
            <Check size={13} /> Approve
          </button>
        )}

        {!isSpam && (
          <button
            type="button"
            disabled={pending}
            onClick={() => run(() => markSpam(id))}
            className={`${btn} border-white/15 text-slate-300 hover:bg-white/10`}
          >
            <ShieldAlert size={13} /> Mark spam
          </button>
        )}

        <button
          type="button"
          disabled={pending}
          onClick={() => {
            if (window.confirm('Delete this comment permanently? This cannot be undone.')) {
              run(() => deleteRow('comments', id));
            }
          }}
          className={`${btn} border-red-500/25 text-red-300 hover:bg-red-500/10`}
        >
          <Trash2 size={13} /> Delete
        </button>

        {pending && <Loader2 size={13} className="animate-spin text-slate-500" />}
      </div>

      {error && (
        <p role="alert" className="mt-2 flex items-start gap-1.5 text-xs text-red-300">
          <AlertTriangle size={12} className="mt-0.5 shrink-0" />
          <span className="break-words">{error}</span>
        </p>
      )}
    </div>
  );
}
