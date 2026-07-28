import { createClient } from '@/lib/supabase/server';
import { ManagerClient } from './manager-client';
import type { Field, SelectOption } from './field-types';

export type { Field } from './field-types';
export { PRICING_OPTIONS, CATEGORY_KINDS } from './field-types';

interface Props {
  /** Supabase table name. */
  table: string;
  /** Section heading. */
  title: string;
  /** One-line explanation shown under the heading. */
  description?: string;
  fields: Field[];
  /** Column used as the display name in the list. */
  titleKey?: string;
  /** Set false for tables without a `status` column (categories, tags). */
  hasStatus?: boolean;
  /** Column rendered as a badge in the list. */
  badgeKey?: string;
  badgeLabel?: string;
  /** Column holding a thumbnail URL for the list. */
  thumbKey?: string;
}

/**
 * Reusable, professional content manager used by every admin section.
 *
 * Server half: loads rows plus the live category options for any field that
 * declares a `categoryKind`. The interactive half lives in ManagerClient.
 */
export async function ContentManager({
  table,
  title,
  description,
  fields,
  titleKey = 'title',
  hasStatus = true,
  badgeKey,
  badgeLabel,
  thumbKey,
}: Props) {
  const configured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  let rows: Record<string, unknown>[] = [];
  let categoryOptions: SelectOption[] = [];

  if (configured) {
    const supabase = await createClient();

    const { data } = await supabase
      .from(table)
      .select('*')
      .order('created_at', { ascending: false });
    rows = (data as Record<string, unknown>[]) ?? [];

    // Live-populate category dropdowns from the categories table.
    const kinds = Array.from(
      new Set(fields.map((f) => f.categoryKind).filter((k): k is string => Boolean(k)))
    );

    if (kinds.length > 0) {
      const { data: cats } = await supabase
        .from('categories')
        .select('name,kind')
        .in('kind', kinds)
        .order('name', { ascending: true });

      categoryOptions = ((cats as { name: string; kind: string }[]) ?? []).map((c) => ({
        value: c.name,
        label: c.name,
      }));
    }
  }

  return (
    <ManagerClient
      table={table}
      title={title}
      description={description}
      fields={fields}
      titleKey={titleKey}
      rows={rows}
      hasStatus={hasStatus}
      badgeKey={badgeKey}
      badgeLabel={badgeLabel}
      thumbKey={thumbKey}
      categoryOptions={categoryOptions}
      notConfigured={!configured}
    />
  );
}
