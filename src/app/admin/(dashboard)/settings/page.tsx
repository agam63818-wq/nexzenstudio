import { createClient } from '@/lib/supabase/server';
import { SettingsForm } from '@/components/admin/settings-form';

export const metadata = { title: 'Settings', robots: { index: false } };
export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  let settings: Record<string, unknown> = {};
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const supabase = await createClient();
    const { data } = await supabase.from('settings').select('*').eq('id', 1).maybeSingle();
    settings = (data as Record<string, unknown>) ?? {};
  }

  return <SettingsForm settings={settings} />;
}
