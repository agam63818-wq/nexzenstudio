import { unstable_noStore as noStore } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { HeroClient } from './hero-client';

type HeroSection = {
  table: string;
  href: string;
};

const HERO_SECTION_PRIORITY: HeroSection[] = [
  { table: 'prompts', href: '/prompts' },
  { table: 'tools', href: '/tools' },
  { table: 'games', href: '/games' },
  { table: 'apks', href: '/apks' },
  { table: 'image_prompts', href: '/images' },
  { table: 'video_prompts', href: '/videos' },
  { table: 'gallery', href: '/gallery' },
  { table: 'blogs', href: '/blog' },
  { table: 'resources', href: '/resources' },
];

function hasSupabaseEnv() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

async function getPublishedCounts() {
  noStore();

  if (!hasSupabaseEnv()) {
    return HERO_SECTION_PRIORITY.map((section) => ({ ...section, count: 0 }));
  }

  const supabase = await createClient();

  return Promise.all(
    HERO_SECTION_PRIORITY.map(async (section) => {
      const { count } = await supabase
        .from(section.table)
        .select('*', { count: 'exact', head: true })
        .eq('status', 'published');

      return { ...section, count: count ?? 0 };
    })
  );
}

export async function Hero() {
  const counts = await getPublishedCounts();
  const exploreSection = counts.find((section) => section.count > 0);
  const exploreHref = exploreSection?.href ?? '/prompts';
  const workSection = counts
    .filter((section) => section.href !== exploreHref)
    .sort((a, b) => b.count - a.count)[0];
  const workHref = workSection && workSection.count > 0 ? workSection.href : '/gallery';

  const countsMap = Object.fromEntries(counts.map((section) => [section.table, section.count]));

  return <HeroClient exploreHref={exploreHref} workHref={workHref} counts={countsMap} />;
}
