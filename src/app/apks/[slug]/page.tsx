import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getApk } from '@/lib/queries';
import { ShareButtons } from '@/components/ui/share-buttons';
import { SITE_URL } from '@/lib/utils';
import { ShieldCheck, Download } from 'lucide-react';

interface Params { params: Promise<{ slug: string }>; }
export const revalidate = 60;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const apk = await getApk(slug);
  const title = apk?.name ?? slug.replace(/-/g, ' ');
  const url = `${SITE_URL}/apks/${slug}`;
  return { title, description: apk?.description ?? undefined, alternates: { canonical: url }, openGraph: { title, url } };
}

export default async function ApkDetailPage({ params }: Params) {
  const { slug } = await params;
  const apk = await getApk(slug);
  if (!apk) notFound();
  const url = `${SITE_URL}/apks/${slug}`;

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 md:px-8">
      <div className="flex items-center gap-4">
        <h1 className="text-3xl font-black md:text-4xl">{apk.name}</h1>
        {apk.virus_scanned && (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-3 py-1 text-xs text-emerald-300">
            <ShieldCheck size={14} /> Virus scanned
          </span>
        )}
      </div>
      <div className="mt-2 flex flex-wrap gap-3 text-sm text-slate-400">
        {apk.version && <span>v{apk.version}</span>}
        {apk.size_bytes && <span>{(apk.size_bytes / 1e6).toFixed(1)} MB</span>}
      </div>
      {apk.description && <p className="mt-4 text-slate-300">{apk.description}</p>}
      {apk.whats_new && (
        <div className="mt-6 rounded-2xl glass p-5">
          <p className="text-sm font-semibold text-white">What&apos;s new</p>
          <p className="mt-2 whitespace-pre-wrap text-sm text-slate-300">{apk.whats_new}</p>
        </div>
      )}
      {apk.download_url && (
        <a href={apk.download_url} className="tap-target mt-6 inline-flex items-center gap-2 rounded-full bg-neon-gradient px-6 font-semibold text-white glow-hover">
          <Download size={18} /> Download
        </a>
      )}
      <div className="mt-6"><ShareButtons url={url} title={apk.name} /></div>
    </article>
  );
}
