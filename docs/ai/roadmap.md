# Roadmap

Forward-looking direction. Pair with tasks.md (active work) and memory.md (history).

## Vision

The Motions is a premium creative IP and solopreneur brand companion. The web platform is the public face: a cinematic Mo Town universe (25 characters, 250 quotes, geography, arcs, exacerbator interactions) layered with an 8-module / 216-path workbook program. v1 establishes the storytelling surface and a waitlist. v2 monetizes the workbook through a gated paid tier.

## Current Focus

**Theme:** Phase 1 polish — every public surface looks and feels like Mo Town, not a generic Next.js site.
**Goals:**
1. Bring the four narrative pages (geography / lore / arcs / exacerbators) up to the same cartoon-vibe bar as the character profiles
2. Editorial / copy pass so the marketing surfaces stop sounding generic
3. Mobile menu so non-character pages are reachable on phones beyond the Workbook CTA

## Now

- Character profile bios fleshed out from the canonical database — **Done** (`f8bfbcc`)
- Character profile vibe + mobile pass — **Done** (`bea18fa`)
- Narrative pages styling pass (geography, lore, arcs, exacerbators) — **Not started**

## Next

- `/universe` overview polish (currently just a 6-tile grid + Welcome billboard)
- Mobile nav hamburger so universe/characters/quotes are reachable from mobile beyond the homepage entry point
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

## Recently Completed

- Phase 1 visual rebrand to Mo Town cartoon style — 2026-05-14
- Full graphics wiring (logo, billboard, group shot, 88 quote posters, sample PDF) — 2026-05-14
- Graphics(1) 50-file audit + remap to hero-cards/ + scenes/ — 2026-05-14
- Image optimization pipeline (sharp → WebP, 317 MB → 29 MB) — 2026-05-14
- Quote library redesign (compact grid, pagination, modal) — 2026-05-14
- Character bios from canonical database (structured traits) — 2026-05-14
- Sitewide mobile pass (nav, hero fonts, paddings, toolbar wrap) — 2026-05-14
- Hotfix to `main` after PR-merge JSX corruption — 2026-05-14

## Deferred / Cancelled

- Headless CMS (Sanity / Payload) — Sticking with committed JSON. Revisit only if non-technical editing becomes a blocker.
- GSAP ScrollTrigger usage — Installed but never imported. Framer Motion `whileInView` + `useScroll` covers every section. Keep for later if a pinned sequence demands it.
- Per-character commissioned portrait art for Amp/Velour — Hero card stands in well enough; deferring until v2.
