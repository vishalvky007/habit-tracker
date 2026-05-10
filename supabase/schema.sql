-- Supabase schema for Habit Tracker
-- Users are managed by Supabase Auth (auth.users table is provided automatically)

-- 1. habits table – stores each habit definition
create table public.habits (
  id            uuid      primary key default gen_random_uuid(),
  user_id       uuid      references auth.users (id) on delete cascade,
  title         text      not null,
  description   text,
  frequency     jsonb     not null,   -- e.g. {"type":"daily"} or {"type":"weekly","days":[1,3,5]}
  start_date    date      not null default current_date,
  created_at    timestamp with time zone default now(),
  updated_at    timestamp with time zone default now()
);

-- 2. habit_logs table – one row per day a habit is marked completed
create table public.habit_logs (
  id            uuid      primary key default gen_random_uuid(),
  habit_id      uuid      references public.habits (id) on delete cascade,
  logged_date   date      not null,
  completed_at  timestamp with time zone default now(),
  unique (habit_id, logged_date)
);

-- 3. push_tokens table – device push‑notification tokens for each user
create table public.push_tokens (
  id            uuid      primary key default gen_random_uuid(),
  user_id       uuid      references auth.users (id) on delete cascade,
  token         text      not null,
  platform      text check (platform in ('ios','android')) not null,
  created_at    timestamp with time zone default now(),
  updated_at    timestamp with time zone default now()
);

-- Enable Row‑Level Security (RLS) for all tables
alter table public.habits enable row level security;
alter table public.habit_logs enable row level security;
alter table public.push_tokens enable row level security;

-- Policies – each user can only access their own rows
create policy "users can CRUD their habits"
  on public.habits for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "users can CRUD their logs"
  on public.habit_logs for all
  using (auth.uid() = (select user_id from public.habits where id = habit_id))
  with check (auth.uid() = (select user_id from public.habits where id = habit_id));

create policy "users can manage their push tokens"
  on public.push_tokens for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
