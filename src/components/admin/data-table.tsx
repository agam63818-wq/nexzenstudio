'use client';

import { useMemo, useState } from 'react';
import {
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Pencil,
  Copy,
  Trash2,
  Eye,
  EyeOff,
  Inbox,
} from 'lucide-react';

export interface Row {
  id: string;
  title: string;
  status: string | null;
  createdAt: string | null;
  /** Extra column shown between title and status (e.g. tool, category). */
  badge?: string | null;
  /** Thumbnail URL when the row has an image column. */
  thumb?: string | null;
  /** Full record so Edit can rehydrate the form. */
  raw: Record<string, unknown>;
}

type SortKey = 'title' | 'status' | 'createdAt';
type SortDir = 'asc' | 'desc';

interface Props {
  rows: Row[];
  /** Section label used in empty states, e.g. "prompts". */
  label: string;
  /** Whether the table has a status column (categories/tags do not). */
  hasStatus?: boolean;
  /** Header for the optional badge column. */
  badgeLabel?: string;
  onEdit: (row: Row) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, next: 'published' | 'draft') => void;
  /** id currently mutating — disables its action buttons. */
  pendingId?: string | null;
}

function fmtDate(value: string | null) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
}

function StatusPill({ status }: { status: string | null }) {
  const published = status === 'published';
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
        published
          ? 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30'
          : 'bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30'
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${published ? 'bg-emerald-400' : 'bg-amber-400'}`} />
      {published ? 'Published' : 'Draft'}
    </span>
  );
}

function IconBtn({
  title,
  onClick,
  disabled,
  danger,
  children,
}: {
  title: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border transition disabled:opacity-40 ${
        danger
          ? 'border-red-500/25 text-red-300 hover:bg-red-500/10 hover:border-red-500/50'
          : 'border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
      }`}
    >
      {children}
    </button>
  );
}

export function DataTable({
  rows,
  label,
  hasStatus = true,
  badgeLabel,
  onEdit,
  onDuplicate,
  onDelete,
  onToggleStatus,
  pendingId,
}: Props) {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [sortKey, setSortKey] = useState<SortKey>('createdAt');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();

    const filtered = rows.filter((r) => {
      if (statusFilter !== 'all' && (r.status ?? 'draft') !== statusFilter) return false;
      if (!q) return true;
      return (
        r.title.toLowerCase().includes(q) ||
        (r.badge ?? '').toLowerCase().includes(q)
      );
    });

    const dir = sortDir === 'asc' ? 1 : -1;
    return [...filtered].sort((a, b) => {
      if (sortKey === 'title') return a.title.localeCompare(b.title) * dir;
      if (sortKey === 'status') return (a.status ?? '').localeCompare(b.status ?? '') * dir;
      return ((new Date(a.createdAt ?? 0).getTime() || 0) - (new Date(b.createdAt ?? 0).getTime() || 0)) * dir;
    });
  }, [rows, query, statusFilter, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir(key === 'createdAt' ? 'desc' : 'asc');
    }
  }

  function SortHeader({ label: text, sortKeyName, className }: { label: string; sortKeyName: SortKey; className?: string }) {
    const active = sortKey === sortKeyName;
    const Icon = !active ? ArrowUpDown : sortDir === 'asc' ? ArrowUp : ArrowDown;
    return (
      <th className={`px-4 py-3 text-left ${className ?? ''}`}>
        <button
          type="button"
          onClick={() => toggleSort(sortKeyName)}
          className={`inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider transition hover:text-white ${
            active ? 'text-white' : 'text-slate-400'
          }`}
        >
          {text}
          <Icon size={12} />
        </button>
      </th>
    );
  }

  const publishedCount = rows.filter((r) => r.status === 'published').length;

  return (
    <div className="rounded-2xl glass">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 border-b border-white/10 p-4">
        <div className="relative min-w-0 flex-1 sm:max-w-xs">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${label}…`}
            aria-label={`Search ${label}`}
            className="w-full rounded-lg border border-white/10 bg-black/30 py-2.5 pl-9 pr-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-neon-purple/60 focus:ring-2 focus:ring-neon-purple/30"
          />
        </div>

        {hasStatus && (
          <div className="flex rounded-lg border border-white/10 bg-black/20 p-0.5">
            {(['all', 'published', 'draft'] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatusFilter(s)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize transition ${
                  statusFilter === s ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <p className="ml-auto shrink-0 text-xs text-slate-500">
          {visible.length} of {rows.length}
          {hasStatus && ` · ${publishedCount} published`}
        </p>
      </div>

      {/* Table */}
      {visible.length === 0 ? (
        <div className="flex flex-col items-center gap-2 p-12 text-center">
          <Inbox size={28} className="text-slate-700" />
          <p className="text-sm text-slate-400">
            {rows.length === 0 ? `No ${label} yet.` : `No ${label} match your search.`}
          </p>
          <p className="text-xs text-slate-600">
            {rows.length === 0 ? 'Use the form above to create your first entry.' : 'Try a different keyword or clear the status filter.'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02]">
                <SortHeader label="Title" sortKeyName="title" />
                {badgeLabel && (
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    {badgeLabel}
                  </th>
                )}
                {hasStatus && <SortHeader label="Status" sortKeyName="status" className="w-36" />}
                <SortHeader label="Created" sortKeyName="createdAt" className="w-36" />
                <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {visible.map((r) => {
                const busy = pendingId === r.id;
                const published = r.status === 'published';
                return (
                  <tr key={r.id} className="border-b border-white/5 transition hover:bg-white/[0.03]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {r.thumb ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img src={r.thumb} alt="" className="h-9 w-9 shrink-0 rounded-md border border-white/10 object-cover" />
                        ) : null}
                        <span className="line-clamp-1 font-medium text-white">{r.title}</span>
                      </div>
                    </td>
                    {badgeLabel && (
                      <td className="px-4 py-3">
                        {r.badge ? (
                          <span className="rounded-full border border-neon-blue/25 bg-neon-blue/10 px-2 py-0.5 text-[11px] text-neon-blue">
                            {r.badge}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-600">—</span>
                        )}
                      </td>
                    )}
                    {hasStatus && (
                      <td className="px-4 py-3">
                        <StatusPill status={r.status} />
                      </td>
                    )}
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-400">{fmtDate(r.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1.5">
                        {hasStatus && (
                          <IconBtn
                            title={published ? 'Unpublish' : 'Publish'}
                            disabled={busy}
                            onClick={() => onToggleStatus(r.id, published ? 'draft' : 'published')}
                          >
                            {published ? <EyeOff size={15} /> : <Eye size={15} />}
                          </IconBtn>
                        )}
                        <IconBtn title="Edit" disabled={busy} onClick={() => onEdit(r)}>
                          <Pencil size={15} />
                        </IconBtn>
                        <IconBtn title="Duplicate" disabled={busy} onClick={() => onDuplicate(r.id)}>
                          <Copy size={15} />
                        </IconBtn>
                        <IconBtn title="Delete" danger disabled={busy} onClick={() => onDelete(r.id)}>
                          <Trash2 size={15} />
                        </IconBtn>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
