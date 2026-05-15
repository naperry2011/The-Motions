# Project Memory

Running history of what's been built and current state. Update after major changes.

## Current State

**Status:** Active Development — Phase 1 complete on `perry-phase1`, merged through to `main` once already, more polish landing on the branch.
**Last Updated:** 2026-05-14
**Version:** `bea18fa` on `perry-phase1` (most recent local commit; user pushes manually)

### What's Working
- Next.js 15 App Router site under `web/` — 38 routes, clean build, deployed to Vercel from `main`
- Full Mo Town cartoon visual identity wired in: chunky Bowlby One display with terracotta offset shadow, cream paper-grain editorial sections alternating with deep teal cinematic ones, sticker badges + decorative SVG squiggles/zigzags
- Real character art everywhere: 25 hero cards, 16 portraits, 23 location scenes, 18 title cards, 50 illustrations, 88 designed quote posters, official bubble wordmark logo
- Sample workbook PDF downloadable from `/workbook` hero
- All 25 character profiles have structured data (state, represents, personality, role, family ties) parsed from the canonical database — pages now read like proper character bios instead of placeholder stubs
- Quote library is compact + paginated (30/load) with click-to-expand modal showing the designed poster when available; character filter is a dropdown not a 26-chip wrap
- Sitewide mobile pass: nav shrinks, hero fonts scale down, paddings tighten at sm: breakpoint
- Supabase waitlist still healthy: `public.waitlist` + RLS, `/api/waitlist` Zod-validated, end-to-end tested

### Known Issues
- 7 "Bad/Neutral" characters (Bossy Boots, Honeytrap, Velour, Amp, Mirrorball, Glitch, Capital) lack a structured `arc` field — the docx uses different field labels for them. They render fine; just no Arc card.
- Amp and Velour have no Graphics(1) scene panel (only 23 of 25 characters got scenes); their profile skips the scene band gracefully
- Free-form `bodyHtml` is empty for most characters because the docx fields cover everything — that's correct, but it means there's no long-form narrative prose anywhere on character pages

### In Progress
- (nothing actively in flight)

## Implementation History

### 2026-05-14 — v1 platform built end-to-end
Full Next.js + Tailwind + Lenis/Framer Motion site, content pipeline, 10 routes, Supabase waitlist API, Vercel deploy.

### 2026-05-14 — Supabase wired + Vercel deployed
Migration applied via SQL Editor, `sb_publishable_…`/`sb_secret_…` keys in `.env.local`. Two Vercel settings: Root Directory `web`, Framework Preset Next.js.

### 2026-05-14 — Phase 1 rebrand to Mo Town cartoon style (commit `dd00e2e`)
Swapped luxury-dark palette for canon Mo Town (teal/terracotta/mustard/cream/ink); Bowlby One chunky display + Fraunces italic + Inter; cream paper-grain editorial sections alternating with teal cinematic ones; 3px borders + cartoon offset shadows; decor primitives (Squiggle/Zigzag/ShakeLines/Sticker); 16 portraits + 18 title cards + 18 scenes wired into character pages with graceful fallback.

### 2026-05-14 — Full graphics wiring + image pipeline (commit `ed6d1ec`)
Official bubble wordmark logo into nav; "Welcome to Mo Town" billboard on `/universe`; cast group shot on `/universe/characters`; 88 designed quote posters integrated into the quotes library; sample PDF downloadable from `/workbook`. New `scripts/optimize-images.ts` (sharp): 317 MB raw PNG → 29 MB shipped WebP.

### 2026-05-14 — Graphics(1) audit + remap (commit `13cbe1b`)
The 50 unlabeled numbered files were audited (visually reviewed each) and mapped: `1=welcome`, `50=cast`, `2-24=23 character scene panels`, `25-49=25 character hero cards`. Mapping committed at `docs/asset-map.md`. After remap every canonical character has at least a hero card — the 9 previously without portrait art (Amp, Bossy Boots, Capital, Echo, Glitch, Honeytrap, Mirrorball, Resonate, Velour) now lead with their hero card on their profile.

