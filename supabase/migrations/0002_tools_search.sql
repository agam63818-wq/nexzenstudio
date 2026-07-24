-- Phase 2: AI tools directory + full-text search helpers.

create table if not exists tools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  website text,
  category text,
  pricing text,
  review text,
  rating numeric(2,1),
  status text not null default 'draft',
  created_at timestamptz not null default now()
);

alter table tools enable row level security;
create policy tools_public_read on tools for select using (status = 'published');
create policy tools_admin_all on tools for all using (is_admin()) with check (is_admin());

-- Trigram indexes to speed up ilike search across content titles.
create extension if not exists pg_trgm;
create index if not exists prompts_title_trgm on prompts using gin (title gin_trgm_ops);
create index if not exists games_title_trgm on games using gin (title gin_trgm_ops);
create index if not exists apks_name_trgm on apks using gin (name gin_trgm_ops);
create index if not exists blogs_title_trgm on blogs using gin (title gin_trgm_ops);
create index if not exists image_prompts_title_trgm on image_prompts using gin (title gin_trgm_ops);
create index if not exists video_prompts_title_trgm on video_prompts using gin (title gin_trgm_ops);
