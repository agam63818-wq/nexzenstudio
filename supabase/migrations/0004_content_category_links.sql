-- Link game and APK content to reusable categories so public filters can use admin assignments.

alter table games
  add column if not exists category_id uuid references categories(id) on delete set null;

alter table apks
  add column if not exists category_id uuid references categories(id) on delete set null;

create index if not exists games_category_id_idx on games(category_id);
create index if not exists apks_category_id_idx on apks(category_id);
