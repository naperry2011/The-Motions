create extension if not exists "pgcrypto";

create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text not null default 'homepage',
  created_at timestamptz not null default now()
);

alter table public.waitlist enable row level security;

drop policy if exists "anon can insert waitlist" on public.waitlist;
create policy "anon can insert waitlist"
  on public.waitlist for insert
  to anon, authenticated
  with check (true);

-- No select policy: rows are only readable via the service role.
