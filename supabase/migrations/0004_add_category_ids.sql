-- Add category_id to games and apks tables

alter table games add column if not exists category_id uuid references categories(id) on delete set null;
alter table apks add column if not exists category_id uuid references categories(id) on delete set null;

-- Create indexes for faster filtering
create index if not exists games_category_id_idx on games(category_id);
create index if not exists apks_category_id_idx on apks(category_id);
