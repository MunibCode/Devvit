Here is a complete, structured **Master Implementation & Roadmap Specification Document** in English. You can copy and paste this directly into your repository or send it as a project brief.

---

# Devvit MVP — Master Implementation & Development Roadmap

## Project Overview

Devvit is a student-first, community-driven platform designed to connect young builders (developers, designers, AI engineers, and product managers) with real-world projects, verified portfolio contributions, and competitive skill-building challenges.

This roadmap leverages a **Next.js Twitter/X Clone Starter Kit** as the baseline UI shell. The objective is to transform this social layout into the Devvit ecosystem—integrating a full **Supabase** backend, filling in missing platform pages, enabling dark/light theme toggling, and incorporating AI-assisted dynamic UI expansion to automatically adapt missing components while strictly maintaining design continuity.

---

## Technical Stack & Architecture

| Layer | Technology | Purpose |
| --- | --- | --- |
| **Framework** | Next.js (App Router, TypeScript) | Core framework based on the Twitter/X template shell. |
| **Styling & UI** | Tailwind CSS + Lucide Icons | Responsive styling adhering to Twitter/X UI patterns. |
| **Theming** | `next-themes` | Seamless Dark/Light mode switching. |
| **Backend & Auth** | Supabase | PostgreSQL, GitHub/Google OAuth, Storage, and Realtime Subscriptions. |
| **AI Integration** | OpenAI / Anthropic API | Dynamic layout completion, auto-generated code challenges, and portfolio verification assistance. |
| **Code Editor** | `@monaco-editor/react` | In-browser code editing for the Code Duel feature. |
| **Code Execution** | Piston API / Judge0 | Isolated sandbox execution for real-time code challenges. |

---

## Core System Architecture & AI Guidelines

### 1. Design Consistency Rules (Strict Mandate)

* **X/Twitter Template Alignment:** All newly constructed or AI-completed pages must adhere strictly to the existing template's visual hierarchy:
* Left sidebar navigation.
* Central feed/content area (590px to 600px max width on desktop).
* Right widget sidebar (Search, Trends, Suggested Builders/Projects).


* **Theme Support:** Native Support for **Light** and **Dark** modes via Tailwind CSS classes (`dark:` modifier) managed through `next-themes`.

### 2. AI-Driven UI & Feature Engine

* **Missing Page Detection & Auto-Completion:** When routes or sub-components are missing, the AI agent analyze the layout context, adopt existing CSS classes and component structures, and generate matching UI sections.
* **Smart Code Duel Generation:** AI dynamically generates code challenge problems, test cases, and difficulty rankings.
* **AI Contribution Reviewer:** AI reviews submitted work and pulls PR summaries from GitHub to assist admins in verifying builder contributions.

---

## Supabase Database Schema Overview

```sql
-- Profiles (Extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  skills TEXT[],
  github_handle TEXT,
  duel_rating INT DEFAULT 1200,
  total_wins INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Projects Marketplace
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT CHECK (category IN ('startup', 'open_source', 'internal')),
  required_skills TEXT[],
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Project Applications
CREATE TABLE project_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  applicant_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Verified Contributions
CREATE TABLE verified_contributions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  builder_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  role_title TEXT NOT NULL,
  proof_url TEXT NOT NULL,
  verified_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Code Duels
CREATE TABLE duels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  player1_id UUID REFERENCES profiles(id),
  player2_id UUID REFERENCES profiles(id),
  problem_id UUID REFERENCES duel_problems(id),
  status TEXT DEFAULT 'waiting' CHECK (status IN ('waiting', 'active', 'finished')),
  winner_id UUID REFERENCES profiles(id),
  duration_seconds INT DEFAULT 900,
  started_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Code Duel Problems
CREATE TABLE duel_problems (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  initial_code JSONB NOT NULL, -- e.g. {"javascript": "function solution() {}"}
  test_cases JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

```

---

## Milestone Roadmap

```
+--------------------------------------------------------------------------+
|                       DEVVIT DEVELOPMENT ROADMAP                         |
+--------------------------------------------------------------------------+
|  Milestone 1: Baseline Architecture & Theme Foundation                   |
|  Milestone 2: Missing Core Pages & X-Template Adaptation                |
|  Milestone 3: Supabase Authentication & Profile Management               |
|  Milestone 4: Projects Marketplace & Verification Engine                 |
|  Milestone 5: Real-Time Code Duel Arena & Execution Sandbox              |
|  Milestone 6: AI Co-Pilot & Automated Component Generator Integration      |
|  Milestone 7: Quality Assurance, Optimization & Deployment                 |
+--------------------------------------------------------------------------+

```

---

### Milestone 1: Baseline Architecture & Theme Foundation

**Objective:** Setup the project repository, adapt the Next.js X/Twitter template, configure Supabase, and establish Light/Dark mode.

