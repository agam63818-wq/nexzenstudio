import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/utils';
import { NAV_LINKS } from '@/lib/nav';
import { listPrompts, listGames, listApks, listBlogs } from '@/lib/queries';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = NAV_LINKS.map((link) => ({
    url: `${SITE_URL}${link.href}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: link.href === '/' ? 1 : 0.7,
  }));

  const [prompts, games, apks, blogs] = await Promise.all([
    listPrompts(),
    listGames(),
    listApks(),
    listBlogs(),
  ]);

  const dynamicEntries: MetadataRoute.Sitemap = [
    ...prompts.map((p) => ({ url: `${SITE_URL}/prompts/${p.tool}/${p.slug}`, lastModified: new Date(p.updated_at) })),
    ...games.map((g) => ({ url: `${SITE_URL}/games/${g.slug}` })),
    ...apks.map((a) => ({ url: `${SITE_URL}/apks/${a.slug}` })),
    ...blogs.map((b) => ({ url: `${SITE_URL}/blog/${b.slug}` })),
  ];

  return [...staticEntries, ...dynamicEntries];
}
