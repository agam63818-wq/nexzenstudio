import { createClient } from '@/lib/supabase/server';
import { ContentManagerClient } from './content-manager-client';

export interface Field {
  name: string;
  label: string;
  type?: 'text' | 'textarea' | 'url' | 'number' | 'select';
  options?: { value: string; label: string }[];
  fetchOptionsFromTable?: string;
  filterByKind?: string;
  helperText?: string;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
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
  let categoriesForSelect: { value: string; label: string }[] = [];
  
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const supabase = await createClient();
    const { data } = await supabase.from(table).select('*').order('created_at', { ascending: false });
    rows = (data as Record<string, unknown>[]) ?? [];
    
    // Fetch categories for select fields if needed
    const hasCategoryField = fields.some(f => f.fetchOptionsFromTable === 'categories');
    if (hasCategoryField) {
      const kindFilter = fields.find(f => f.filterByKind)?.filterByKind;
      let catQuery = supabase.from('categories').select('id, name, kind');
      if (kindFilter) {
        catQuery = catQuery.eq('kind', kindFilter);
      }
      const { data: catData } = await catQuery.order('name');
      categoriesForSelect = (catData ?? []).map(c => ({ value: String(c.id), label: String(c.name) }));
    }
  }

  return (
    <section>
      <h1 className="text-2xl font-bold text-white">{title}</h1>
      <ContentManagerClient 
        table={table} 
        fields={fields} 
        rows={rows} 
        titleKey={titleKey} 
        hasStatus={!TABLES_WITHOUT_STATUS.has(table)} 
        categoriesForSelect={categoriesForSelect}
      />
    </section>
  );
}
