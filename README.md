# Devvit

**Student-first, community-driven platform** where young builders (developers, designers, AI engineers, and product managers) connect with real-world projects, verified portfolio contributions, and competitive code duels. Built on a Next.js App Router shell modeled on the X/Twitter layout.

## Features

- **Activity Feed (`/home`)** — Share project updates and snippets; see duel victories and community announcements.
- **Projects Hub (`/projects`)** — Browse real projects (Startups, Open-Source, Internal Devvit), filter by category, and **Apply**.
- **Builder Profiles (`/profile/[username]`)** — Portfolio with Code Duel stats (Rating / Wins / Duels) and **Verified Contributions** with proof URLs.
- **Code Duel Arena (`/duel`)** — Matchmaking lobby, Quick Match, AI-generated challenges, and a live split-screen arena (`/duel/[duelId]`) with a Monaco editor, timer, opponent progress, and a Piston execution console.
- **AI Co-Pilot** — Generate missing pages on the fly, auto-generate duel problems, and get AI summaries of contribution proof URLs.
- **Light / Dark theme** via `next-themes`.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 15 (App Router, React 19, TypeScript strict) |
| Styling | Tailwind CSS v3 + custom screens/colors |
| Backend & Auth | Supabase (Postgres, OAuth, Realtime) |
| Code Editor | `@monaco-editor/react` (bundled locally, lazy-loaded) |
| Code Execution | Piston API via `/api/duel/execute` |
| AI | OpenAI-compatible client (`openai`) |
| Media | ImageKit (`imagekitio-next`) |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run start` — start production server
- `npm run lint` — ESLint (`next lint`)

## Environment Variables

Copy `.env.example` to `.env.local` and fill in what you use:

```bash
# ImageKit (media layer)
NEXT_PUBLIC_PUBLIC_KEY=
NEXT_PUBLIC_URL_ENDPOINT=
PRIVATE_KEY=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=

# AI co-pilot (OpenAI-compatible)
AI_API_KEY=
AI_BASE_URL=
AI_MODEL=gpt-4o-mini

# Code execution
PISTON_URL=https://emkc.org/api/v2/piston/execute
```

`.env*` files are gitignored — never commit secrets.

## Supabase Setup

1. Create a project at [supabase.com](https://supabase.com).
2. Run the migration scripts in `supabase/migrations/` in SQL Editor (in order):
   - `20260101000000_init.sql` — tables + auto-profile trigger
   - `20260101000001_rls_policies.sql` — Row Level Security
   - `20260101000002_seed_duel_problems.sql` — sample problems + rating function
   - `supabes-all.sql` — idempotent combined version, safe to re-run
3. Add `http://localhost:3000/auth/callback` to **Authentication → URL Configuration → Redirect URLs**.
4. Enable GitHub and/or Google under **Authentication → Providers**.
5. Set the env vars above and restart the dev server.

The project runs fully without Supabase configured, using placeholder data.

## Architecture

- `src/app/` — App Router pages; `@modal` parallel route for modals (e.g. `/compose/post`).
- `src/components/` — UI components. Server components by default; add `"use client"` only when hooks/browser APIs are used.
- `src/actions/` — Server Actions (`"use server"`) for mutations.
- `src/lib/` — shared helpers (AI client, component-tree scan, placeholder data).
- `src/utils/` — utility helpers (ImageKit, Supabase clients).
- `@/*` path alias maps to `./src/*`.

### Design System

Follow the existing visual hierarchy: left sidebar nav, central content column, right widget sidebar (Search, Trends, Suggested Builders). Reuse the custom Tailwind tokens (`textGray`, `borderGray`, `inputGray`, `iconBlue`, `iconGreen`, `iconPink`, `page`) and screens (`xsm`–`xxl`) from `tailwind.config.ts`. Dark-first: the page background is set globally, use `dark:` modifiers for light mode via `next-themes`.

## Docs

- `docs/PRD.md` — Master Implementation & Roadmap (single source of truth for requirements, schema, milestones).
- `supabase/migrations/` — SQL schema, RLS policies, and seed data.

## License

Private project — internal use.