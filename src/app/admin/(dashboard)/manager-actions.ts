'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export interface ActionResult {
  ok: boolean;
  message?: string;
}

function slugify(input: string) {
  return input.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function errorMessage(error: unknown) {
  if (error && typeof error === 'object' && 'message' in error) return String(error.message);
  if (error instanceof Error) return error.message;
  return 'Unknown error';
}

async function getSupabase() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error('Supabase environment variables are not configured.');
  }
  return createClient();
}

export async function saveRow(table: string, formData: FormData): Promise<ActionResult> {
  try {
    const supabase = await getSupabase();
    const id = formData.get('id') as string | null;

    const payload: Record<string, unknown> = {};
    for (const [key, value] of formData.entries()) {
      if (key === 'id') continue;
      if (key === 'tags') {
        payload[key] = String(value).split(',').map((t) => t.trim()).filter(Boolean);
      } else {
        payload[key] = value === '' ? null : value;
      }
    }

    if (!payload.slug) {
      const base = (payload.title ?? payload.name) as string | undefined;
      if (base) payload.slug = slugify(base);
    }

    const { error } = id
      ? await supabase.from(table).update(payload).eq('id', id)
      : await supabase.from(table).insert(payload);

    if (error) throw error;

    revalidatePath(`/admin/${table}`);
    return { ok: true, message: id ? 'Row updated successfully.' : 'Draft created successfully.' };
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
    revalidatePath(`/admin/${table}`);
    return { ok: true, message: 'Row deleted successfully.' };
  } catch (error) {
    console.error(`Failed to delete row from ${table}:`, error);
    return { ok: false, message: `Delete failed: ${errorMessage(error)}` };
  }
}

export async function setStatus(table: string, id: string, status: string): Promise<ActionResult> {
  try {
    const supabase = await getSupabase();
    const patch: Record<string, unknown> = { status };
    if (status === 'published') patch.published_at = new Date().toISOString();
    const { error } = await supabase.from(table).update(patch).eq('id', id);
    if (error) throw error;
    revalidatePath(`/admin/${table}`);
    return { ok: true, message: status === 'published' ? 'Row published successfully.' : 'Row unpublished successfully.' };
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
    const row = data as Record<string, unknown>;
    delete row.id;
    delete row.created_at;
    if ('status' in row) row.status = 'draft';
    if (typeof row.slug === 'string') row.slug = `${row.slug}-copy-${Date.now()}`;
    const { error } = await supabase.from(table).insert(row);
    if (error) throw error;
    revalidatePath(`/admin/${table}`);
    return { ok: true, message: 'Row duplicated successfully.' };
  } catch (error) {
    console.error(`Failed to duplicate row in ${table}:`, error);
    return { ok: false, message: `Duplicate failed: ${errorMessage(error)}` };
  }
}
