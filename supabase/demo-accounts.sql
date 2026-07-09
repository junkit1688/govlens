-- GovLens classroom demo account table.
-- Run this in Supabase SQL Editor if cross-browser demo login is needed.

create extension if not exists pgcrypto;

create table if not exists public.demo_accounts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  password_hash text not null,
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

drop trigger if exists set_demo_accounts_updated_at on public.demo_accounts;
create trigger set_demo_accounts_updated_at before update on public.demo_accounts
  for each row execute procedure public.set_updated_at();

alter table public.demo_accounts enable row level security;

drop policy if exists "Demo accounts are readable" on public.demo_accounts;
create policy "Demo accounts are readable" on public.demo_accounts
  for select using (true);

drop policy if exists "Demo accounts can be created" on public.demo_accounts;
create policy "Demo accounts can be created" on public.demo_accounts
  for insert with check (true);

drop policy if exists "Demo accounts can be updated" on public.demo_accounts;
create policy "Demo accounts can be updated" on public.demo_accounts
  for update using (true);
