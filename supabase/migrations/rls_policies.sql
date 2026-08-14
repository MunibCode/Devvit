-- Devvit — Milestone 3: Row Level Security (RLS) policies
-- Enables users to manage their own profiles while keeping data protected.

-- ============================================================
-- Profiles: public reads, owner-only writes
-- ============================================================
alter table profiles enable row level security;

create policy "Profiles are viewable by everyone"
  on profiles for select
  using (true);

create policy "Users can insert their own profile"
  on profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Users can delete their own profile"
  on profiles for delete
  using (auth.uid() = id);

-- ============================================================
-- Projects: public reads, owner-managed writes
-- ============================================================
alter table projects enable row level security;

create policy "Projects are viewable by everyone"
  on projects for select
  using (true);

create policy "Authenticated users can create projects"
  on projects for insert
  with check (auth.uid() = owner_id);

create policy "Owners can update their projects"
  on projects for update
  using (auth.uid() = owner_id);

create policy "Owners can delete their projects"
  on projects for delete
  using (auth.uid() = owner_id);

-- ============================================================
-- Project applications: applicants + owners only
-- ============================================================
alter table project_applications enable row level security;

create policy "Applicants can view their own applications"
  on project_applications for select
  using (auth.uid() = applicant_id);

create policy "Project owners can view applications"
  on project_applications for select
  using (
    exists (
      select 1 from projects
      where projects.id = project_applications.project_id
        and projects.owner_id = auth.uid()
    )
  );

create policy "Applicants can apply"
  on project_applications for insert
  with check (auth.uid() = applicant_id);

create policy "Owners can update application status"
  on project_applications for update
  using (
    exists (
      select 1 from projects
      where projects.id = project_applications.project_id
        and projects.owner_id = auth.uid()
    )
  );

-- ============================================================
-- Verified contributions: public reads, verified-writer-only
-- ============================================================
alter table verified_contributions enable row level security;

create policy "Verified contributions are viewable by everyone"
  on verified_contributions for select
  using (true);

create policy "Project owners can record verified contributions"
  on verified_contributions for insert
  with check (
    exists (
      select 1 from projects
      where projects.id = verified_contributions.project_id
        and projects.owner_id = auth.uid()
    )
  );

-- ============================================================
-- Code duels: participants only
-- ============================================================
alter table duels enable row level security;

create policy "Duel participants can view their duels"
  on duels for select
  using (auth.uid() = player1_id or auth.uid() = player2_id);

create policy "Authenticated users can create duels"
  on duels for insert
  with check (auth.uid() = player1_id);

create policy "Participants can update their duels"
  on duels for update
  using (auth.uid() = player1_id or auth.uid() = player2_id);

-- ============================================================
-- Duel problems: public reads, seed/insert via service role only
-- ============================================================
alter table duel_problems enable row level security;

create policy "Duel problems are viewable by everyone"
  on duel_problems for select
  using (true);

create policy "Only authenticated admins can create problems"
  on duel_problems for insert
  with check (auth.jwt() ->> 'role' = 'service_role');
