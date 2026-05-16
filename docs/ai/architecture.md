# Architecture

System design at a glance. Pair with `CODE_MAP.md` (file map), `DATA_FLOW.md` (system flows), and `FEATURE_BOUNDARIES.md` (component responsibilities) at the repo root.

## System Overview

A statically pre-rendered Next.js 15 App Router site (`web/`) backed by Supabase Postgres for a single waitlist table. Content is parsed at build time from `.docx` / `.xlsx` / `.csv` source documents at the repo root into committed JSON, then imported by React Server Components. 37 of 38 routes are static; only `/api/waitlist` is dynamic.

**Style:** Statically pre-rendered Next.js (App Router) + a single dynamic API route
**Hosting:** Vercel (front end + API), Supabase Cloud (Postgres + Auth, Auth unused in v1)

## Core Components

### Web app
- **Responsibility:** All UI, routing, animation, waitlist API
- **Tech:** Next.js 15, React 19, TypeScript strict, Tailwind, Framer Motion, Lenis
- **Key files:** `web/app/**`, `web/components/**`, `web/lib/**`
- **Depends on:** content JSON (built once), Supabase (`/api/waitlist` only)

### Content pipeline
- **Responsibility:** Parse source docs into typed JSON
- **Tech:** Node + tsx; mammoth, sheetjs (xlsx), csv-parse
- **Key files:** `web/scripts/build-content.ts`, output at `web/content/*.json`
- **Depends on:** Source documents at repo root (`Character Documentation/`, `The Motions Workbook Compotents/`, `THE MOTIONS UNIVERSE LORE - CLIENT WORK CONNECTION.docx`)

### Animation system
- **Responsibility:** Smooth scroll, scroll-triggered reveals, parallax, marquee, text-reveal
- **Tech:** Lenis (smooth scroll), Framer Motion (component-level + scroll-linked transforms)
- **Key files:** `web/lib/animations/LenisProvider.tsx`, `web/components/motion/*`
- **Depends on:** Browser only; respects `prefers-reduced-motion`

### Decor + brand primitives
- **Responsibility:** Mo Town cartoon visual identity components — Squiggle / Zigzag / ShakeLines / Dot SVGs, Sticker badges, CharacterPortrait / HeroCard / Title / Scene presence-aware image loaders, QuotePost lookups
- **Tech:** Plain SVG + Tailwind; `next/image` for raster assets
- **Key files:** `web/components/decor/*`
- **Depends on:** `web/content/asset-presence.json` (built at content-build time) for the presence sets. The actual image files live at `public/assets/{characters,hero-cards,scenes,titles,quote-posts,illustrations,logo}/`.

### Universe page components
- **Responsibility:** Page-specific components for each narrative section (Geography boroughs, Arcs pairs, Exacerbator corruption chains with modal, Lore chapter accordion). Each consumes structured JSON emitted by the corresponding parser.
- **Tech:** React Server Components for layout + 'use client' islands where state is needed (ChainSection, LoreChapter)
- **Key files:** `web/components/universe/{CharacterChip,BoroughCard,MechanismSteps,PairArcCard,ChainSection,LoreChapter,NarrativePage}.tsx`
- **Depends on:** typed loaders in `lib/content.ts`; reuses decor primitives

### Asset pipeline
- **Responsibility:** Optimize source PNGs into shipped WebP, normalize filenames to `{slug}.webp` per role directory
- **Tech:** sharp
- **Key files:** `web/scripts/optimize-images.ts`, `web/scripts/remap-illustrations.ts`, `docs/asset-map.md`
- **Depends on:** Source PNGs in repo-root folders ("The Motions Graphics (1..5)", "The Motions Static Quote Posts")

### Database
- **Responsibility:** Persist waitlist signups
- **Tech:** Supabase Postgres, single table `public.waitlist`
- **Key files:** `web/supabase/migrations/0001_init.sql`
- **Depends on:** `pgcrypto` extension

## Data Flow (Critical Path)

**Build-time content:**
1. Source `.docx` / `.xlsx` / `.csv` at repo root — filesystem
2. `web/scripts/build-content.ts` parses each — Node script
3. `web/content/*.json` emitted (committed) — filesystem
4. `web/lib/content.ts` imports JSON as typed modules — TS module graph
5. Pages render via RSC, prerendered into `.next/` at `next build` — build output

**Runtime waitlist:**
1. User submits email on `/` or `/workbook` — `web/components/ui/WaitlistForm.tsx`
2. `fetch POST /api/waitlist` — JSON
3. Zod validates payload — `web/app/api/waitlist/route.ts`
4. `createSupabaseServer()` constructs SSR-safe client — `web/lib/supabase/server.ts`
5. Insert into `public.waitlist` (RLS permits anon insert) — Supabase REST
6. JSON response `{ok, duplicate?}` returned to client — fetch resolves

## Data Stores

- **Supabase Postgres** — single `waitlist` table; unique constraint on `email`; RLS on, anon-insert only, service-role read

## External Integrations

- **Supabase** — Postgres + Auth (Auth wired via `@supabase/ssr` but no sign-in UI in v1). API keys use the new `sb_publishable_…` / `sb_secret_…` format.
- **Vercel** — hosting + CI/CD from GitHub `naperry2011/The-Motions`. Project Root Directory: `web`. Framework Preset: Next.js.
- **Google Fonts** — Inter (body), Fraunces (italic accents), Bowlby One (chunky display) — loaded via `next/font/google`

## Security Boundaries

- Anonymous browsers can `POST /api/waitlist` and trigger an insert into `public.waitlist`; no other write surface
- Service role key (`SUPABASE_SERVICE_ROLE_KEY`) lives only in env vars; never imported in client code
- RLS denies `select` to anon; service role required to read waitlist rows
- `web/components/universe/NarrativePage.tsx` uses `dangerouslySetInnerHTML` on mammoth-converted HTML — trust is anchored to our own source `.docx` files

## Known Constraints / Trade-offs

- No CMS — editorial changes require a redeploy (re-run content pipeline, push commit). Acceptable while authoring velocity is low.
- Content shape is asserted with TypeScript `as` casts, not validated at runtime. Source-doc schema drift won't fail at compile time.
- GSAP is installed but unused; either remove or schedule a feature that needs it.
- Two characters (Amp, Velour) have no scene panel — profile pages skip the scene band silently.
- Pilot and Pinch aren't assigned to a borough — the source doc puts them in parenthetical "lives here during week / weekends" notes on Polish's and Plenty's entries.
- The asset pipeline is destructive (replaces PNGs with WebP in place) — originals only live in the source folders.
- `next build` clobbers `.next/server/vendor-chunks/*.js` that `next dev` depends on — never run both in parallel.
- PR merges via the GitHub UI have twice silently dropped new type definitions from `lib/content.ts` while keeping the `as X` casts that depend on them. Vercel build fails with implicit-any errors. Hotfix recipe: `git checkout main; git checkout <branch> -- web/lib/content.ts; commit; push`.
