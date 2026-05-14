# Roadmap

Forward-looking direction. Pair with tasks.md (active work) and memory.md (history).

## Vision

The Motions is a premium creative IP and solopreneur brand companion. The web platform is the public face: a cinematic Mo Town universe (25 characters, 250 quotes, geography, arcs, exacerbator interactions) layered with an 8-module / 216-path workbook program. v1 establishes the storytelling surface and a waitlist. v2 monetizes the workbook through a gated paid tier.

## Current Focus

**Theme:** v1 polish + launch
**Goals:**
1. Replace placeholder copy and character stubs with the real editorial voice
2. Drop in real graphics (existing PNG library under `The Motions Graphics (*)`, quote posts, character art) so the cinematic layer has visual weight, not just type
3. Validate the homepage / workbook waitlist conversion on real traffic before building paid tier

## Now

- Editorial pass on hand-authored MDX (homepage manifesto, lore essays, workbook sales-page long-form) — Not started
- Character bio backfill: either fix the docx parser heuristics OR hand-author bios in MDX per character — Not started
- Move graphics/quote-post images into `web/public/assets/**` and surface them on character cards + quote library — Not started

## Next

- Custom domain + Vercel production swap from the auto-generated URL
- Analytics (Vercel Analytics or Plausible) + Open Graph images per route
- Sitemap, robots.txt, structured data for the universe pages
- Mobile pass — verify scroll animations hold 60fps on mid-range Android

## Later

- **v2 — paid workbook program**
  - Stripe Checkout + webhook → `purchases` table → entitlement flag on user
  - Gated routes: `/workbook/program/module/[n]`, `/workbook/program/path/[n]/[p]`
  - `module_progress`, `path_progress` tables + progress UI
  - Exercise PDF downloads from Supabase Storage
  - Magic-link sign-in UI (Supabase Auth is already wired but ungated)
  - Resend (or similar) for waitlist + enrollment emails
- Mo Town interactive map (illustrated SVG with hotspots → character / district)
- Per-character art commissions (placeholder is type-only today)
- Cohort program: scheduled live sessions layered on top of the self-paced workbook

## Recently Completed

- v1 platform end-to-end (10 routes, content pipeline, motion primitives, Supabase waitlist) — 2026-05-14
- Vercel deploy from GitHub `naperry2011/The-Motions` — 2026-05-14
- Supabase project + migration + key wiring + end-to-end smoke test — 2026-05-14

## Deferred / Cancelled

- Headless CMS (Sanity / Payload) — Chose committed JSON + MDX instead. Revisit only if non-technical editing becomes a blocker.
- GSAP ScrollTrigger usage — Installed but never imported in v1. Framer Motion `whileInView` + `useScroll` covered every section. Keep for later if a pinned sequence demands it.
