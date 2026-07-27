import { createClient } from '@/lib/supabase/server';
import type {
  Prompt,
  ImagePrompt,
  VideoPrompt,
  Game,
  Apk,
  Blog,
  Resource,
  Tool,
  Category,
} from '@/lib/types';

/**
 * Server-side read helpers. All queries run against RLS, so anon users only
 * ever receive rows where status = 'published'. If Supabase env vars are
 * missing (e.g. first deploy), helpers return empty results instead of
 * throwing so pages still render.
 */

function hasEnv() {
  return (
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export async function listPrompts(tool?: string, categoryId?: string): Promise<Prompt[]> {
  if (!hasEnv()) return [];
  const supabase = await createClient();
  let q = supabase
    .from('prompts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false });
  if (tool) q = q.eq('tool', tool);
  if (categoryId) q = q.eq('category_id', categoryId);
  const { data } = await q;
  return (data as Prompt[]) ?? [];
}

export async function getPrompt(
  tool: string,
  slug: string
): Promise<Prompt | null> {
  if (!hasEnv()) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from('prompts')
    .select('*')
    .eq('tool', tool)
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();
  return (data as Prompt) ?? null;
}

export async function relatedPrompts(
  tool: string,
  excludeId: string
): Promise<Prompt[]> {
  if (!hasEnv()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from('prompts')
    .select('*')
    .eq('tool', tool)
    .eq('status', 'published')
    .neq('id', excludeId)
    .limit(3);
  return (data as Prompt[]) ?? [];
}

async function listPublished<T>(table: string): Promise<T[]> {
  if (!hasEnv()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from(table)
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false });
  return (data as T[]) ?? [];
}

async function getBySlug<T>(table: string, slug: string): Promise<T | null> {
  if (!hasEnv()) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from(table)
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();
  return (data as T) ?? null;
}

export const listImagePrompts = () => listPublished<ImagePrompt>('image_prompts');
export const listVideoPrompts = () => listPublished<VideoPrompt>('video_prompts');
export async function listGames(categoryId?: string): Promise<Game[]> {
  if (!hasEnv()) return [];
  const supabase = await createClient();
  let q = supabase.from('games').select('*').eq('status', 'published').order('created_at', { ascending: false });
  if (categoryId) q = q.eq('category_id', categoryId);
  const { data } = await q;
  return (data as Game[]) ?? [];
}
export const getGame = (slug: string) => getBySlug<Game>('games', slug);
export async function listApks(categoryId?: string): Promise<Apk[]> {
  if (!hasEnv()) return [];
  const supabase = await createClient();
  let q = supabase.from('apks').select('*').eq('status', 'published').order('created_at', { ascending: false });
  if (categoryId) q = q.eq('category_id', categoryId);
  const { data } = await q;
  return (data as Apk[]) ?? [];
}
export const getApk = (slug: string) => getBySlug<Apk>('apks', slug);
export const listBlogs = () => listPublished<Blog>('blogs');
export const getBlog = (slug: string) => getBySlug<Blog>('blogs', slug);
export const listResources = () => listPublished<Resource>('resources');
export const listTools = () => listPublished<Tool>('tools');

export async function listCategories(kind?: string): Promise<Category[]> {
  if (!hasEnv()) return [];
  const supabase = await createClient();
  let q = supabase.from('categories').select('*').order('name');
  if (kind) q = q.eq('kind', kind);
  const { data } = await q;
  return (data as Category[]) ?? [];
}

export interface SearchHit {
  type: string;
  title: string;
  href: string;
}

/** Global search across the main content tables (ilike on title). */
export async function search(term: string): Promise<SearchHit[]> {
  if (!hasEnv() || !term.trim()) return [];
  const supabase = await createClient();
  const like = `%${term}%`;
  const hits: SearchHit[] = [];

  const [prompts, games, apks, blogs, images, videos] = await Promise.all([
    supabase.from('prompts').select('title,tool,slug').eq('status', 'published').ilike('title', like).limit(10),
    supabase.from('games').select('title,slug').eq('status', 'published').ilike('title', like).limit(10),
    supabase.from('apks').select('name,slug').eq('status', 'published').ilike('name', like).limit(10),
    supabase.from('blogs').select('title,slug').eq('status', 'published').ilike('title', like).limit(10),
    supabase.from('image_prompts').select('title,slug').eq('status', 'published').ilike('title', like).limit(10),
    supabase.from('video_prompts').select('title,slug').eq('status', 'published').ilike('title', like).limit(10),
  ]);

  for (const p of prompts.data ?? []) hits.push({ type: 'Prompt', title: p.title, href: `/prompts/${p.tool}/${p.slug}` });
  for (const g of games.data ?? []) hits.push({ type: 'Game', title: g.title, href: `/games/${g.slug}` });
  for (const a of apks.data ?? []) hits.push({ type: 'APK', title: a.name, href: `/apks/${a.slug}` });
  for (const b of blogs.data ?? []) hits.push({ type: 'Blog', title: b.title, href: `/blog/${b.slug}` });
  for (const i of images.data ?? []) hits.push({ type: 'Image', title: i.title, href: `/images/${i.slug}` });
  for (const v of videos.data ?? []) hits.push({ type: 'Video', title: v.title, href: `/videos/${v.slug}` });

  return hits;
}
