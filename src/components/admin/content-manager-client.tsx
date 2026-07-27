'use client';

import { useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { deleteRow, duplicateRow, saveRow, setStatus, type ActionResult } from '@/app/admin/(dashboard)/manager-actions';
import type { Field } from './content-manager';

interface Props {
  table: string;
  fields: Field[];
  rows: Record<string, unknown>[];
  titleKey: string;
  hasStatus: boolean;
}

const initialState: ActionResult = { ok: false };

function valueForInput(value: unknown) {
  if (Array.isArray(value)) return value.join(', ');
  if (value === null || value === undefined) return '';
  return String(value);
}

function Toast({ toast }: { toast: ActionResult | null }) {
  if (!toast?.message) return null;
  return (
    <div className={`fixed right-4 top-4 z-50 max-w-sm rounded-xl border px-4 py-3 text-sm shadow-xl ${toast.ok ? 'border-emerald-400/40 bg-emerald-950/90 text-emerald-100' : 'border-red-400/40 bg-red-950/90 text-red-100'}`}>
      {toast.message}
    </div>
  );
}

export function ContentManagerClient({ table, fields, rows, titleKey, hasStatus }: Props) {
  const [editingRow, setEditingRow] = useState<Record<string, unknown> | null>(null);
  const [formState, setFormState] = useState<ActionResult>(initialState);
  const [toast, setToast] = useState<ActionResult | null>(null);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  const buttonText = editingRow ? 'Save changes' : 'Create draft';
  const editingId = editingRow?.id ? String(editingRow.id) : '';

  useEffect(() => {
    if (!toast?.message) return;
    const timer = window.setTimeout(() => setToast(null), 3500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  async function submitForm(formData: FormData) {
    const result = await saveRow(table, formData);
    setFormState(result);
    setToast(result);
    if (result.ok) {
      setEditingRow(null);
      formRef.current?.reset();
    }
  }

  function runAction(action: () => Promise<ActionResult>) {
    startTransition(async () => {
      const result = await action();
      setToast(result);
    });
  }

  const formKey = useMemo(() => (editingId ? `edit-${editingId}` : 'create'), [editingId]);

  return (
    <>
      <Toast toast={toast} />
      <form key={formKey} ref={formRef} action={submitForm} className="mt-6 grid gap-3 rounded-2xl glass p-5">
        {formState.message && !formState.ok && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200" role="alert">
            {formState.message}
          </div>
        )}
        {editingId && <input type="hidden" name="id" value={editingId} />}
        {fields.map((f) => {
          const defaultValue = valueForInput(editingRow?.[f.name]);
          if (f.type === 'select') {
            return (
              <select key={f.name} name={f.name} defaultValue={defaultValue} className="rounded-lg bg-black/30 px-3 py-2 text-sm text-white outline-none">
                <option value="">{f.label}</option>
                {(f.options ?? []).map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            );
          }
          return f.type === 'textarea' ? (
            <textarea key={f.name} name={f.name} defaultValue={defaultValue} placeholder={f.label} rows={4} className="rounded-lg bg-black/30 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500" />
          ) : (
            <input key={f.name} name={f.name} defaultValue={defaultValue} type={f.type === 'url' ? 'url' : 'text'} placeholder={f.label} className="rounded-lg bg-black/30 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500" />
          );
        })}
        <div className="flex flex-wrap gap-2">
          <button disabled={isPending} className="tap-target justify-self-start rounded-lg bg-neon-gradient px-5 text-sm font-semibold text-white disabled:opacity-60">{buttonText}</button>
          {editingRow && (
            <button type="button" onClick={() => { setEditingRow(null); setFormState(initialState); }} className="tap-target rounded-lg border border-white/15 px-5 text-sm font-semibold text-white hover:bg-white/10">Cancel</button>
          )}
        </div>
      </form>

      <div className="mt-6 space-y-2">
        {rows.length === 0 && <p className="rounded-xl border border-dashed border-white/15 p-6 text-sm text-slate-500">No rows yet.</p>}
        {rows.map((r) => {
          const id = String(r.id);
          const status = (r.status as string) ?? 'draft';
          return (
            <div key={id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl glass p-4">
              <div className="min-w-0">
                <p className="truncate font-medium text-white">{String(r[titleKey] ?? '(untitled)')}</p>
                {hasStatus && <span className={`text-xs ${status === 'published' ? 'text-emerald-300' : 'text-amber-300'}`}>{status}</span>}
              </div>
              <div className="flex flex-wrap gap-2">
                {hasStatus && (
                  <button disabled={isPending} onClick={() => runAction(() => setStatus(table, id, status === 'published' ? 'draft' : 'published'))} className="tap-target rounded-lg border border-white/15 px-3 text-xs text-white hover:bg-white/10 disabled:opacity-60">{status === 'published' ? 'Unpublish' : 'Publish'}</button>
                )}
                <button onClick={() => { setEditingRow(r); setFormState(initialState); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="tap-target rounded-lg border border-white/15 px-3 text-xs text-white hover:bg-white/10">Edit</button>
                <button disabled={isPending} onClick={() => runAction(() => duplicateRow(table, id))} className="tap-target rounded-lg border border-white/15 px-3 text-xs text-white hover:bg-white/10 disabled:opacity-60">Duplicate</button>
                <button disabled={isPending} onClick={() => runAction(() => deleteRow(table, id))} className="tap-target rounded-lg border border-red-500/30 px-3 text-xs text-red-300 hover:bg-red-500/10 disabled:opacity-60">Delete</button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
