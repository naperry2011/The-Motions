# Architecture Decisions

ADR log. Write entries when a decision is hard to reverse, affects multiple components, or future-you will ask "why did we do it this way?"

---

## ADR-001: Next.js App Router + Supabase + Vercel as the v1 stack

**Date:** 2026-05-14
**Status:** Accepted

**Context**
Need to ship a premium scroll-animated marketing site, an explorable lore section, a quote library, and a workbook sales page — with a free public tier in v1 and a gated paid workbook program in v2. One developer, ~2 weeks of effort.

**Decision**
Next.js 15 App Router for the front end, Tailwind + Framer Motion + Lenis for the cinematic layer, Supabase (Postgres + Auth + Storage) as the backend, Vercel for hosting.

**Consequences**
- **Positive:** Statically pre-rendered routes (37 of 38 in v1) → low cost and fast. Same stack scales into v2 without rewrites — Supabase Auth is already wired, just ungated. Vercel + Next.js is the lowest-friction deploy on the market.
- **Negative:** Locks the project to Vercel-friendly Next conventions. Some Next 15 quirks (`params: Promise<…>` everywhere) catch you out the first time.
- **Neutral:** No CMS; content is build-time. Editorial changes require a redeploy.

**Alternatives considered**
- Astro + lightweight backend — Lighter for content sites, but harder to extend into the paid program in v2 without a stack change.
- Sanity / Payload CMS — Considered for non-technical editing. Deferred until that becomes a real blocker.

---

## ADR-002: One-time content pipeline → committed JSON instead of a CMS

**Date:** 2026-05-14
**Status:** Accepted

**Context**
All source material exists as Word docs, Excel files, and a CSV — sitting in the repo root. Two real options: stand up a CMS and migrate, or parse the source files once into JSON committed alongside the code.

**Decision**
Write `web/scripts/build-content.ts` to parse `.docx` (mammoth), `.xlsx` (sheetjs), and `.csv` (csv-parse) into typed JSON under `web/content/`. Commit the JSON. Re-run on every source-doc change.

**Consequences**
- **Positive:** Zero runtime backend for content. Reproducible and diff-able. Pages can `import` content as a typed module. No CMS auth or rate limits.
- **Negative:** Editorial changes require running the pipeline and pushing a commit. Non-technical contributors can't edit directly.
- **Neutral:** The source `.docx` files become the canonical authoring surface. They live at the repo root, not under `web/`.

**Alternatives considered**
- Sanity / Payload CMS — Adds ongoing infra cost and an admin surface to maintain. Defer until editorial velocity demands it.
- Hand-authored MDX from scratch — Highest editorial control, but throws away the existing source documents.

---

## ADR-003: Quotes CSV is the canonical character list

**Date:** 2026-05-14
**Status:** Accepted

**Context**
The character database `.docx` and the quotes `.csv` partially disagree. The docx parser using a heading heuristic pulled in 59 candidate "characters," many of which were stray phrases like "Best friends with Quake." The CSV has exactly 25 unique speakers, each with 10 quotes — clean and authoritative.

**Decision**
Build the character roster from the quotes CSV. Use the docx as a best-effort bio supplement: where a docx heading slug matches a canonical character slug, take its body as the bio. Otherwise the bio is empty and the page falls back to "{N} quotes below are the canon for now."

**Consequences**
- **Positive:** 25 clean characters, each with exactly 10 quotes. No garbage entries. Page contracts are predictable.
- **Negative:** Bios are empty for all 25 today, because no docx heading style happens to match canonical names exactly. Requires either tighter parser heuristics or hand-authored MDX bios to fix.
- **Neutral:** The fix is non-blocking — pages render fine without bios.

---

## ADR-004: Web app lives in `web/`, source content stays at repo root

**Date:** 2026-05-14
**Status:** Accepted

**Context**
Repo root already contains all source documents (docx, xlsx, csv, png). Need to add the Next.js app without burying or duplicating the source material.

**Decision**
Put the Next.js project at `web/`. Content pipeline reads from `..` (repo root). Vercel project Root Directory is `web`.

**Consequences**
- **Positive:** Source documents stay in their original location and remain the canonical authoring surface. The web app is cleanly isolated.
- **Negative:** Vercel project setup needs explicit Root Directory configuration; defaults to repo root and fails with "No Next.js version detected."
- **Neutral:** Index files (CODE_MAP, etc.) live at the repo root, not under `web/`.

---

## ADR-005: Supabase Auth wired but ungated in v1

**Date:** 2026-05-14
**Status:** Accepted

**Context**
v1 ships before the paid workbook program. We could omit auth entirely and add it later, or wire it now and leave it unused.

**Decision**
Install `@supabase/ssr`, build `lib/supabase/server.ts`, and have `/api/waitlist` use it. No sign-in UI. No gated routes. v2 will flip a feature flag and gate `/workbook/program/*` without re-plumbing the data layer.

**Consequences**
- **Positive:** v2 transition is mostly UI work + Stripe wiring, not plumbing.
- **Negative:** A small amount of code carries no v1 value.
- **Neutral:** Env vars (`NEXT_PUBLIC_SUPABASE_*`, `SUPABASE_SERVICE_ROLE_KEY`) are required in v1 even though auth is dormant.

---
