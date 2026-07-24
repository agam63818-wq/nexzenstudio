import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getGame } from '@/lib/queries';
import { ShareButtons } from '@/components/ui/share-buttons';
import { SITE_URL } from '@/lib/utils';
import { Play, Download } from 'lucide-react';

interface Params { params: Promise<{ slug: string }>; }
export const revalidate = 60;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const game = await getGame(slug);
  const title = game?.title ?? slug.replace(/-/g, ' ');
  const url = `${SITE_URL}/games/${slug}`;
  return { title, description: game?.description ?? undefined, alternates: { canonical: url }, openGraph: { title, url } };
}

export default async function GameDetailPage({ params }: Params) {
  const { slug } = await params;
  const game = await getGame(slug);
  if (!game) notFound();
  const url = `${SITE_URL}/games/${slug}`;

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 md:px-8">
      <h1 className="text-3xl font-black md:text-4xl">{game.title}</h1>
      {game.description && <p className="mt-3 text-slate-300">{game.description}</p>}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        {game.play_url && (
          <a href={game.play_url} className="tap-target inline-flex items-center justify-center gap-2 rounded-full bg-neon-gradient px-6 font-semibold text-white glow-hover">
            <Play size={18} /> Play online
          </a>
        )}
        {game.download_url && (
          <a href={game.download_url} className="tap-target inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 font-semibold text-white hover:bg-white/10">
            <Download size={18} /> Download
          </a>
        )}
      </div>
      <div className="mt-6"><ShareButtons url={url} title={game.title} /></div>
    </article>
  );
}
