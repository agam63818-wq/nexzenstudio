'use client';

import { useState, useTransition, useRef, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, X, Save, Loader2, AlertTriangle, Info, Check } from 'lucide-react';
import {
  saveRow,
  deleteRow,
  setStatus,
  duplicateRow,
  type ActionResult,
} from '@/app/admin/(dashboard)/manager-actions';
import { FieldInput } from './field-input';
import { DataTable, type Row } from './data-table';
import type { Field, SelectOption } from './field-types';
import { coercionBuckets, slugify } from './field-types';

interface Props {
  table: string;
  title: string;
  description?: string;
  fields: Field[];
  titleKey: string;
  rows: Record<string, unknown>[];
  hasStatus: boolean;
  /** Column shown as a badge in the list (e.g. `tool`, `category`). */
  badgeKey?: string;
  badgeLabel?: string;
  /** Column holding a thumbnail URL. */
  thumbKey?: string;
  /** Live category options keyed by kind, resolved on the server. */
  categoryOptions: SelectOption[];
  /** Set when Supabase isn't configured, so we can warn instead of showing 0 rows. */
  notConfigured?: boolean;
}

export function ManagerClient({
  table,
  title,
  description,
  fields,
  titleKey,
  rows,
  hasStatus,
  badgeKey,
  badgeLabel,
  thumbKey,
  categoryOptions,
  notConfigured,
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Row | null>(null);
  const [toast, setToast] = useState<{ ok: boolean; message: string } | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [titleValue, setTitleValue] = useState('');
  const [scrollWanted, setScrollWanted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Scroll the editor into view only once it has actually mounted.
  useEffect(() => {
    if (!scrollWanted || !formOpen) return;
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setScrollWanted(false);
  }, [scrollWanted, formOpen]);

  const buckets = useMemo(() => coercionBuckets(fields), [fields]);

  const tableRows: Row[] = useMemo(
    () =>
      rows.map((r) => ({
        id: String(r.id),
        title: String(r[titleKey] ?? '(untitled)'),
        status: hasStatus ? ((r.status as string) ?? 'draft') : null,
        createdAt: (r.created_at as string) ?? null,
        badge: badgeKey ? ((r[badgeKey] as string) ?? null) : null,
        thumb: thumbKey ? ((r[thumbKey] as string) ?? null) : null,
        raw: r,
      })),
    [rows, titleKey, hasStatus, badgeKey, thumbKey]
  );

  /**
   * Surface an action result to the admin. Failures stay on screen noticeably
   * longer than successes and keep the editor open so nothing is lost.
   */
  function flash(result: ActionResult, fallback: string) {
    setToast({ ok: result.ok, message: result.message ?? fallback });
    setTimeout(() => setToast(null), result.ok ? 2600 : 6000);
  }

  function openCreate() {
    setEditing(null);
    setTitleValue('');
    setFormError(null);
    setFormOpen(true);
    setScrollWanted(true);
  }

  function openEdit(row: Row) {
    setEditing(row.raw);
    setTitleValue(String(row.raw[titleKey] ?? ''));
    setFormError(null);
    setFormOpen(true);
    setScrollWanted(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditing(null);
    setTitleValue('');
    setFormError(null);
    setScrollWanted(false);
  }

  function handleSubmit(formData: FormData) {
    const isEdit = Boolean(editing?.id);
    startTransition(async () => {
      const result = await saveRow(table, formData);
      setFormError(result.ok ? null : (result.message ?? 'Save failed.'));
      // Only close the editor on success — on failure keep the admin's input.
      if (result.ok) closeForm();
      flash(result, isEdit ? 'Changes saved.' : 'Draft created.');
      router.refresh();
    });
  }

  function handleToggle(id: string, next: 'published' | 'draft') {
    setPendingId(id);
    startTransition(async () => {
      const result = await setStatus(table, id, next);
      setPendingId(null);
      flash(result, next === 'published' ? 'Published.' : 'Moved back to draft.');
      router.refresh();
    });
  }

  function handleDuplicate(id: string) {
    setPendingId(id);
    startTransition(async () => {
      const result = await duplicateRow(table, id);
      setPendingId(null);
      flash(result, 'Duplicated as a new draft.');
      router.refresh();
    });
  }

  function handleDelete(row: Row) {
    setPendingId(row.id);
    startTransition(async () => {
      const result = await deleteRow(table, row.id);
      setPendingId(null);
      setConfirmDelete(null);
      flash(result, 'Deleted.');
      router.refresh();
    });
  }

  const requiredFields = fields.filter((f) => f.required);
  const editingId = editing?.id ? String(editing.id) : '';

  return (
    <section className="pb-16">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-display text-2xl font-bold text-white">{title}</h1>
          {description && <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-slate-400">{description}</p>}
        </div>
        <button
          type="button"
          onClick={formOpen && !editing ? closeForm : openCreate}
          className="tap-target inline-flex shrink-0 items-center gap-2 rounded-lg bg-neon-gradient px-4 text-sm font-semibold text-white transition hover:opacity-90"
        >
          {formOpen && !editing ? <X size={16} /> : <Plus size={16} />}
          {formOpen && !editing ? 'Close' : `New ${title.replace(/s$/, '')}`}
        </button>
      </div>

      {notConfigured && (
        <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">
          <AlertTriangle size={16} className="mt-0.5 shrink-0" />
          <p>
            Supabase isn&apos;t configured — set <code className="font-mono text-xs">NEXT_PUBLIC_SUPABASE_URL</code> and{' '}
            <code className="font-mono text-xs">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in your environment to load and save
            real content.
          </p>
        </div>
      )}

      {/* ── Editor form ────────────────────────────────────────────── */}
      {formOpen && (
        <form
          ref={formRef}
          action={handleSubmit}
          key={editingId || 'new'}
          className="mt-6 scroll-mt-6 rounded-2xl glass p-5 sm:p-6"
        >
          {/* Coercion descriptors consumed by the server action. */}
          <input type="hidden" name="__array" value={buckets.array.join(',')} />
          <input type="hidden" name="__number" value={buckets.numeric.join(',')} />
          <input type="hidden" name="__bool" value={buckets.bool.join(',')} />
          {editingId && <input type="hidden" name="id" value={editingId} />}

          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
            <h2 className="font-display text-base font-semibold text-white">
              {editingId ? `Editing: ${String(editing?.[titleKey] ?? 'record')}` : `New ${title.replace(/s$/, '').toLowerCase()}`}
            </h2>
            <button type="button" onClick={closeForm} className="text-xs text-slate-400 transition hover:text-white">
              Cancel
            </button>
          </div>

          {/* Real database errors, shown inline so the admin can fix and retry. */}
          {formError && (
            <div
              role="alert"
              className="mt-4 flex items-start gap-2.5 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2.5 text-sm text-red-200"
            >
              <AlertTriangle size={15} className="mt-0.5 shrink-0" />
              <span className="break-words">{formError}</span>
            </div>
          )}

          {requiredFields.length > 0 && (
            <p className="mt-4 flex items-center gap-1.5 text-xs text-slate-500">
              <Info size={12} className="shrink-0" />
              Fields marked <span className="text-red-400">*</span> are required — everything else is optional and can be
              filled in later.
            </p>
          )}

          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            {fields.map((f) => (
              <FieldInput
                key={`${editingId}-${f.name}`}
                field={f}
                defaultValue={editing ? editing[f.name] : undefined}
                categoryOptions={f.categoryKind ? categoryOptions : undefined}
                onTitleChange={f.name === titleKey ? setTitleValue : undefined}
                syncedValue={f.type === 'slug' && !editingId ? slugify(titleValue) : undefined}
              />
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-white/10 pt-5">
            <button
              type="submit"
              disabled={pending}
              className="tap-target inline-flex items-center gap-2 rounded-lg bg-neon-gradient px-5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
            >
              {pending ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
              {editingId ? 'Save changes' : 'Create draft'}
            </button>
            <button
              type="button"
              onClick={closeForm}
              className="tap-target rounded-lg border border-white/10 px-4 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
            >
              Cancel
            </button>
            {!editingId && hasStatus && (
              <p className="text-xs text-slate-500">New entries are saved as drafts — publish them from the list below.</p>
            )}
          </div>
        </form>
      )}

      {/* ── List ───────────────────────────────────────────────────── */}
      <div className="mt-6">
        <DataTable
          rows={tableRows}
          label={title.toLowerCase()}
          hasStatus={hasStatus}
          badgeLabel={badgeKey ? (badgeLabel ?? 'Type') : undefined}
          pendingId={pendingId}
          onEdit={openEdit}
          onDuplicate={handleDuplicate}
          onToggleStatus={handleToggle}
          onDelete={(id) => {
            const row = tableRows.find((r) => r.id === id);
            if (row) setConfirmDelete(row);
          }}
        />
      </div>

      {/* ── Delete confirmation ────────────────────────────────────── */}
      {confirmDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={() => setConfirmDelete(null)}
        >
          <div className="w-full max-w-sm rounded-2xl glass-strong p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500/15 text-red-300">
                <AlertTriangle size={18} />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-white">Delete this entry?</h3>
                <p className="mt-1 break-words text-sm text-slate-400">
                  <span className="text-slate-200">{confirmDelete.title}</span> will be permanently removed. This cannot be
                  undone.
                </p>
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmDelete(null)}
                className="tap-target rounded-lg border border-white/10 px-4 text-sm text-slate-300 transition hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={pending}
                onClick={() => handleDelete(confirmDelete)}
                className="tap-target inline-flex items-center gap-2 rounded-lg bg-red-500/90 px-4 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-50"
              >
                {pending && <Loader2 size={14} className="animate-spin" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast — green on success, red with the real error on failure ── */}
      {toast && (
        <div
          role={toast.ok ? 'status' : 'alert'}
          className={`fixed bottom-6 left-1/2 z-50 flex max-w-[min(30rem,calc(100vw-2rem))] -translate-x-1/2 items-start gap-2 rounded-xl border px-5 py-2.5 text-sm shadow-lg backdrop-blur ${
            toast.ok
              ? 'border-emerald-400/40 bg-emerald-950/95 text-emerald-100'
              : 'border-red-400/40 bg-red-950/95 text-red-100'
          }`}
        >
          {toast.ok ? (
            <Check size={15} className="mt-0.5 shrink-0" />
          ) : (
            <AlertTriangle size={15} className="mt-0.5 shrink-0" />
          )}
          <span className="break-words">{toast.message}</span>
        </div>
      )}
    </section>
  );
}
