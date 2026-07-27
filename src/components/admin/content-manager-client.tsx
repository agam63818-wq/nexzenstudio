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
  categoriesForSelect?: { value: string; label: string }[];
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

function isValidUrl(string: string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

function getFaviconUrl(url: string) {
  try {
    const parsed = new URL(url);
    return `https://www.google.com/s2/favicons?domain=${parsed.hostname}&sz=64`;
  } catch {
    return '';
  }
}

function UrlPreview({ url }: { url: string }) {
  const [valid, setValid] = useState(false);
  const [favicon, setFavicon] = useState('');

  useEffect(() => {
    if (url && isValidUrl(url)) {
      setValid(true);
      setFavicon(getFaviconUrl(url));
    } else {
      setValid(false);
      setFavicon('');
    }
  }, [url]);

  if (!url) return null;

  return (
    <div className="flex items-center gap-2 mt-1">
      {valid ? (
        <>
          {favicon && <img src={favicon} alt="" className="w-4 h-4 rounded" />}
          <span className="text-xs text-emerald-400">✓ Valid URL</span>
        </>
      ) : (
        <span className="text-xs text-red-400">✗ Invalid URL format</span>
      )}
    </div>
  );
}

export function ContentManagerClient({ table, fields, rows, titleKey, hasStatus, categoriesForSelect = [] }: Props) {
  const [editingRow, setEditingRow] = useState<Record<string, unknown> | null>(null);
  const [formState, setFormState] = useState<ActionResult>(initialState);
  const [toast, setToast] = useState<ActionResult | null>(null);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const [urlValues, setUrlValues] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState<string>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

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
      setUrlValues({});
    }
  }

  function runAction(action: () => Promise<ActionResult>) {
    startTransition(async () => {
      const result = await action();
      setToast(result);
    });
  }

  const formKey = useMemo(() => (editingId ? `edit-${editingId}` : 'create'), [editingId]);

  // Filter and sort rows for table view
  const filteredAndSortedRows = useMemo(() => {
    let result = [...rows];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(row => {
        const titleValue = row[titleKey];
        const nameValue = row['name'];
        return (
          (titleValue && String(titleValue).toLowerCase().includes(query)) ||
          (nameValue && String(nameValue).toLowerCase().includes(query))
        );
      });
    }
    
    // Sort by column
    result.sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];
      
      if (aVal === undefined || bVal === undefined) return 0;
      
      let comparison = 0;
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        comparison = aVal.localeCompare(bVal);
      } else if (typeof aVal === 'number' && typeof bVal === 'number') {
        comparison = aVal - bVal;
      } else {
        comparison = String(aVal).localeCompare(String(bVal));
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    
    return result;
  }, [rows, searchQuery, sortColumn, sortDirection, titleKey]);

  function handleSort(column: string) {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  }

  function SortIcon({ column }: { column: string }) {
    if (sortColumn !== column) return <span className="text-slate-600 ml-1">⇅</span>;
    return <span className="text-white ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>;
  }

  return (
    <>
      <Toast toast={toast} />
      
      {/* Search box */}
      <div className="mb-4">
        <input
          type="text"
          placeholder={`Search by ${titleKey}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-md rounded-lg bg-black/30 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500 border border-white/10"
        />
      </div>

      <form key={formKey} ref={formRef} action={submitForm} className="mt-6 grid gap-3 rounded-2xl glass p-5">
        {formState.message && !formState.ok && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200" role="alert">
            {formState.message}
          </div>
        )}
        {editingId && <input type="hidden" name="id" value={editingId} />}
        {fields.map((f) => {
          const defaultValue = valueForInput(editingRow?.[f.name]);
          const isUrlField = f.type === 'url' || f.name.includes('_url') || f.name === 'website';
          
          // Handle select fields with category options
          if (f.type === 'select' && f.fetchOptionsFromTable === 'categories') {
            return (
              <div key={f.name} className="grid gap-1">
                <label className="text-sm text-slate-300">
                  {f.label}
                  {f.required && <span className="text-red-400 ml-1">*</span>}
                </label>
                <select 
                  name={f.name} 
                  defaultValue={defaultValue}
                  className="rounded-lg bg-black/30 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500 border border-white/10"
                >
                  <option value="">Select {f.label}</option>
                  {categoriesForSelect.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                {f.helperText && <p className="text-xs text-slate-500">{f.helperText}</p>}
              </div>
            );
          }
          
          if (f.type === 'textarea') {
            return (
              <div key={f.name} className="grid gap-1">
                <label className="text-sm text-slate-300">
                  {f.label}
                  {f.required && <span className="text-red-400 ml-1">*</span>}
                </label>
                <textarea 
                  name={f.name} 
                  defaultValue={defaultValue} 
                  placeholder={f.placeholder || f.label} 
                  rows={4} 
                  className="rounded-lg bg-black/30 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500 border border-white/10" 
                />
                {f.helperText && <p className="text-xs text-slate-500">{f.helperText}</p>}
              </div>
            );
          }
          
          if (f.type === 'number') {
            return (
              <div key={f.name} className="grid gap-1">
                <label className="text-sm text-slate-300">
                  {f.label}
                  {f.required && <span className="text-red-400 ml-1">*</span>}
                </label>
                <input 
                  key={f.name} 
                  name={f.name} 
                  defaultValue={defaultValue} 
                  type="number" 
                  min={f.min}
                  max={f.max}
                  step={f.step}
                  placeholder={f.placeholder || f.label} 
                  className="rounded-lg bg-black/30 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500 border border-white/10" 
                />
                {f.helperText && <p className="text-xs text-slate-500">{f.helperText}</p>}
              </div>
            );
          }
          
          // URL field with preview
          if (isUrlField) {
            return (
              <div key={f.name} className="grid gap-1">
                <label className="text-sm text-slate-300">
                  {f.label}
                  {f.required && <span className="text-red-400 ml-1">*</span>}
                </label>
                <input 
                  key={f.name} 
                  name={f.name} 
                  defaultValue={defaultValue} 
                  type="url" 
                  placeholder={f.placeholder || f.label} 
                  className={`rounded-lg bg-black/30 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500 border ${defaultValue && !isValidUrl(defaultValue) ? 'border-red-500' : 'border-white/10'}`}
                  onChange={(e) => setUrlValues(prev => ({ ...prev, [f.name]: e.target.value }))}
                />
                <UrlPreview url={urlValues[f.name] || defaultValue} />
                {f.helperText && <p className="text-xs text-slate-500">{f.helperText}</p>}
              </div>
            );
          }
          
          // Default text input
          return (
            <div key={f.name} className="grid gap-1">
              <label className="text-sm text-slate-300">
                {f.label}
                {f.required && <span className="text-red-400 ml-1">*</span>}
              </label>
              <input 
                key={f.name} 
                name={f.name} 
                defaultValue={defaultValue} 
                type="text" 
                placeholder={f.placeholder || f.label} 
                className="rounded-lg bg-black/30 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500 border border-white/10" 
              />
              {f.helperText && <p className="text-xs text-slate-500">{f.helperText}</p>}
            </div>
          );
        })}
        <div className="flex flex-wrap gap-2">
          <button disabled={isPending} className="tap-target justify-self-start rounded-lg bg-neon-gradient px-5 text-sm font-semibold text-white disabled:opacity-60">{buttonText}</button>
          {editingRow && (
            <button type="button" onClick={() => { setEditingRow(null); setFormState(initialState); setUrlValues({}); }} className="tap-target rounded-lg border border-white/15 px-5 text-sm font-semibold text-white hover:bg-white/10">Cancel</button>
          )}
        </div>
      </form>

      {/* Table View */}
      <div className="mt-6 overflow-x-auto rounded-2xl glass">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/10">
            <tr>
              <th className="px-4 py-3 font-medium text-white cursor-pointer hover:bg-white/5" onClick={() => handleSort(titleKey)}>
                {titleKey === 'title' ? 'Title' : titleKey}{SortIcon(titleKey)}
              </th>
              {hasStatus && (
                <th className="px-4 py-3 font-medium text-white cursor-pointer hover:bg-white/5" onClick={() => handleSort('status')}>
                  Status{SortIcon('status')}
                </th>
              )}
              <th className="px-4 py-3 font-medium text-white cursor-pointer hover:bg-white/5" onClick={() => handleSort('created_at')}>
                Created{SortIcon('created_at')}
              </th>
              <th className="px-4 py-3 font-medium text-white text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedRows.length === 0 && (
              <tr>
                <td colSpan={hasStatus ? 4 : 3} className="px-4 py-8 text-center text-slate-500">
                  {searchQuery ? 'No matching results' : 'No rows yet.'}
                </td>
              </tr>
            )}
            {filteredAndSortedRows.map((r) => {
              const id = String(r.id);
              const status = (r.status as string) ?? 'draft';
              const createdAt = r.created_at ? new Date(r.created_at as string).toLocaleDateString() : '-';
              return (
                <tr key={id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-white truncate max-w-xs">{String(r[titleKey] ?? '(untitled)')}</p>
                  </td>
                  {hasStatus && (
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${status === 'published' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
                        {status}
                      </span>
                    </td>
                  )}
                  <td className="px-4 py-3 text-slate-400">{createdAt}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      {hasStatus && (
                        <button 
                          disabled={isPending} 
                          onClick={() => runAction(() => setStatus(table, id, status === 'published' ? 'draft' : 'published'))} 
                          className={`tap-target rounded-lg border px-3 py-1 text-xs transition-colors ${status === 'published' ? 'border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10' : 'border-amber-500/30 text-amber-300 hover:bg-amber-500/10'} disabled:opacity-60`}
                        >
                          {status === 'published' ? 'Unpublish' : 'Publish'}
                        </button>
                      )}
                      <button 
                        onClick={() => { setEditingRow(r); setFormState(initialState); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                        className="tap-target rounded-lg border border-white/15 px-3 py-1 text-xs text-white hover:bg-white/10 transition-colors"
                      >
                        Edit
                      </button>
                      <button 
                        disabled={isPending} 
                        onClick={() => runAction(() => duplicateRow(table, id))} 
                        className="tap-target rounded-lg border border-white/15 px-3 py-1 text-xs text-white hover:bg-white/10 disabled:opacity-60 transition-colors"
                      >
                        Duplicate
                      </button>
                      <button 
                        disabled={isPending} 
                        onClick={() => runAction(() => deleteRow(table, id))} 
                        className="tap-target rounded-lg border border-red-500/30 px-3 py-1 text-xs text-red-300 hover:bg-red-500/10 disabled:opacity-60 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
