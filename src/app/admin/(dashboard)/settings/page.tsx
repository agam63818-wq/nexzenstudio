import { createClient } from '@/lib/supabase/server';
import { saveRow } from '@/app/admin/(dashboard)/manager-actions';

export const metadata = { robots: { index: false } };

export default async function SettingsPage() {
  let settings: Record<string, unknown> = {};
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const supabase = await createClient();
    const { data } = await supabase.from('settings').select('*').eq('id', 1).maybeSingle();
    settings = (data as Record<string, unknown>) ?? {};
  }

  return (
    <section>
      <h1 className="text-2xl font-bold text-white">Settings</h1>
      <form action={saveRow.bind(null, 'settings')} className="mt-6 grid gap-3 rounded-2xl glass p-5">
        <input type="hidden" name="id" value="1" />
        <input name="site_name" defaultValue={String(settings.site_name ?? 'NexZen Studio')} placeholder="Site name" className="rounded-lg bg-black/30 px-3 py-2 text-sm text-white outline-none" />
        <input name="logo_url" defaultValue={String(settings.logo_url ?? '')} placeholder="Logo URL" className="rounded-lg bg-black/30 px-3 py-2 text-sm text-white outline-none" />
        <input name="banner_url" defaultValue={String(settings.banner_url ?? '')} placeholder="Banner URL" className="rounded-lg bg-black/30 px-3 py-2 text-sm text-white outline-none" />
        <input name="footer_text" defaultValue={String(settings.footer_text ?? '')} placeholder="Footer text" className="rounded-lg bg-black/30 px-3 py-2 text-sm text-white outline-none" />
        <button className="tap-target justify-self-start rounded-lg bg-neon-gradient px-5 text-sm font-semibold text-white">Save</button>
      </form>
    </section>
  );
}
