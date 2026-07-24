-- Phase 3: analytics view helpers + storage bucket note.
-- Storage: create a public 'media' bucket in the Supabase dashboard for
-- prompt previews, APK icons, screenshots and gallery assets.

create table if not exists gallery (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  media_url text not null,
  media_type text not null default 'image',
  width int,
  height int,
  status text not null default 'draft',
  created_at timestamptz not null default now()
);

alter table gallery enable row level security;
create policy gallery_public_read on gallery for select using (status = 'published');
create policy gallery_admin_all on gallery for all using (is_admin()) with check (is_admin());

-- Aggregate helpers for the admin analytics screen.
create or replace view analytics_top_paths as
  select path, count(*) as hits
  from analytics
  where path is not null
  group by path
  order by hits desc
  limit 20;

create or replace view analytics_by_device as
  select coalesce(device, 'unknown') as device, count(*) as hits
  from analytics
  group by device
  order by hits desc;

create or replace view analytics_by_country as
  select coalesce(country, 'unknown') as country, count(*) as hits
  from analytics
  group by country
  order by hits desc
  limit 20;