### 2026-05-14 — Quotes page redesign (commit `4936440`)
Compact uniform cards (replaces the mixed-size big-poster grid), "Load N more" pagination starting at 30, click-to-expand modal showing the full poster when available, character chips collapsed into a dropdown. Initial scroll length is roughly a third of what it was.

### 2026-05-14 — PR #1 / PR #2 merged to main + hotfix
Two PRs merged from `perry-phase1` to `main`. PR #2 introduced a JSX corruption in `quotes/page.tsx` and `QuoteLibrary.tsx` (mismatched `</div>` instead of `</RevealOnView>`, Chip helper spliced into QuoteModal). Hotfixed directly on main as `743fd39` by checking out the clean files from `perry-phase1`. Both branches re-synced.

### 2026-05-14 — Character profile fleshed out from canonical database (commit `f8bfbcc`)
Rewrote the character section of `build-content.ts`. New HEADING_RE matches all 25 character section starts (`QUAKE (Shadow State: …)`, `CAPITAL (The Apex Predator)`, etc.). Per-section field extractor pulls Age/Pronouns/Represents/Personality/Work/Role/Sexuality/Appearance/Backstory/Dynamic-Arc/Alignment into a typed `CharacterTraits` object; Family/Relationships collected as a bullet array. `NAME_ALIASES = { flo: 'flow' }` reconciles the docx's "FLO" with the canon "Flow". Schema in `lib/content.ts` extended; profile page renders structured Stats / Family / Backstory / Arc cards.

### 2026-05-14 — Profile vibe + sitewide mobile pass (commit `bea18fa`)
"Represents" promoted to a large italic kicker line under the title; pair badge (`↔ Paired with HARBOR`) computed via new `getPair()` helper; personality moved into a full-width mustard manifesto card; family bullets become individual cream chips inside a terracotta card; sticker color derives from character state. Mobile: nav shrinks, hero fonts scale, hero portrait constrained to `max-w-sm`, quotes toolbar wraps cleanly (search row + dropdown/shuffle/count row), all hero sections tighten from `pt-36 pb-28` to `pt-28 pb-20` at `< sm`.

## Architecture Evolution

Stack unchanged: **Next.js 15 App Router + TypeScript + Tailwind + Lenis + Framer Motion + Supabase + Vercel**. What evolved is the surface area:

- Content pipeline is the same shape (`scripts/build-content.ts` → `content/*.json` → typed loaders) but the character parser is now serious — every character produces a `CharacterTraits` object alongside the back-compat `bio` string.
- `lib/content.ts` grew helpers: `getCharacter`, `getQuotesByCharacter`, `getPair`. Schema types are exported.
- Assets are now WebP everywhere except the logo PNG; a `scripts/optimize-images.ts` (sharp) rebuilds the optimized set on demand.
- Decor primitives layer: `Squiggle`, `Zigzag`, `ShakeLines`, `Dot`, `Sticker`, `CharacterPortrait`/`HeroCard`/`Title`/`Scene`, `QuotePost`. Pages compose these instead of restyling from scratch.

## Lessons Learned

- The `next build` command inside the `web/` directory clobbers `.next/server/vendor-chunks/*.js` that the dev server depends on — running them in parallel breaks `next dev` until restart. Kill dev before running build.
- Windows dev workflow: orphan `node` processes hold port 3000 after a TaskStop; new dev starts on 3001/3002/3003. Have to `Get-NetTCPConnection -LocalPort 3000 | Stop-Process` to force-free it.
- Big mass-renames during a session put webpack's HMR cache out of sync — symptom is `__webpack_modules__[moduleId] is not a function` in the browser. Fix is always: stop dev → `rm -rf .next` → restart → hard refresh.
- PR merges through GitHub's UI can produce subtly corrupted JSX when there are large parallel edits across both branches — saw `</RevealOnView>` get rewritten as `</div>` after a merge. Verify post-merge builds before triggering Vercel.
- The 9 characters lacking simple portrait art still feel "complete" once a hero card stands in — investing in a 1:1 portrait set for them is no longer urgent.
- The "FLO" / "Flow" mismatch between docx and CSV is a precedent for treating the quotes CSV as canonical and adding `NAME_ALIASES` when source documents disagree.
