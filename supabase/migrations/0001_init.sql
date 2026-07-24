-- NexZen Studio — initial schema (Phase 1)
-- Run in Supabase SQL editor or via CLI.
-- Public read on published content; writes are admin-only (no public signup).

create extension if not exists "pgcrypto";

-- Admins map to Supabase Auth users.
create table if not exists admins (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  name text,
  created_at timestamptz not null default now()
);

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  kind text,
  created_at timestamptz not null default now()
);

create table if not exists tags (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null
);

create table if not exists prompts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null,
  tool text not null,
  description text,
  prompt_text text not null,
  version text default '1.0',
  author text default 'NexZen Studio',
  category_id uuid references categories(id) on delete set null,
  tags text[] default '{}',
  likes int not null default 0,
  views int not null default 0,
  status text not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tool, slug)
);

create table if not exists image_prompts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  preview_url text,
  prompt_text text not null,
  negative_prompt text,
  model text,
  style text,
  aspect_ratio text,
  camera text,
  lighting text,
  status text not null default 'draft',
  created_at timestamptz not null default now()
);

create table if not exists video_prompts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  prompt_text text not null,
  scene text,
  camera_motion text,
  voice text,
  music text,
  duration text,
  style text,
  status text not null default 'draft',
  created_at timestamptz not null default now()
);

create table if not exists games (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  description text,
  play_url text,
  download_url text,
  trailer_url text,
  screenshots text[] default '{}',
  status text not null default 'draft',
  created_at timestamptz not null default now()
);

create table if not exists apks (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  icon_url text,
  screenshots text[] default '{}',
  description text,
  version text,
  size_bytes bigint,
  whats_new text,
  download_url text,
  virus_scanned boolean default false,
  status text not null default 'draft',
  created_at timestamptz not null default now()
);

create table if not exists blogs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  excerpt text,
  body text,
  cover_url text,
  status text not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  description text,
  file_url text,
  file_type text,
  status text not null default 'draft',
  created_at timestamptz not null default now()
);

create table if not exists downloads (
  id uuid primary key default gen_random_uuid(),
  content_type text not null,
  content_id uuid not null,
  created_at timestamptz not null default now()
);

create table if not exists likes (
  id uuid primary key default gen_random_uuid(),
  content_type text not null,
  content_id uuid not null,
  created_at timestamptz not null default now()
);

create table if not exists views (
  id uuid primary key default gen_random_uuid(),
  content_type text not null,
  content_id uuid not null,
  created_at timestamptz not null default now()
);

create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  content_type text not null,
  content_id uuid not null,
  author_name text,
  body text not null,
  is_spam boolean default false,
  approved boolean default false,
  created_at timestamptz not null default now()
);

create table if not exists analytics (
  id uuid primary key default gen_random_uuid(),
  event text not null,
  path text,
  country text,
  device text,
  referrer text,
  created_at timestamptz not null default now()
);

create table if not exists settings (
  id int primary key default 1,
  site_name text default 'NexZen Studio',
  logo_url text,
  banner_url text,
  theme text default 'dark',
  footer_text text,
  social_links jsonb default '{}'::jsonb,
  constraint settings_singleton check (id = 1)
);

-- Helper: is the current user a registered admin?
create or replace function is_admin() returns boolean
language sql security definer stable as $$
  select exists (select 1 from admins where id = auth.uid());
$$;

-- Enable RLS on all tables.
do $$
declare t text;
begin
  foreach t in array array[
    'admins','categories','tags','prompts','image_prompts','video_prompts',
    'games','apks','blogs','resources','downloads','likes','views',
    'comments','analytics','settings'
  ] loop
    execute format('alter table %I enable row level security;', t);
  end loop;
end $$;

-- Public read of published content.
do $$
declare t text;
begin
  foreach t in array array[
    'prompts','image_prompts','video_prompts','games','apks','blogs','resources'
  ] loop
    execute format($f$
      create policy %1$s_public_read on %1$I
        for select using (status = 'published');
    $f$, t);
  end loop;
end $$;

create policy categories_public_read on categories for select using (true);
create policy tags_public_read on tags for select using (true);
create policy settings_public_read on settings for select using (true);

-- Admin full access on every table.
do $$
declare t text;
begin
  foreach t in array array[
    'admins','categories','tags','prompts','image_prompts','video_prompts',
    'games','apks','blogs','resources','downloads','likes','views',
    'comments','analytics','settings'
  ] loop
    execute format($f$
      create policy %1$s_admin_all on %1$I
        for all using (is_admin()) with check (is_admin());
    $f$, t);
  end loop;
end $$;
