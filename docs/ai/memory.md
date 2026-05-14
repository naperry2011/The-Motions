# Project Memory

Running history of what's been built and current state. Update after major changes.

## Current State

**Status:** Active Development (v1 shipping)
**Last Updated:** 2026-05-14
**Version:** initial main, commit 5b84633

### What's Working
- Next.js 15 App Router site under `web/` with 38 routes building clean
- Content pipeline parsing 7 source docs → 8 JSON files (250 quotes, 25 characters, 8 modules × 27 paths, 4 narrative HTML docs)
- All 10 v1 routes returning 200 in local prod-server smoke test
- Cinematic homepage with Lenis smooth-scroll + Framer Motion reveal/parallax/marquee/text-reveal primitives
- 25 character profile pages SSG'd via `generateStaticParams`
- Quote library with filter/search/shuffle client-side interactivity
- Supabase wired end-to-end: `public.waitlist` table + RLS, `/api/waitlist` validated with Zod, duplicate emails handled gracefully, end-to-end smoke test confirmed row insert + readback
- Deployed to Vercel from GitHub `naperry2011/The-Motions` (Root Directory: `web`, Framework: Next.js)

### Known Issues
- Character bios are empty — the docx heading style in `COMPLETE MO TOWN CHARACTER DATABASE.docx` doesn't cleanly match the 25 canonical character names from the quotes CSV, so the parser falls back to stub records. Character pages degrade gracefully (10 quotes per profile still render).
- `public/assets/{graphics,quotes,characters}` directories are empty — graphics from `The Motions Graphics (1..5)/` and `The Motions Static Quote Posts/` not yet copied/optimized into the app
- Hand-authored MDX narrative (homepage manifesto, lore essays) not yet written — current copy is placeholder-grade

### In Progress
- (nothing actively in flight; v1 is shippable as-is)

## Implementation History

### 2026-05-14 — v1 platform built end-to-end in one session
**What was built:** Full Next.js 15 + Tailwind + Lenis/Framer Motion site under `web/`; content pipeline parsing repo-root docx/xlsx/csv into typed JSON; 10 routes (homepage, universe overview, 25 characters + index, 4 narrative pages, quotes library, workbook sales page); Supabase waitlist API.
**Why:** First web presence for The Motions IP. Goal was a premium scroll-animated marketing + lore + quote library + workbook sales page; gated workbook program deferred to v2.
**Files affected:** `web/**` (new project), `CODE_MAP.md`, `ENTRY_POINTS.md`, `DATA_FLOW.md`, `IMPORT_GRAPH_SUMMARY.md`, `FEATURE_BOUNDARIES.md`

### 2026-05-14 — Supabase production wired
**What was built:** Created Supabase project, applied `0001_init.sql` migration via SQL Editor, wired publishable/secret keys into `web/.env.local`. End-to-end test: POST /api/waitlist → row in `public.waitlist`. New `sb_publishable_…` / `sb_secret_…` key format works with `@supabase/ssr` as drop-in for the legacy anon/service_role JWTs.
**Why:** Enable the waitlist forms before launch.
**Files affected:** `web/.env.local`, `web/supabase/migrations/0001_init.sql`

### 2026-05-14 — Vercel deploy
**What was built:** Deployed to Vercel from GitHub. Required two settings fixes: Root Directory → `web`, Framework Preset → Next.js.
**Why:** Production hosting.
**Files affected:** Vercel project config (not in repo)

## Architecture Evolution

Stack is **Next.js 15 App Router + TypeScript + Tailwind + Lenis + Framer Motion + Supabase + Vercel**. The site is statically pre-rendered (37 of 38 routes are `○` or `●`); only `/api/waitlist` is dynamic. Content is treated as a build-time artifact: source `.docx` / `.xlsx` / `.csv` files live at the repo root, the pipeline emits `web/content/*.json`, and pages import that JSON via `web/lib/content.ts`. No CMS, no runtime fetching. See `architecture.md` and the root `CODE_MAP.md` / `DATA_FLOW.md` / `FEATURE_BOUNDARIES.md` files for detail.

## Lessons Learned

- Next.js 15 makes `params` a `Promise` in both page components AND `generateMetadata` — easy to miss on the metadata function and only fails at type-check, not compile
- Vercel requires both Root Directory AND Framework Preset set explicitly when the Next.js app isn't at the repo root; "No Next.js version detected" → root directory; "No Output Directory named 'public'" → framework preset
- Supabase's new `sb_publishable_…` / `sb_secret_…` API key format works as a drop-in replacement for the legacy anon / service_role JWTs without code changes
- React 19 stable + Next 15.5 is the cleanest peer-dep combo; the original 15.0.3 + React 19 RC tag from the package.json template caused ERESOLVE failures
- The docx character-database has a heading style that doesn't match canonical character names. Authoritative-source strategy: trust the quotes CSV for the cast list, use docx as best-effort bio supplement.
