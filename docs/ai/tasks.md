# Tasks

Active work. Update as items are completed and new work is identified.

## Sprint / Iteration

**Range:** 2026-05-14 to 2026-05-28
**Goal:** Polish v1 to launch-ready

## In Progress

(none — v1 just shipped, no work in flight)

## Up Next

- [ ] Editorial pass on homepage manifesto + workbook sales-page copy — M
- [ ] Hand-author or parse-fix the 25 character bios — M
- [ ] Move graphics from `The Motions Graphics (*)` / `The Motions Static Quote Posts/` into `web/public/assets/**` and reference them in the character cards / quote library — M
- [ ] Wire custom domain in Vercel + set as production — S
- [ ] Add Open Graph images and per-route metadata.openGraph — S
- [ ] Add Vercel Analytics or Plausible — XS
- [ ] Generate sitemap.xml + robots.txt — XS
- [ ] Mobile QA pass (375px–414px viewport, scroll-anim FPS check) — S

## Blocked

(none)

## Recently Completed

- [x] v1 scaffold: Next.js 15 + Tailwind + Lenis + Framer Motion in `web/` — 2026-05-14
- [x] Content pipeline parsing 7 source docs → 8 JSON files — 2026-05-14
- [x] 10 v1 routes built and serving 200 — 2026-05-14
- [x] Supabase `waitlist` migration + RLS — 2026-05-14
- [x] `/api/waitlist` end-to-end smoke test green — 2026-05-14
- [x] Vercel deploy with Root Directory `web` + Framework Preset Next.js — 2026-05-14
- [x] Repo index files (CODE_MAP, ENTRY_POINTS, DATA_FLOW, IMPORT_GRAPH_SUMMARY, FEATURE_BOUNDARIES) — 2026-05-14
- [x] AI context docs scaffolded under `docs/ai/` — 2026-05-14

## Bugs

- [ ] Character bios empty for all 25 characters — P2 — root cause: docx heading style doesn't match canonical names; parser falls through to stubs. Fix path: hand-author MDX per character OR tighten heading detection.

## Tech Debt

- [ ] `web/lib/content.ts` uses TypeScript `as` casts on imported JSON. If source-doc schema drifts, callers won't catch it at compile time. Adding Zod parse on load would harden this. — Low impact while content is build-time only.
- [ ] `web/components/universe/NarrativePage.tsx` renders mammoth-converted HTML via `dangerouslySetInnerHTML`. Trusted source today (our own docx). If any user-authored input ever flows in, must sanitize.
- [ ] `web/scripts/build-content.ts` is a single file owning 7 parsers. If any source-doc format changes the diff lands here. Acceptable for v1; consider splitting per-parser if pipeline grows.
- [ ] GSAP installed but unused. Either remove from `package.json` or schedule a pinned-section feature to justify it.
