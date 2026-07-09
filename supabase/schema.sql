-- GovLens HCI Assignment 2 Supabase schema
-- Run this in Supabase SQL Editor after creating a project.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
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

create table if not exists public.petitions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
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

create table if not exists public.petition_signatures (
  id uuid primary key default gen_random_uuid(),
  petition_id uuid not null references public.petitions(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (petition_id, user_id)
);

create table if not exists public.forum_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
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

create table if not exists public.forum_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.forum_posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.votes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  policy_id text not null,
  policy_title text not null,
  option_index integer not null,
  option_label text not null,
  created_at timestamptz not null default now(),
  unique (user_id, policy_id)
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  title text not null,
  message text not null,
  read_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at before update on public.profiles
  for each row execute procedure public.set_updated_at();

drop trigger if exists set_reports_updated_at on public.reports;
create trigger set_reports_updated_at before update on public.reports
  for each row execute procedure public.set_updated_at();

drop trigger if exists set_petitions_updated_at on public.petitions;
create trigger set_petitions_updated_at before update on public.petitions
  for each row execute procedure public.set_updated_at();

drop trigger if exists set_forum_posts_updated_at on public.forum_posts;
create trigger set_forum_posts_updated_at before update on public.forum_posts
  for each row execute procedure public.set_updated_at();

drop trigger if exists set_forum_comments_updated_at on public.forum_comments;
create trigger set_forum_comments_updated_at before update on public.forum_comments
  for each row execute procedure public.set_updated_at();

drop trigger if exists set_notifications_updated_at on public.notifications;
create trigger set_notifications_updated_at before update on public.notifications
  for each row execute procedure public.set_updated_at();

create or replace function public.increment_petition_signature_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.petitions
  set signature_count = signature_count + 1
  where id = new.petition_id;
  return new;
end;
$$;

drop trigger if exists increment_petition_signature_count on public.petition_signatures;
create trigger increment_petition_signature_count
  after insert on public.petition_signatures
  for each row execute procedure public.increment_petition_signature_count();

alter table public.profiles enable row level security;
alter table public.reports enable row level security;
alter table public.petitions enable row level security;
alter table public.petition_signatures enable row level security;
alter table public.forum_posts enable row level security;
alter table public.forum_comments enable row level security;
alter table public.votes enable row level security;
alter table public.notifications enable row level security;

create policy "Profiles are readable" on public.profiles for select using (true);
create policy "Users update own profile" on public.profiles for update using (auth.uid() = id);

create policy "Reports are readable" on public.reports for select using (true);
create policy "Users create own reports" on public.reports for insert with check (auth.uid() = user_id);
create policy "Users update own reports" on public.reports for update using (auth.uid() = user_id);

create policy "Petitions are readable" on public.petitions for select using (true);
create policy "Users create own petitions" on public.petitions for insert with check (auth.uid() = user_id);
create policy "Users update own petitions" on public.petitions for update using (auth.uid() = user_id);

create policy "Signatures are readable" on public.petition_signatures for select using (true);
create policy "Users sign as self" on public.petition_signatures for insert with check (auth.uid() = user_id);

create policy "Forum posts are readable" on public.forum_posts for select using (true);
create policy "Users create own forum posts" on public.forum_posts for insert with check (auth.uid() = user_id);
create policy "Users update own forum posts" on public.forum_posts for update using (auth.uid() = user_id);

create policy "Forum comments are readable" on public.forum_comments for select using (true);
create policy "Users create own comments" on public.forum_comments for insert with check (auth.uid() = user_id);
create policy "Users update own comments" on public.forum_comments for update using (auth.uid() = user_id);

create policy "Users create own votes" on public.votes for insert with check (auth.uid() = user_id);
create policy "Users read own votes" on public.votes for select using (auth.uid() = user_id);

create policy "Users read own notifications" on public.notifications for select using (auth.uid() = user_id or user_id is null);
create policy "Users update own notifications" on public.notifications for update using (auth.uid() = user_id);