* [ ] **Task 1.1:** Clone the X template, clean boilerplate data, and update Next.js App Router dependencies.
* [ ] **Task 1.2:** Install and configure `next-themes` for seamless **Light / Dark Mode** support across all components.
* [ ] **Task 1.3:** Setup Supabase project, environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`), and initialize the Supabase SSR client helper.
* [ ] **Task 1.4:** Execute the database SQL migration scripts in Supabase to set up `profiles`, `projects`, `duels`, and related tables.

---

### Milestone 2: Missing Core Pages & X-Template Adaptation

**Objective:** Transform Twitter UI components into Devvit-specific pages while maintaining design consistency. Identify and fill in all missing routes.

* [ ] **Task 2.1:** **Feed / Home Page (`/home`):**
* Convert the main tweet creation box into a "Post Update / Share Project Snippet" box.
* Transform the timeline into an activity stream displaying project posts, duel victories, and community announcements.


* [ ] **Task 2.2:** **Missing Page: Projects Hub (`/projects`):**
* Adapt the search/explore layout from the Twitter template.
* Build project filtering tabs (Startups, Open-Source, Internal Devvit Projects).
* Build project cards featuring required skills tags and an **"Apply"** button.


* [ ] **Task 2.3:** **Missing Page: Builder Profile (`/profile/[username]`):**
* Convert the Twitter profile layout into a Builder Portfolio.
* Add sections for **Verified Contributions**, GitHub integration link, and **Code Duel Stats** (Wins/Rating).


* [ ] **Task 2.4:** **Missing Page: Code Duel Lobby (`/duel`):**
* Design a matchmaking lobby using the template's central panel layout.
* Create "Create Challenge Room" and "Quick Match" action cards.



---

### Milestone 3: Supabase Authentication & Profile Management

**Objective:** Enable user authorization and sync builder profile data.

* [ ] **Task 3.1:** Integrate Supabase OAuth with **GitHub** and **Google**.
* [ ] **Task 3.2:** Configure a Database Trigger in Supabase to automatically generate a row in `profiles` upon user sign-up.
* [ ] **Task 3.3:** Build an **Edit Profile Modal** following the Twitter template style to update bio, skills array, and GitHub handles.
* [ ] **Task 3.4:** Setup Row Level Security (RLS) policies in Supabase for user data protection.

---

### Milestone 4: Projects Marketplace & Verification Engine

**Objective:** Allow startup founders and team leads to post projects, review applications, and grant verified portfolio credentials.

* [ ] **Task 4.1:** Build the "Create Project" modal/page adhering to template form styling.
* [ ] **Task 4.2:** Implement project application workflow (Applicants click "Apply" $\rightarrow$ Application inserted into `project_applications`).
* [ ] **Task 4.3:** Build the Application Management View for project owners to Accept/Reject candidates.
* [ ] **Task 4.4:** Implement the **Verification Workflow**:
* Authorized project owners submit proof of completion.
* Entry added to `verified_contributions` and displayed as a **Verified Badge** on the builder's profile.



---

### Milestone 5: Real-Time Code Duel Arena & Execution Sandbox

**Objective:** Implement the real-time competitive 1v1 coding battle feature.

* [ ] **Task 5.1:** **Code Duel Arena UI (`/duel/[duelId]`):**
* Split-screen arena design matching the template's dark/light color palette.
* Left side: Problem description, markdown renderer, live timer, and opponent progress indicator.
* Right side: Monaco Editor component and execution console output.


* [ ] **Task 5.2:** **Realtime Synchronization:**
* Connect participants via **Supabase Realtime Broadcast Channels**.
* Synchronize match start countdown, code submission events, and victory conditions.


* [ ] **Task 5.3:** **Code Execution Engine:**
* Route code submissions to **Piston API** (or Judge0) via Next.js API Routes / Edge Functions.
* Validate output against test cases stored in `duel_problems`.
* Automatically update user ratings (`duel_rating`) and declare the winner on successful completion.



---

### Milestone 6: AI Co-Pilot & Automated Component Generator Integration

**Objective:** Integrate AI services to complete missing UI sections on the fly and assist platform interactions.

* [ ] **Task 6.1: AI Layout Completion Agent:**
* Implement an AI developer agent context prompt that scans the component tree.
* Automatically generate missing fallback pages/modals (e.g., dynamic 404 pages, empty project states, custom notifications) using the exact Tailwind classes of the Twitter starter template.


* [ ] **Task 6.2: AI Code Duel Generator:**
* Connect OpenAI/Claude API to automatically generate unique coding challenges, initial starter code, and JSON test cases into `duel_problems`.


* [ ] **Task 6.3: AI Portfolio Verification Assistant:**
* Use AI to analyze submitted pull request URLs or repository links and generate a concise summary for project owners to verify contributions faster.



---

### Milestone 7: Quality Assurance, Optimization & Deployment

**Objective:** Finalize testing, ensure responsive design across devices, and deploy to production.

* [ ] **Task 7.1:** Perform cross-theme audit (verify all components render seamlessly in both Light and Dark modes).
* [ ] **Task 7.2:** Conduct real-time stress testing on Supabase Realtime channels during Code Duels.
* [ ] **Task 7.3:** Configure Vercel deployment with automatic environment variable bindings and SSL setup.
* [ ] **Task 7.4:** Document API endpoints and generate project handoff instructions for the core team.