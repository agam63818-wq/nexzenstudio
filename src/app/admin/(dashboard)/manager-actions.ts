'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

function slugify(input: string) {
  return input.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export async function saveRow(table: string, formData: FormData) {
  const supabase = await createClient();
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

  if (id) {
    await supabase.from(table).update(payload).eq('id', id);
  } else {
    await supabase.from(table).insert(payload);
  }

  revalidatePath(`/admin/${table}`);
}

export async function deleteRow(table: string, id: string) {
  const supabase = await createClient();
  await supabase.from(table).delete().eq('id', id);
  revalidatePath(`/admin/${table}`);
}

export async function setStatus(table: string, id: string, status: string) {
  const supabase = await createClient();
  const patch: Record<string, unknown> = { status };
  if (status === 'published') patch.published_at = new Date().toISOString();
  await supabase.from(table).update(patch).eq('id', id);
  revalidatePath(`/admin/${table}`);
}

export async function duplicateRow(table: string, id: string) {
  const supabase = await createClient();
  const { data } = await supabase.from(table).select('*').eq('id', id).maybeSingle();
  if (!data) return;
  const row = data as Record<string, unknown>;
  delete row.id;
  delete row.created_at;
  row.status = 'draft';
  if (typeof row.slug === 'string') row.slug = `${row.slug}-copy-${Date.now()}`;
  await supabase.from(table).insert(row);
  revalidatePath(`/admin/${table}`);
}
