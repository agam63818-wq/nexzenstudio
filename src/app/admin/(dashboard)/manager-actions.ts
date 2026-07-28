'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { slugify } from '@/components/admin/field-types';

/** Result of every mutating action, so the UI can surface real DB errors. */
export interface ActionResult {
  ok: boolean;
  message?: string;
}

function errorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'message' in error) return String(error.message);
  if (error instanceof Error) return error.message;
  return 'Unknown error';
}

/** Fail loudly (and legibly) when Supabase isn't configured. */
async function getSupabase() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error('Supabase environment variables are not configured.');
  }
  return createClient();
}

/** Admin route segment for each managed table (used for revalidation). */
const ROUTE_FOR_TABLE: Record<string, string> = {
  prompts: 'prompts',
  image_prompts: 'images',
  video_prompts: 'videos',
  games: 'games',
  apks: 'apks',
  blogs: 'blogs',
  resources: 'resources',
  categories: 'categories',
  tags: 'tags',
  tools: 'tools',
  gallery: 'gallery',
  comments: 'comments',
  settings: 'settings',
};

/** Public-facing route that should be refreshed when a table changes. */
const PUBLIC_PATH_FOR_TABLE: Record<string, string> = {
  prompts: '/prompts',
  image_prompts: '/images',
  video_prompts: '/videos',
  games: '/games',
  apks: '/apks',
  blogs: '/blog',
  resources: '/resources',
  tools: '/tools',
  gallery: '/gallery',
};

function refresh(table: string) {
  const segment = ROUTE_FOR_TABLE[table] ?? table;
  revalidatePath(`/admin/${segment}`);
  const publicPath = PUBLIC_PATH_FOR_TABLE[table];
  if (publicPath) revalidatePath(publicPath);
}

/**
 * Rebuild a DB payload from the submitted form.
 *
 * The form ships hidden `__array`, `__number` and `__bool` descriptors listing
 * which columns need coercion, so a single generic action can serve every
 * section without the server guessing at column types.
 */
function buildPayload(formData: FormData) {
  const csv = (key: string) =>
    String(formData.get(key) ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

  const arrayCols = new Set(csv('__array'));
  const numberCols = new Set(csv('__number'));
  const boolCols = new Set(csv('__bool'));

  const payload: Record<string, unknown> = {};

  for (const [key, raw] of formData.entries()) {
    if (key === 'id' || key.startsWith('__')) continue;
    if (typeof raw !== 'string') continue;

    const value = raw.trim();

    if (arrayCols.has(key)) {
      const items = value
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
      payload[key] = items;
      continue;
    }

    if (numberCols.has(key)) {
      if (value === '') {
        payload[key] = null;
      } else {
        const n = Number(value);
        payload[key] = Number.isFinite(n) ? n : null;
      }
      continue;
    }

    if (boolCols.has(key)) {
      payload[key] = value === 'on' || value === 'true';
      continue;
    }

    payload[key] = value === '' ? null : value;
  }

  // Unchecked checkboxes never appear in FormData — default them to false.
  for (const col of boolCols) {
    if (!(col in payload)) payload[col] = false;
  }

  return payload;
}

export async function saveRow(table: string, formData: FormData): Promise<ActionResult> {
  try {
    const supabase = await getSupabase();
    const id = (formData.get('id') as string | null)?.trim() || null;

    const payload = buildPayload(formData);

    // Auto-generate a slug from the title/name when the section has that column
    // and the admin left it blank.
    if ('slug' in payload && !payload.slug) {
      const base = (payload.title ?? payload.name) as string | undefined;
      if (base) payload.slug = slugify(base);
    }
    if (payload.slug === null) delete payload.slug;

    const { error } = id
      ? await supabase.from(table).update(payload).eq('id', id)
      : await supabase.from(table).insert(payload);

    if (error) throw error;

    refresh(table);
    return { ok: true, message: id ? 'Changes saved.' : 'Draft created.' };
  } catch (error) {
    console.error(`Failed to save row in ${table}:`, error);
    return { ok: false, message: `Save failed: ${errorMessage(error)}` };
  }
}

export async function deleteRow(table: string, id: string): Promise<ActionResult> {
  try {
    const supabase = await getSupabase();
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) throw error;
    refresh(table);
    return { ok: true, message: 'Deleted.' };
  } catch (error) {
    console.error(`Failed to delete row from ${table}:`, error);
    return { ok: false, message: `Delete failed: ${errorMessage(error)}` };
  }
}

