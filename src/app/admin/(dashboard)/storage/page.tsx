import { HardDrive, UploadCloud, Link2, ShieldCheck } from 'lucide-react';

export const metadata = { title: 'Storage', robots: { index: false } };

const STEPS = [
  {
    Icon: HardDrive,
    title: 'Create the bucket',
    body: 'In the Supabase dashboard go to Storage → New bucket, name it "media" and mark it Public. Every content manager expects public URLs from this bucket.',
  },
  {
    Icon: UploadCloud,
    title: 'Upload your assets',
    body: 'Drop prompt previews, APK icons, game screenshots, blog covers and gallery artwork into the bucket. Folders are optional but keep things tidy — e.g. /prompts, /apks, /gallery.',
  },
  {
    Icon: Link2,
    title: 'Copy the public URL',
    body: 'Click a file → Get URL, then paste it into the matching URL field in any admin section. The field validates the link and shows a live thumbnail so you know it resolves.',
  },
  {
    Icon: ShieldCheck,
    title: 'Keep writes admin-only',
    body: 'Public read is enough for visitors. Uploads should stay restricted to authenticated admins via the bucket policy so nobody can push files to your storage.',
  },
];

export default function StoragePage() {
  return (
    <section className="pb-16">
      <h1 className="font-display text-2xl font-bold text-white">Storage</h1>
      <p className="mt-1.5 max-w-2xl text-sm text-slate-400">
        Media lives in the Supabase <code className="rounded bg-white/5 px-1 font-mono text-xs">media</code> bucket. The CMS
        references files by public URL rather than uploading directly, so setup is a one-time job.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {STEPS.map(({ Icon, title, body }, i) => (
          <div key={title} className="glass rounded-xl p-5">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-neon-purple">
                <Icon size={16} />
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Step {i + 1}</span>
            </div>
            <h2 className="mt-3 font-semibold text-white">{title}</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{body}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-white/10 bg-black/20 p-5">
        <h2 className="text-sm font-semibold text-white">Recommended image sizes</h2>
        <ul className="mt-3 space-y-1.5 text-sm text-slate-400">
          <li>• <span className="text-slate-300">Blog cover / social banner</span> — 1200×630 (landscape)</li>
          <li>• <span className="text-slate-300">APK icon</span> — 512×512 (square PNG)</li>
          <li>• <span className="text-slate-300">Game cover</span> — 1200×675 (landscape)</li>
          <li>• <span className="text-slate-300">Image prompt preview</span> — any ratio, keep under 1 MB</li>
          <li>• <span className="text-slate-300">Gallery artwork</span> — full resolution, record width &amp; height in the form</li>
        </ul>
      </div>
    </section>
  );
}
