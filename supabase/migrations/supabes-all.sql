-- Devvit — Full schema (M1 + M3 + M5) — idempotent: safe to re-run
-- Source of truth: docs/PRD.md (Supabase Database Schema Overview)

-- ============================================================
-- Profiles (extends auth.users)
-- ============================================================
create table if not exists profiles (
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

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- Projects Marketplace
-- ============================================================
create table if not exists projects (
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
create table if not exists project_applications (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references projects(id) on delete cascade,
  applicant_id uuid references profiles(id) on delete cascade,
  status text default 'pending' check (status in ('pending', 'accepted', 'rejected')),
  created_at timestamptz default timezone('utc', now())
);

-- Verified Contributions
create table if not exists verified_contributions (
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
create table if not exists duel_problems (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text not null,
  difficulty text check (difficulty in ('easy', 'medium', 'hard')),
  initial_code jsonb not null, -- e.g. {"javascript": "function solution() {}"}
  test_cases jsonb not null,
  created_at timestamptz default timezone('utc', now())
);

create table if not exists duels (
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

-- ============================================================
-- Row Level Security (RLS) policies
-- ============================================================

-- Profiles: public reads, owner-only writes
alter table profiles enable row level security;

drop policy if exists "Profiles are viewable by everyone" on profiles;
create policy "Profiles are viewable by everyone"
  on profiles for select
  using (true);

drop policy if exists "Users can insert their own profile" on profiles;
create policy "Users can insert their own profile"
  on profiles for insert
  with check (auth.uid() = id);

drop policy if exists "Users can update their own profile" on profiles;
create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "Users can delete their own profile" on profiles;
create policy "Users can delete their own profile"
  on profiles for delete
  using (auth.uid() = id);

-- Projects: public reads, owner-managed writes
alter table projects enable row level security;

drop policy if exists "Projects are viewable by everyone" on projects;
create policy "Projects are viewable by everyone"
  on projects for select
  using (true);

drop policy if exists "Authenticated users can create projects" on projects;
create policy "Authenticated users can create projects"
  on projects for insert
  with check (auth.uid() = owner_id);

drop policy if exists "Owners can update their projects" on projects;
create policy "Owners can update their projects"
  on projects for update
  using (auth.uid() = owner_id);

drop policy if exists "Owners can delete their projects" on projects;
create policy "Owners can delete their projects"
  on projects for delete
  using (auth.uid() = owner_id);

-- Project applications: applicants + owners only
alter table project_applications enable row level security;

drop policy if exists "Applicants can view their own applications" on project_applications;
create policy "Applicants can view their own applications"
  on project_applications for select
  using (auth.uid() = applicant_id);

drop policy if exists "Project owners can view applications" on project_applications;
create policy "Project owners can view applications"
  on project_applications for select
  using (
    exists (
      select 1 from projects
      where projects.id = project_applications.project_id
        and projects.owner_id = auth.uid()
    )
  );

drop policy if exists "Applicants can apply" on project_applications;
create policy "Applicants can apply"
  on project_applications for insert
  with check (auth.uid() = applicant_id);

drop policy if exists "Owners can update application status" on project_applications;
create policy "Owners can update application status"
  on project_applications for update
  using (
    exists (
      select 1 from projects
      where projects.id = project_applications.project_id
        and projects.owner_id = auth.uid()
    )
  );

-- Verified contributions: public reads, verified-writer-only
alter table verified_contributions enable row level security;

drop policy if exists "Verified contributions are viewable by everyone" on verified_contributions;
create policy "Verified contributions are viewable by everyone"
  on verified_contributions for select
  using (true);

drop policy if exists "Project owners can record verified contributions" on verified_contributions;
create policy "Project owners can record verified contributions"
  on verified_contributions for insert
  with check (
    exists (
      select 1 from projects
      where projects.id = verified_contributions.project_id
        and projects.owner_id = auth.uid()
    )
  );

-- Code duels: participants only
alter table duels enable row level security;

drop policy if exists "Duel participants can view their duels" on duels;
create policy "Duel participants can view their duels"
  on duels for select
  using (auth.uid() = player1_id or auth.uid() = player2_id);

drop policy if exists "Authenticated users can create duels" on duels;
create policy "Authenticated users can create duels"
  on duels for insert
  with check (auth.uid() = player1_id);

drop policy if exists "Participants can update their duels" on duels;
create policy "Participants can update their duels"
  on duels for update
  using (auth.uid() = player1_id or auth.uid() = player2_id);

-- Duel problems: public reads, insert via service role only
alter table duel_problems enable row level security;

drop policy if exists "Duel problems are viewable by everyone" on duel_problems;
create policy "Duel problems are viewable by everyone"
  on duel_problems for select
  using (true);

drop policy if exists "Only authenticated admins can create problems" on duel_problems;
create policy "Only authenticated admins can create problems"
  on duel_problems for insert
  with check (auth.jwt() ->> 'role' = 'service_role');

-- ============================================================
-- Seed code duel problems + rating function
-- ============================================================

-- Adjust a builder's duel rating (used by recordDuelResult).
create or replace function public.adjust_rating(builder_id uuid, delta int)
returns void
language sql
security definer set search_path = public
as $$
  update profiles
  set duel_rating = greatest(100, duel_rating + delta)
  where id = builder_id;
$$;

-- Seed only if duel_problems is empty (avoids duplicates on re-run).
insert into duel_problems (title, description, difficulty, initial_code, test_cases)
select title, description, difficulty, initial_code::jsonb, test_cases::jsonb from (values
  (
    'Two Sum',
    'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice. Return the answer as an array [i, j].',
    'easy',
    '{"javascript": "function twoSum(nums, target) {\n  // write your solution here\n}"}',
    '[
      {"input": [[2,7,11,15], 9], "expected": [0,1]},
      {"input": [[3,2,4], 6], "expected": [1,2]},
      {"input": [[3,3], 6], "expected": [0,1]}
    ]'
  ),
  (
    'Reverse a String',
    'Given a string s, return a new string with the characters in reverse order.',
    'easy',
    '{"javascript": "function reverseString(s) {\n  // write your solution here\n}"}',
    '[
      {"input": ["hello"], "expected": "olleh"},
      {"input": ["A man, a plan"], "expected": "nalp a ,nam A"},
      {"input": [""], "expected": ""}
    ]'
  ),
  (
    'Valid Parentheses',
    'Given a string s containing just the characters ( ) { } [ ], determine if the input string is valid. An input string is valid if open brackets are closed by the same type of brackets in the correct order.',
    'medium',
    '{"javascript": "function isValid(s) {\n  // write your solution here\n}"}',
    '[
      {"input": ["()"], "expected": true},
      {"input": ["()[]{}"], "expected": true},
      {"input": ["(]"], "expected": false}
    ]'
  ),
  (
    'Find the Duplicate Number',
    'Given an array of integers nums containing n + 1 integers where each integer is in the range [1, n] inclusive, there is exactly one duplicate. Return the duplicate number. Your solution must run in O(n) time and use only constant extra space.',
    'hard',
    '{"javascript": "function findDuplicate(nums) {\n  // write your solution here\n}"}',
    '[
      {"input": [[1,3,4,2,2]], "expected": 2},
      {"input": [[3,1,3,4,2]], "expected": 3}
    ]'
  )
) as s(title, description, difficulty, initial_code, test_cases)
where not exists (select 1 from duel_problems);
