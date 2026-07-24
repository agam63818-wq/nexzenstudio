export const metadata = { robots: { index: false } };
export default function StoragePage() {
  return (
    <section>
      <h1 className="text-2xl font-bold text-white">Storage</h1>
      <p className="mt-2 text-sm text-slate-400">
        Media is stored in the Supabase <code>media</code> bucket. Create it in the
        Supabase dashboard (public) and upload prompt previews, APK icons,
        screenshots and gallery assets there. Public URLs are then referenced by
        the content managers.
      </p>
    </section>
  );
}
