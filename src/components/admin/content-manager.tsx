import { createClient } from '@/lib/supabase/server';
import { ContentManagerClient } from './content-manager-client';

export interface Field {
  name: string;
  label: string;
  type?: 'text' | 'textarea' | 'url';
}

interface Props {
  table: string;
  title: string;
  fields: Field[];
  titleKey?: string;
}

const TABLES_WITHOUT_STATUS = new Set(['categories', 'tags']);

/**
 * Reusable content manager: list rows with publish/draft, duplicate and delete
 * controls, plus an inline create/edit form. Powers every admin manager.
 */
export async function ContentManager({ table, title, fields, titleKey = 'title' }: Props) {
  let rows: Record<string, unknown>[] = [];
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const supabase = await createClient();
    const { data } = await supabase.from(table).select('*').order('created_at', { ascending: false });
    rows = (data as Record<string, unknown>[]) ?? [];
  }

  return (
    <section>
      <h1 className="text-2xl font-bold text-white">{title}</h1>
      <ContentManagerClient table={table} fields={fields} rows={rows} titleKey={titleKey} hasStatus={!TABLES_WITHOUT_STATUS.has(table)} />
    </section>
  );
}
