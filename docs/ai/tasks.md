# Tasks

Active work. Update as items are completed and new work is identified.

## Sprint / Iteration

**Range:** 2026-05-16 to 2026-05-30
**Goal:** Universe overview polish + mobile menu + launch readiness

## In Progress

(none — Phase 2 just shipped)

## Up Next

- [ ] `/universe` overview page polish — currently a 6-tile grid + Welcome billboard; could add quick-look character chips or a scrolling montage of scene art — M
- [ ] Mobile nav hamburger — currently only logo + Workbook CTA on mobile; reveal Universe/Characters/Quotes/Workbook links — S
- [ ] Editorial copy pass on homepage manifesto + workbook sales-page so it stops sounding generic — M
- [ ] Custom domain wired in Vercel + set as production — S
- [ ] Per-route OG images + `metadata.openGraph` — S
- [ ] Vercel Analytics or Plausible — XS
- [ ] sitemap.xml + robots.txt — XS

## Blocked

(none)

## Recently Completed

- [x] Phase 2 hotfix on main: restored lib/content.ts type defs after PR-merge data loss (`58b6f7b`) — 2026-05-16
- [x] Lore page condensed into chapter accordion (`9f2aee1`) — 2026-05-16
- [x] Lore page editorial layout: drop caps + pull quotes + scene images (`58a6d9f`) — 2026-05-16
- [x] Exacerbators condensed: tile grid + click-to-expand modal (`0f90044`) — 2026-05-16
- [x] Exacerbators v1: 6 chains with 35 corruption rows (`bca0c4b`) — 2026-05-16
- [x] Arcs page: 5-step mechanism + 9 pair transformation cards (`f29f1df`) — 2026-05-16
- [x] Geography page: 5 borough cards with scenes + residents (`f262fb7`) — 2026-05-16
- [x] Asset presence manifest (`content/asset-presence.json`) — 2026-05-16

## Bugs

- [ ] 7 "Bad/Neutral" characters lack a structured `arc` field — P3 — docx uses different field labels for them; pages render fine without

## Tech Debt

- [ ] PR merges via GitHub UI have twice dropped type definitions from `lib/content.ts` — investigate root cause OR add a CI typecheck workflow to block bad merges (user chose "hotfix when it happens" for now)
- [ ] `CorruptionRow.tsx` is now unused after Exacerbators was condensed — could be removed
- [ ] `NarrativePage.tsx` is now unused after all four narrative pages got dedicated layouts — could be removed (or kept as a generic fallback)
- [ ] `web/lib/content.ts` uses TypeScript `as` casts on imported JSON; runtime validation via Zod would harden schema drift
- [ ] `web/components/universe/NarrativePage.tsx` renders mammoth-converted HTML via `dangerouslySetInnerHTML` — trusted source today; sanitize if any user-authored input ever flows in
- [ ] `web/scripts/build-content.ts` is now ~700 lines with 10 parsers in one file — acceptable but ripe for a per-parser split if it grows further
- [ ] GSAP installed but unused — either remove or schedule a pinned-section feature
- [ ] Amp + Velour have no scene panel — could commission/source two more illustrations or accept the silent degradation
- [ ] Pilot + Pinch don't appear in any borough's resident list (source doc puts them in parenthetical "lives here during week" notes); a small lookup table could surface them with a "weeknights / weekends" qualifier
