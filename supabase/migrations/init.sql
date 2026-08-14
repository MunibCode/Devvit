-- Devvit — Milestone 1: Initial schema
-- Source of truth: docs/PRD.md (Supabase Database Schema Overview)

-- ============================================================
-- Profiles (extends auth.users)
-- ============================================================
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  full_name text,
  avatar_url text,
  bio text,
  skills text[],
  github_handle text,
  duel_rating int default 1200,
  total_wins int default 0,
  created_at timestamptz default timezone('utc', now())
);

-- Auto-create a profile row on sign-up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'user_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- Projects Marketplace
-- ============================================================
create table projects (
  id uuid default gen_random_uuid() primary key,
  owner_id uuid references profiles(id) on delete cascade,
  title text not null,
  description text not null,
  category text check (category in ('startup', 'open_source', 'internal')),
  required_skills text[],
  status text default 'open' check (status in ('open', 'in_progress', 'completed')),
  created_at timestamptz default timezone('utc', now())
);

-- Project Applications
create table project_applications (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references projects(id) on delete cascade,
  applicant_id uuid references profiles(id) on delete cascade,
  status text default 'pending' check (status in ('pending', 'accepted', 'rejected')),
  created_at timestamptz default timezone('utc', now())
);

-- Verified Contributions
create table verified_contributions (
  id uuid default gen_random_uuid() primary key,
  builder_id uuid references profiles(id) on delete cascade,
  project_id uuid references projects(id) on delete cascade,
  role_title text not null,
  proof_url text not null,
  verified_at timestamptz default timezone('utc', now())
);

-- ============================================================
-- Code Duels
-- ============================================================
create table duel_problems (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text not null,
  difficulty text check (difficulty in ('easy', 'medium', 'hard')),
  initial_code jsonb not null, -- e.g. {"javascript": "function solution() {}"}
  test_cases jsonb not null,
  created_at timestamptz default timezone('utc', now())
);

create table duels (
  id uuid default gen_random_uuid() primary key,
  player1_id uuid references profiles(id),
  player2_id uuid references profiles(id),
  problem_id uuid references duel_problems(id),
  status text default 'waiting' check (status in ('waiting', 'active', 'finished')),
  winner_id uuid references profiles(id),
  duration_seconds int default 900,
  started_at timestamptz,
  created_at timestamptz default timezone('utc', now())
);

-- ============================================================
-- Indexes
-- ============================================================
create index if not exists projects_owner_id_idx on projects(owner_id);
create index if not exists project_applications_project_id_idx on project_applications(project_id);
create index if not exists project_applications_applicant_id_idx on project_applications(applicant_id);
create index if not exists verified_contributions_builder_id_idx on verified_contributions(builder_id);
create index if not exists duels_status_idx on duels(status);
