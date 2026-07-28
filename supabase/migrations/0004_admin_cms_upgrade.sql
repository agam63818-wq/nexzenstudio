-- Phase 4: professional admin CMS.
--
-- 1. Guarantees `published_at` exists on every content table so the
--    Publish / Unpublish buttons never hit a schema error.
-- 2. Adds the optional columns the upgraded ContentManager forms expose
--    (category, tags, thumbnails, etc.).
--
-- Every statement is idempotent — safe to re-run, and safe to run even if
-- you already added `published_at` by hand in the Supabase dashboard.

-- ── 1. published_at on every content table ──────────────────────────────
do $$
declare t text;
begin
  foreach t in array array[
    'prompts','image_prompts','video_prompts','games','apks',
    'blogs','resources','tools','gallery'
  ] loop
    execute format('alter table %I add column if not exists published_at timestamptz;', t);
    execute format('alter table %I add column if not exists status text not null default ''draft'';', t);
    -- Backfill: anything already published but missing a timestamp gets one.
    execute format(
      'update %I set published_at = coalesce(published_at, created_at)
         where status = ''published'' and published_at is null;', t
    );
    -- Index publish ordering used by the public listings.
    execute format(
      'create index if not exists %I on %I (status, published_at desc nulls last);',
      t || '_status_published_at_idx', t
    );
  end loop;
end $$;

-- ── 2. Columns referenced by the upgraded admin forms ───────────────────

-- Prompts: free-text category alongside the existing category_id FK.
alter table prompts add column if not exists category text;

-- Image prompts.
alter table image_prompts add column if not exists category text;
alter table image_prompts add column if not exists tags text[] default '{}';

-- Video prompts.
alter table video_prompts add column if not exists category text;
alter table video_prompts add column if not exists aspect_ratio text;
alter table video_prompts add column if not exists tags text[] default '{}';

-- Games.
alter table games add column if not exists category text;
alter table games add column if not exists cover_url text;
alter table games add column if not exists platform text;

-- APKs.
alter table apks add column if not exists category text;
alter table apks add column if not exists min_android text;

-- Blogs.
alter table blogs add column if not exists category text;
alter table blogs add column if not exists tags text[] default '{}';
alter table blogs add column if not exists author text default 'NexZen Studio';
alter table blogs add column if not exists read_minutes int;

-- Resources.
alter table resources add column if not exists category text;
alter table resources add column if not exists file_size text;
alter table resources add column if not exists thumbnail_url text;
alter table resources add column if not exists tags text[] default '{}';

-- Tools.
alter table tools add column if not exists logo_url text;
alter table tools add column if not exists tags text[] default '{}';

-- Gallery.
alter table gallery add column if not exists category text;
alter table gallery add column if not exists tags text[] default '{}';

-- Categories: optional description shown on listing pages.
alter table categories add column if not exists description text;

-- ── 3. Settings columns used by the admin Settings screen ───────────────
alter table settings add column if not exists tagline text;
alter table settings add column if not exists contact_email text;
alter table settings add column if not exists meta_description text;

-- Ensure the singleton settings row exists so the form always has a target.
insert into settings (id) values (1) on conflict (id) do nothing;

-- ── 4. Categories/tags slug safety ──────────────────────────────────────
-- The admin auto-generates slugs from the name; make sure duplicates fail
-- loudly rather than silently creating ambiguous taxonomy.
create unique index if not exists categories_slug_key_idx on categories (slug);
create unique index if not exists tags_slug_key_idx on tags (slug);
