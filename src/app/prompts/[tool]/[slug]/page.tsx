import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPrompt, relatedPrompts } from '@/lib/queries';
import { CopyButton } from '@/components/ui/copy-button';
import { ShareButtons } from '@/components/ui/share-buttons';
import { ContentCard } from '@/components/ui/content-card';
import { SITE_URL } from '@/lib/utils';
import { Eye, Heart } from 'lucide-react';

interface Params {
  params: Promise<{ tool: string; slug: string }>;
}

export const revalidate = 60;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { tool, slug } = await params;
  const prompt = await getPrompt(tool, slug);
  const title = prompt?.title ?? `${slug.replace(/-/g, ' ')} — ${tool} prompt`;
  const url = `${SITE_URL}/prompts/${tool}/${slug}`;
  const description = prompt?.description ?? `A ${tool} prompt from NexZen Studio.`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'article' },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function PromptDetailPage({ params }: Params) {
  const { tool, slug } = await params;
  const prompt = await getPrompt(tool, slug);
  if (!prompt) notFound();

  const related = await relatedPrompts(tool, prompt.id);
  const url = `${SITE_URL}/prompts/${tool}/${slug}`;

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 md:px-8">
      <p className="text-sm uppercase tracking-wide text-neon-blue">{prompt.tool}</p>
      <h1 className="mt-2 text-3xl font-black md:text-4xl">{prompt.title}</h1>

      {prompt.description && (
        <p className="mt-3 text-slate-400">{prompt.description}</p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-400">
        <span className="inline-flex items-center gap-1"><Eye size={15} /> {prompt.views}</span>
        <span className="inline-flex items-center gap-1"><Heart size={15} /> {prompt.likes}</span>
        {prompt.version && <span>v{prompt.version}</span>}
        <span>by {prompt.author ?? 'NexZen Studio'}</span>
      </div>

      <div className="mt-6 rounded-2xl glass p-5">
        <pre className="whitespace-pre-wrap break-words text-sm text-slate-200">{prompt.prompt_text}</pre>
        <div className="mt-4 flex flex-wrap gap-2">
          <CopyButton value={prompt.prompt_text} label="Copy prompt" />
        </div>
      </div>

      {prompt.tags?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {prompt.tags.map((t) => (
            <span key={t} className="rounded-full glass px-3 py-1 text-xs text-slate-300">#{t}</span>
          ))}
        </div>
      )}

      <div className="mt-6">
        <p className="mb-2 text-sm text-slate-400">Share</p>
        <ShareButtons url={url} title={prompt.title} />
      </div>

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold text-white">Related prompts</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {related.map((r) => (
              <ContentCard key={r.id} href={`/prompts/${r.tool}/${r.slug}`} title={r.title} meta={r.tool} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
