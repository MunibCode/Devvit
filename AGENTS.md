# AGENTS.md

## Project

**Devvit** — a student-first, community-driven platform where young builders (developers, designers, AI engineers, PMs) connect with real-world projects, verified portfolio contributions, and competitive code duels.

This repository is the baseline **Next.js Twitter/X clone UI shell** that will be transformed into the Devvit ecosystem per the master spec.

> **The single source of truth for product requirements, schema, and roadmap is `docs/PRD.md`. Read it before implementing any feature.** All milestones (1-7) and database schema live there.

## Current State vs Target

- **Current:** Pure static X/Twitter clone UI. No backend, no auth, no data layer. All content is hardcoded placeholder data.
- **Target (per PRD):** Full Supabase backend (Postgres, GitHub/Google OAuth, Storage, Realtime), Light/Dark theming, Projects Marketplace, Code Duel Arena, AI co-pilot. See `docs/PRD.md` roadmap.

## Commands

- `npm run dev` — start dev server (http://localhost:3000)
- `npm run build` — production build
- `npm run start` — start production server
- `npm run lint` — ESLint (`next lint`)

## Tech Stack

- Next.js 15 (App Router, React 19, TypeScript, strict mode)
- Tailwind CSS v3 + custom screens/colors (see `tailwind.config.ts`)
- `imagekitio-next` + `imagekit` (current media layer)
- Planned: `next-themes`, Supabase, `@monaco-editor/react`, Piston API/Judge0, OpenAI/Anthropic

## Architecture Conventions

- Source lives in `src/`; the `@/*` path alias maps to `./src/*` (see `tsconfig.json`).
- `src/app/` — App Router pages and the `@modal` parallel route (modals live under `src/app/@modal/<path>/page.tsx`; the root `layout.tsx` renders `children` + `modal`).
- `src/components/` — UI components. Server components by default; add `"use client"` at the top only when the component uses hooks/browser APIs (e.g. `Share.tsx`, `PostInteractions.tsx`).
- `src/actions.tsx` — Server Actions (`"use server"`) for mutations.
- `src/utils.ts` — shared helpers (currently the ImageKit client; must never be imported client-side).
- Component file naming: `PascalCase.tsx`. Function components are arrow functions with a default export.

## Design System (Strict Mandate)

- All new or AI-generated UI must follow the existing X/Twitter template's visual hierarchy:
  - Left sidebar navigation (`LeftBar.tsx`)
  - Central feed/content area (`max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl xxl:max-w-screen-xxl mx-auto flex justify-between` in `layout.tsx`)
  - Right widget sidebar — Search, Trends, Suggested Builders (`RightBar.tsx`, hidden below `lg`)
- Reuse the custom Tailwind tokens from `tailwind.config.ts`:
  - Screens: `xsm` 500, `sm` 600, `md` 690, `lg` 988, `xl` 1078, `xxl` 1265
  - Colors: `textGray`, `textGrayLight`, `borderGray`, `inputGray`, `iconBlue`, `iconGreen`, `iconPink`
- Dark background is `black`; page bg/text set in `globals.css` (`body { color:#ededed; background:black }`). Light mode and `dark:` modifiers are **not implemented yet** (Milestone 1).
- Theming: `next-themes` is planned. No hardcoded light-only values; prefer token classes so dark/light swap later stays consistent.
- Images/videos go through `src/components/Image.tsx` / `Video.tsx` (ImageKit components; fall back to plain `<img>`/`<video>` when `NEXT_PUBLIC_URL_ENDPOINT` is unset). Pass `path`, `w`, `h`, and `tr` for transform.
- Icons are SVG files in `public/icons/*.svg` rendered via `Image`. Inline SVGs are also used for interactive icons.

## Environment Variables

Required (ImageKit) — see `.env.example`:

- `NEXT_PUBLIC_PUBLIC_KEY`
- `NEXT_PUBLIC_URL_ENDPOINT`
- `PRIVATE_KEY` (server-only, used in `src/utils.ts`)

`.env*` files are gitignored; never commit secrets.

## Roadmap (from `docs/PRD.md`)

1. **M1** Baseline architecture & theme foundation (next-themes, Supabase setup + schema migration)
2. **M2** Missing core pages & X-template adaptation (`/home`, `/projects`, `/profile/[username]`, `/duel`)
3. **M3** Supabase auth & profile management (GitHub/Google OAuth, profiles trigger, RLS)
4. **M4** Projects marketplace & verification engine
5. **M5** Real-time Code Duel arena & execution sandbox
6. **M6** AI co-pilot & automated component generator
7. **M7** QA, optimization & deployment (Vercel)

When building a missing page, follow the PRD task spec and mirror the structure of existing routes (`src/app/[username]/page.tsx`, `src/app/page.tsx`).
