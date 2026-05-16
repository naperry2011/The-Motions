# Roadmap

Forward-looking direction. Pair with tasks.md (active work) and memory.md (history).

## Vision

The Motions is a premium creative IP and solopreneur brand companion. The web platform is the public face: a cinematic Mo Town universe (25 characters, 250 quotes, geography, arcs, exacerbator interactions) layered with an 8-module / 216-path workbook program. v1 establishes the storytelling surface and a waitlist. v2 monetizes the workbook through a gated paid tier.

## Current Focus

**Theme:** Launch readiness — make `/universe` overview as strong as the four narrative pages, fix mobile navigation, get a custom domain on production.
**Goals:**
1. `/universe` overview polish so the entry to the universe matches the bar set by `/geography` / `/arcs` / `/exacerbators` / `/lore`
2. Mobile nav menu so non-character pages are reachable on phones
3. Custom domain + analytics + OG images — small launch chores

## Now

- Phase 2 narrative pages all shipped (Geography, Arcs, Exacerbators, Lore) — **Done** through `9f2aee1`
- `main` redeploy unblocked after PR-merge hotfix — **Done** (`58b6f7b`)
- Mobile nav menu (hamburger + sheet) + Phase 2 mobile polish — **Done** (`4b9d6ed`)
- `/universe` overview polish — **Not started**

## Next

- `/universe` overview page polish (currently a 6-tile grid + Welcome billboard; opportunity for character chips / scene montage)
- Editorial copy pass on homepage manifesto + workbook sales-page long-form
- Custom domain + Vercel production swap
- Analytics + OG images + sitemap.xml + robots.txt (one combined chore)

## Later

- **v2 — paid workbook program**
  - Stripe Checkout + webhook → `purchases` table → entitlement flag on user
  - Gated routes: `/workbook/program/module/[n]`, `/workbook/program/path/[n]/[p]`
  - `module_progress`, `path_progress` tables + progress UI
  - Exercise PDF downloads from Supabase Storage
  - Magic-link sign-in UI (Supabase Auth already wired but ungated)
  - Resend (or similar) for waitlist + enrollment emails
- Mo Town interactive map (illustrated SVG with hotspots → character / district)
- Per-character art for Amp and Velour (currently use hero card; no portrait or scene)
- Cohort program: scheduled live sessions layered on top of the self-paced workbook
- CI typecheck workflow that blocks PR merges if `tsc --noEmit` fails (would have caught the PR #6 type-stripping issue automatically)

## Recently Completed

- Mobile nav menu (hamburger + slide-down sheet) + Phase 2 mobile fixes — 2026-05-16
- Phase 2: four narrative pages restructured (Geography / Arcs / Exacerbators / Lore) with bespoke parsers + components — 2026-05-16
- Asset presence manifest decoupling fs scans from client components — 2026-05-16
- Phase 1: visual rebrand, full graphics wiring, character bios, sitewide mobile pass — 2026-05-14

## Deferred / Cancelled

- Headless CMS (Sanity / Payload) — Sticking with committed JSON. Revisit only if non-technical editing becomes a blocker.
- GSAP ScrollTrigger usage — Installed but never imported. Framer Motion `whileInView` + `useScroll` covers every section.
- Per-character commissioned portrait art for Amp/Velour — Hero card stands in well enough; deferring until v2.
- CI typecheck workflow — User chose "hotfix when it happens" for the PR-merge data-loss issue rather than build a prevention layer.
