'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, Check, Link2, ImageOff } from 'lucide-react';
import type { Field, SelectOption } from './field-types';
import { isValidUrl, faviconFor } from './field-types';

const BASE_INPUT =
  'w-full rounded-lg border bg-black/30 px-3 py-2.5 text-sm text-white outline-none transition ' +
  'placeholder:text-slate-600 focus:ring-2 focus:ring-neon-purple/40';

const OK_BORDER = 'border-white/10 focus:border-neon-purple/60';
const BAD_BORDER = 'border-red-500/60 focus:border-red-500';

interface Props {
  field: Field;
  /** Value when editing an existing row. */
  defaultValue?: unknown;
  /** Live category options for `categoryKind` selects. */
  categoryOptions?: SelectOption[];
  /** Bubble the current title up so the slug field can auto-fill. */
  onTitleChange?: (value: string) => void;
  /** Externally driven value (used for auto-slug). */
  syncedValue?: string;
}

/** Small grey hint line rendered under every control. */
function Hint({ children }: { children?: string }) {
  if (!children) return null;
  return <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{children}</p>;
}

function Label({ field }: { field: Field }) {
  return (
    <label htmlFor={field.name} className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300">
      {field.label}
      {field.required ? (
        <span aria-hidden className="text-red-400" title="Required">
          *
        </span>
      ) : (
        <span className="rounded bg-white/5 px-1.5 py-0.5 text-[9px] font-medium normal-case tracking-normal text-slate-500">
          optional
        </span>
      )}
    </label>
  );
}

/** Live thumbnail / favicon shown beside a URL input once it parses. */
function UrlPreview({ value, mode }: { value: string; mode: 'image' | 'favicon' }) {
  const [broken, setBroken] = useState(false);

  useEffect(() => {
    setBroken(false);
  }, [value]);

  if (!value || !isValidUrl(value)) {
    return (
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-dashed border-white/10 bg-black/20 text-slate-700">
        <Link2 size={16} />
      </div>
    );
  }

  const src = mode === 'favicon' ? faviconFor(value) : value;
  if (!src || broken) {
    return (
      <div
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-black/20 text-slate-600"
        title="Preview unavailable"
      >
        <ImageOff size={16} />
      </div>
    );
  }

  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={src}
      alt="Preview"
      onError={() => setBroken(true)}
      className="h-14 w-14 shrink-0 rounded-lg border border-white/10 bg-black/30 object-cover"
    />
  );
}

