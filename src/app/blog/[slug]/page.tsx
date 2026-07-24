import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBlog } from '@/lib/queries';
import { ShareButtons } from '@/components/ui/share-buttons';
import { SITE_URL } from '@/lib/utils';

interface Params { params: Promise<{ slug: string }>; }
export const revalidate = 60;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlog(slug);
  const title = post?.title ?? slug.replace(/-/g, ' ');
  const url = `${SITE_URL}/blog/${slug}`;
  return {
    title,
    description: post?.excerpt ?? undefined,
    alternates: { canonical: url },
    openGraph: { title, description: post?.excerpt ?? undefined, url, type: 'article' },
    twitter: { card: 'summary_large_image', title },
  };
}

export default async function BlogDetailPage({ params }: Params) {
  const { slug } = await params;
  const post = await getBlog(slug);
  if (!post) notFound();
  const url = `${SITE_URL}/blog/${slug}`;

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 md:px-8">
      <h1 className="text-3xl font-black md:text-4xl">{post.title}</h1>
      {post.published_at && (
        <p className="mt-2 text-sm text-slate-500">
          {new Date(post.published_at).toLocaleDateString()}
        </p>
      )}
      {post.excerpt && <p className="mt-4 text-lg text-slate-300">{post.excerpt}</p>}
      <div className="prose prose-invert mt-6 max-w-none whitespace-pre-wrap text-slate-200">
        {post.body}
      </div>
      <div className="mt-8"><ShareButtons url={url} title={post.title} /></div>
    </article>
  );
}