/**
 * Publish / unpublish a row.
 *
 * `published_at` now exists on every content table, so publishing stamps it
 * and unpublishing clears it. Tables without a `status` column (categories,
 * tags) are never routed here by the UI.
 */
export async function setStatus(table: string, id: string, status: string): Promise<ActionResult> {
  try {
    const supabase = await getSupabase();

    const patch: Record<string, unknown> = { status };
    patch.published_at = status === 'published' ? new Date().toISOString() : null;

    const { error } = await supabase.from(table).update(patch).eq('id', id);

    // Defensive fallback: if a table somehow still lacks published_at, retry
    // with the status alone so publishing never hard-fails for the admin.
    if (error) {
      const { error: retryError } = await supabase.from(table).update({ status }).eq('id', id);
      if (retryError) throw retryError;
      console.warn(`${table}.published_at missing — published with status only.`);
    }

    refresh(table);
    return { ok: true, message: status === 'published' ? 'Published.' : 'Moved back to draft.' };
  } catch (error) {
    console.error(`Failed to update status in ${table}:`, error);
    return { ok: false, message: `Status update failed: ${errorMessage(error)}` };
  }
}

export async function duplicateRow(table: string, id: string): Promise<ActionResult> {
  try {
    const supabase = await getSupabase();
    const { data, error: selectError } = await supabase.from(table).select('*').eq('id', id).maybeSingle();
    if (selectError) throw selectError;
    if (!data) return { ok: false, message: 'Duplicate failed: row was not found.' };

    const row = { ...(data as Record<string, unknown>) };
    delete row.id;
    delete row.created_at;
    delete row.updated_at;

    if ('status' in row) row.status = 'draft';
    if ('published_at' in row) row.published_at = null;
    if (typeof row.slug === 'string') row.slug = `${row.slug}-copy-${Date.now()}`;
    if (typeof row.title === 'string') row.title = `${row.title} (copy)`;
    if (typeof row.name === 'string' && !('title' in row)) row.name = `${row.name} (copy)`;

    const { error } = await supabase.from(table).insert(row);
    if (error) throw error;

    refresh(table);
    return { ok: true, message: 'Duplicated as a new draft.' };
  } catch (error) {
    console.error(`Failed to duplicate row in ${table}:`, error);
    return { ok: false, message: `Duplicate failed: ${errorMessage(error)}` };
  }
}

/** Approve a comment (comments use a boolean flag rather than a status). */
export async function approveComment(id: string): Promise<ActionResult> {
  try {
    const supabase = await getSupabase();
    const { error } = await supabase.from('comments').update({ approved: true, is_spam: false }).eq('id', id);
    if (error) throw error;
    revalidatePath('/admin/comments');
    return { ok: true, message: 'Comment approved.' };
  } catch (error) {
    console.error('Failed to approve comment:', error);
    return { ok: false, message: `Approve failed: ${errorMessage(error)}` };
  }
}

/** Flag a comment as spam. */
export async function markSpam(id: string): Promise<ActionResult> {
  try {
    const supabase = await getSupabase();
    const { error } = await supabase.from('comments').update({ is_spam: true, approved: false }).eq('id', id);
    if (error) throw error;
    revalidatePath('/admin/comments');
    return { ok: true, message: 'Marked as spam.' };
  } catch (error) {
    console.error('Failed to mark comment as spam:', error);
    return { ok: false, message: `Mark spam failed: ${errorMessage(error)}` };
  }
}
