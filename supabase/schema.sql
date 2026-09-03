-- Supabase schema for TheyCutMeBecauseOfAI
-- Run in Supabase SQL editor

create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  company_slug text not null,
  nickname text not null check (char_length(nickname) between 1 and 40),
  role text,
  wave_date date,
  body text not null check (char_length(body) between 10 and 2000),
  created_at timestamptz not null default now(),
  is_hidden boolean not null default false
);

alter table comments enable row level security;

-- Public read non-hidden, public insert (MVP). Tighten later with rate-limit / auth.
drop policy if exists "public read" on comments;
create policy "public read" on comments for select using (is_hidden = false);

drop policy if exists "public insert" on comments;
create policy "public insert" on comments for insert with check (true);

create index if not exists idx_comments_slug_created on comments (company_slug, created_at desc);
