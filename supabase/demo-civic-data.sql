-- GovLens classroom demo shared data tables.
-- Run this in Supabase SQL Editor so reports, petitions, forum posts,
-- signatures, and votes are visible across browsers/users.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.demo_reports (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  author_name text not null,
  title text not null,
  description text not null,
  category text not null,
  state text not null,
  location_text text not null,
  image_url text,
  status text not null default 'submitted'
    check (status in ('submitted', 'under_review', 'in_progress', 'resolved')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.demo_petitions (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  author_name text not null,
  title text not null,
  description text not null,
  state text not null,
  category text not null,
  target integer not null default 1000 check (target > 0),
  signature_count integer not null default 0,
  status text not null default 'active' check (status in ('active', 'closed', 'won')),
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.demo_petition_signatures (
  id uuid primary key default gen_random_uuid(),
  petition_id uuid not null references public.demo_petitions(id) on delete cascade,
  user_id text not null,
  created_at timestamptz not null default now(),
  unique (petition_id, user_id)
);

create table if not exists public.demo_forum_posts (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  author_name text not null,
  title text not null,
  content text not null,
  state text not null,
  category text not null,
  tags text[] not null default '{}',
  likes integer not null default 0,
  replies integer not null default 0,
  views integer not null default 1,
  trending boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.demo_votes (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  policy_id text not null,
  policy_title text not null,
  option_index integer not null,
  option_label text not null,
  created_at timestamptz not null default now(),
  unique (user_id, policy_id)
);

drop trigger if exists set_demo_reports_updated_at on public.demo_reports;
create trigger set_demo_reports_updated_at before update on public.demo_reports
  for each row execute procedure public.set_updated_at();

drop trigger if exists set_demo_petitions_updated_at on public.demo_petitions;
create trigger set_demo_petitions_updated_at before update on public.demo_petitions
  for each row execute procedure public.set_updated_at();

drop trigger if exists set_demo_forum_posts_updated_at on public.demo_forum_posts;
create trigger set_demo_forum_posts_updated_at before update on public.demo_forum_posts
  for each row execute procedure public.set_updated_at();

create or replace function public.increment_demo_petition_signature_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.demo_petitions
  set signature_count = signature_count + 1
  where id = new.petition_id;
  return new;
end;
$$;

drop trigger if exists increment_demo_petition_signature_count on public.demo_petition_signatures;
create trigger increment_demo_petition_signature_count
  after insert on public.demo_petition_signatures
  for each row execute procedure public.increment_demo_petition_signature_count();

alter table public.demo_reports enable row level security;
alter table public.demo_petitions enable row level security;
alter table public.demo_petition_signatures enable row level security;
alter table public.demo_forum_posts enable row level security;
alter table public.demo_votes enable row level security;

drop policy if exists "Demo reports are readable" on public.demo_reports;
create policy "Demo reports are readable" on public.demo_reports for select using (true);
drop policy if exists "Demo reports can be created" on public.demo_reports;
create policy "Demo reports can be created" on public.demo_reports for insert with check (true);
drop policy if exists "Demo reports can be updated" on public.demo_reports;
create policy "Demo reports can be updated" on public.demo_reports for update using (true);

drop policy if exists "Demo petitions are readable" on public.demo_petitions;
create policy "Demo petitions are readable" on public.demo_petitions for select using (true);
drop policy if exists "Demo petitions can be created" on public.demo_petitions;
create policy "Demo petitions can be created" on public.demo_petitions for insert with check (true);
drop policy if exists "Demo petitions can be updated" on public.demo_petitions;
create policy "Demo petitions can be updated" on public.demo_petitions for update using (true);

drop policy if exists "Demo signatures are readable" on public.demo_petition_signatures;
create policy "Demo signatures are readable" on public.demo_petition_signatures for select using (true);
drop policy if exists "Demo signatures can be created" on public.demo_petition_signatures;
create policy "Demo signatures can be created" on public.demo_petition_signatures for insert with check (true);

drop policy if exists "Demo forum posts are readable" on public.demo_forum_posts;
create policy "Demo forum posts are readable" on public.demo_forum_posts for select using (true);
drop policy if exists "Demo forum posts can be created" on public.demo_forum_posts;
create policy "Demo forum posts can be created" on public.demo_forum_posts for insert with check (true);
drop policy if exists "Demo forum posts can be updated" on public.demo_forum_posts;
create policy "Demo forum posts can be updated" on public.demo_forum_posts for update using (true);

drop policy if exists "Demo votes are readable" on public.demo_votes;
create policy "Demo votes are readable" on public.demo_votes for select using (true);
drop policy if exists "Demo votes can be created" on public.demo_votes;
create policy "Demo votes can be created" on public.demo_votes for insert with check (true);