export function FieldInput({ field, defaultValue, categoryOptions, onTitleChange, syncedValue }: Props) {
  const initial =
    defaultValue === null || defaultValue === undefined
      ? ''
      : Array.isArray(defaultValue)
        ? defaultValue.join(', ')
        : String(defaultValue);

  const [value, setValue] = useState(initial);
  const [touched, setTouched] = useState(false);

  // Reset when the edited record changes.
  useEffect(() => {
    setValue(initial);
    setTouched(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValue]);

  // Auto-fill the slug from the title unless the admin typed one.
  useEffect(() => {
    if (field.type === 'slug' && syncedValue !== undefined && !touched) {
      setValue(syncedValue);
    }
  }, [syncedValue, field.type, touched]);

  const isUrlField = field.type === 'url';
  const urlInvalid = isUrlField && touched && value.length > 0 && !isValidUrl(value);
  const urlValid = isUrlField && value.length > 0 && isValidUrl(value);

  const numberInvalid =
    field.type === 'number' &&
    touched &&
    value !== '' &&
    (Number.isNaN(Number(value)) ||
      (field.min !== undefined && Number(value) < field.min) ||
      (field.max !== undefined && Number(value) > field.max));

  const invalid = urlInvalid || numberInvalid;
  const border = invalid ? BAD_BORDER : OK_BORDER;

  function update(next: string) {
    setValue(next);
    setTouched(true);
    if (onTitleChange) onTitleChange(next);
  }

  /* ── Boolean ─────────────────────────────────────────────────────── */
  if (field.type === 'boolean') {
    const checked = value === 'true' || value === 'on';
    return (
      <div className={field.full ? 'sm:col-span-2' : ''}>
        <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-white/10 bg-black/20 px-3 py-3 transition hover:border-white/20">
          <input
            type="checkbox"
            id={field.name}
            name={field.name}
            value="true"
            checked={checked}
            onChange={(e) => update(e.target.checked ? 'true' : 'false')}
            className="h-4 w-4 shrink-0 accent-neon-purple"
          />
          <span className="text-sm font-medium text-white">{field.label}</span>
        </label>
        <Hint>{field.hint}</Hint>
      </div>
    );
  }

  /* ── Select (static options or live categories) ──────────────────── */
  if (field.type === 'select' || field.categoryKind) {
    const options = field.categoryKind ? (categoryOptions ?? []) : (field.options ?? []);

    // No categories seeded yet → degrade to a free-text input rather than an
    // empty, unusable dropdown.
    if (field.categoryKind && options.length === 0) {
      return (
        <div className={field.full ? 'sm:col-span-2' : ''}>
          <Label field={field} />
          <input
            id={field.name}
            name={field.name}
            value={value}
            onChange={(e) => update(e.target.value)}
            placeholder={field.placeholder ?? 'e.g. Productivity'}
            className={`mt-1.5 ${BASE_INPUT} ${OK_BORDER}`}
          />
          <Hint>
            {`${field.hint ?? ''} No categories exist for this section yet — add some under Categories to get a dropdown here.`.trim()}
          </Hint>
        </div>
      );
    }

    return (
      <div className={field.full ? 'sm:col-span-2' : ''}>
        <Label field={field} />
        <select
          id={field.name}
          name={field.name}
          value={value}
          required={field.required}
          onChange={(e) => update(e.target.value)}
          className={`mt-1.5 ${BASE_INPUT} ${OK_BORDER} appearance-none`}
        >
          <option value="" className="bg-space-950">
            — Select {field.label.toLowerCase()} —
          </option>
          {options.map((o) => (
            <option key={o.value} value={o.value} className="bg-space-950">
              {o.label}
            </option>
          ))}
        </select>
        <Hint>{field.hint}</Hint>
      </div>
    );
  }

  /* ── Textarea / markdown ─────────────────────────────────────────── */
  if (field.type === 'textarea' || field.type === 'markdown') {
    return (
      <div className="sm:col-span-2">
        <div className="flex items-baseline justify-between gap-3">
          <Label field={field} />
          {field.maxLength && (
            <span className={`text-[10px] ${value.length > field.maxLength ? 'text-red-400' : 'text-slate-600'}`}>
              {value.length}/{field.maxLength}
            </span>
          )}
        </div>
        <textarea
          id={field.name}
          name={field.name}
          value={value}
          required={field.required}
          rows={field.rows ?? (field.type === 'markdown' ? 10 : 4)}
          placeholder={field.placeholder}
          onChange={(e) => update(e.target.value)}
          className={`mt-1.5 ${BASE_INPUT} ${OK_BORDER} resize-y font-normal leading-relaxed`}
        />
        <Hint>{field.hint}</Hint>
      </div>
    );
  }

  /* ── URL with live preview + inline validation ───────────────────── */
  if (isUrlField) {
    return (
      <div className={field.full ? 'sm:col-span-2' : ''}>
        <Label field={field} />
        <div className="mt-1.5 flex items-start gap-3">
          <UrlPreview value={value} mode={field.preview ?? 'favicon'} />
          <div className="min-w-0 flex-1">
            <div className="relative">
              <input
                id={field.name}
                name={field.name}
                type="url"
                inputMode="url"
                value={value}
                required={field.required}
                placeholder={field.placeholder ?? 'https://…'}
                onChange={(e) => update(e.target.value)}
                onBlur={() => setTouched(true)}
                className={`${BASE_INPUT} ${border} pr-9`}
              />
              {urlValid && (
                <Check size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400" />
              )}
              {urlInvalid && (
                <AlertCircle size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-red-400" />
              )}
            </div>
            {urlInvalid ? (
              <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-400">
                <AlertCircle size={12} /> Not a valid URL — it must start with http:// or https://
              </p>
            ) : (
              <Hint>{field.hint}</Hint>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ── Number ──────────────────────────────────────────────────────── */
  if (field.type === 'number') {
    return (
      <div className={field.full ? 'sm:col-span-2' : ''}>
        <Label field={field} />
        <input
          id={field.name}
          name={field.name}
          type="number"
          value={value}
          required={field.required}
          min={field.min}
          max={field.max}
          step={field.step ?? 1}
          placeholder={field.placeholder}
          onChange={(e) => update(e.target.value)}
          onBlur={() => setTouched(true)}
          className={`mt-1.5 ${BASE_INPUT} ${border}`}
        />
        {numberInvalid ? (
          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-400">
            <AlertCircle size={12} /> Enter a number
            {field.min !== undefined && field.max !== undefined ? ` between ${field.min} and ${field.max}` : ''}.
          </p>
        ) : (
          <Hint>{field.hint}</Hint>
        )}
      </div>
    );
  }

  /* ── Datetime ────────────────────────────────────────────────────── */
  if (field.type === 'datetime') {
    return (
      <div className={field.full ? 'sm:col-span-2' : ''}>
        <Label field={field} />
        <input
          id={field.name}
          name={field.name}
          type="datetime-local"
          value={value ? value.slice(0, 16) : ''}
          onChange={(e) => update(e.target.value)}
          className={`mt-1.5 ${BASE_INPUT} ${OK_BORDER} [color-scheme:dark]`}
        />
        <Hint>{field.hint}</Hint>
      </div>
    );
  }

  /* ── Tags / comma-separated list ─────────────────────────────────── */
  if (field.type === 'tags' || field.type === 'list') {
    const chips = value
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    return (
      <div className="sm:col-span-2">
        <Label field={field} />
        <input
          id={field.name}
          name={field.name}
          value={value}
          placeholder={field.placeholder ?? 'design, ai, workflow'}
          onChange={(e) => update(e.target.value)}
          className={`mt-1.5 ${BASE_INPUT} ${OK_BORDER}`}
        />
        {chips.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {chips.map((c, i) => (
              <span
                key={`${c}-${i}`}
                className="rounded-full border border-neon-purple/30 bg-neon-purple/10 px-2 py-0.5 text-[11px] text-neon-purple"
              >
                {c}
              </span>
            ))}
          </div>
        )}
        <Hint>{field.hint}</Hint>
      </div>
    );
  }

  /* ── Plain text / slug / email ───────────────────────────────────── */
  return (
    <div className={field.full ? 'sm:col-span-2' : ''}>
      <Label field={field} />
      <input
        id={field.name}
        name={field.name}
        type={field.type === 'email' ? 'email' : 'text'}
        value={value}
        required={field.required}
        maxLength={field.maxLength}
        placeholder={field.placeholder}
        onChange={(e) => update(e.target.value)}
        className={`mt-1.5 ${BASE_INPUT} ${OK_BORDER} ${field.type === 'slug' ? 'font-mono' : ''}`}
      />
      <Hint>{field.hint}</Hint>
    </div>
  );
}
