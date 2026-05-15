# Tasks

Active work. Update as items are completed and new work is identified.

## Sprint / Iteration

**Range:** 2026-05-14 to 2026-05-28
**Goal:** Phase 1 polish on `perry-phase1` — visual identity, real graphics, content density, mobile

## In Progress

(none — most recent batch landed at `bea18fa`)

## Up Next

- [ ] Polish the `/universe` overview + the four narrative pages (`/geography`, `/lore`, `/arcs`, `/exacerbators`) — currently still using auto-converted mammoth HTML, no cartoon styling — M
- [ ] Editorial pass on hand-authored copy (homepage manifesto, workbook sales-page) so it's not generic — M
- [ ] Mobile nav menu — currently only logo + Workbook CTA show on mobile; add a small hamburger that reveals Universe/Characters/Quotes/Workbook links — S
- [ ] Custom domain wired in Vercel + set as production — S
- [ ] Per-route OG images + `metadata.openGraph` — S
- [ ] Vercel Analytics or Plausible — XS
- [ ] sitemap.xml + robots.txt — XS

## Blocked

(none)

## Recently Completed

- [x] Profile vibe pass + sitewide mobile pass (`bea18fa`) — 2026-05-14
- [x] Character bios fleshed out from canonical PDF/docx (`f8bfbcc`) — 2026-05-14
- [x] Quotes page redesign: compact grid + pagination + click-to-expand modal (`4936440`) — 2026-05-14
- [x] Graphics(1) audit → hero-cards + scenes remap (`13cbe1b`) — 2026-05-14
- [x] Logo, billboard, group shot, 88 quote posters, sample PDF wired (`ed6d1ec`) — 2026-05-14
- [x] Image optimization pipeline (sharp → WebP), 317 MB → 29 MB — 2026-05-14
- [x] Mo Town cartoon rebrand (`dd00e2e`) — 2026-05-14
- [x] PR hotfix to main after merge corrupted `quotes/page.tsx` JSX — 2026-05-14
- [x] Removed redundant cast group-shot from `/universe/characters` (`15e70b3`) — 2026-05-14

## Bugs

- [ ] 7 "Bad/Neutral" characters lack a structured `arc` field (Bossy Boots, Honeytrap, Velour, Amp, Mirrorball, Glitch, Capital) — docx uses different field labels for them — P3 — pages render fine without it, just missing the Arc card

## Tech Debt

- [ ] `web/lib/content.ts` uses TypeScript `as` casts on imported JSON. If source-doc schema drifts, callers won't catch it at compile time. Adding Zod parse on load would harden this. — Low impact while content is build-time only.
- [ ] `web/components/universe/NarrativePage.tsx` renders mammoth-converted HTML via `dangerouslySetInnerHTML`. Trusted source today; sanitize if any user-authored input ever flows in.
- [ ] `web/scripts/build-content.ts` is a single file owning 7 parsers. Acceptable for v1; split per-parser if pipeline grows.
- [ ] GSAP installed but unused — either remove from `package.json` or schedule a pinned-section feature.
- [ ] Amp + Velour have no scene panel — could either commission/source two more illustrations or design the profile so the missing scene reads as intentional (currently degrades silently).
- [ ] No `lock` files for Word docx (`.gitignore` has `~$*` now, but the deploy still needs to be careful not to commit Word lock files).
