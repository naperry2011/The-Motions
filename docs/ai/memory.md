# Project Memory

Running history of what's been built and current state. Update after major changes.

## Current State

**Status:** Active Development — Phase 1 + Phase 2 both shipped to `main`. Working branch `perry-phase2`; user merges via GitHub PRs.
**Last Updated:** 2026-05-16
**Version:** `main` at `58b6f7b` (post-hotfix), `perry-phase2` at `4b9d6ed` (mobile nav)

### What's Working
- Next.js 15 App Router site under `web/` — 39 routes, clean build, deployed to Vercel from `main`
- Full Mo Town cartoon visual identity: Bowlby One chunky display with terracotta offset shadow, cream paper-grain editorial sections alternating with deep teal cinematic ones, sticker badges + decorative SVG squiggles/zigzags
- Real character art everywhere: 25 hero cards, 16 portraits, 23 location scenes, 18 title cards, 50 illustrations, 88 designed quote posters, official bubble wordmark logo
- Sample workbook PDF downloadable from `/workbook` hero
- All 25 character profiles have structured data (state, represents, personality, role, family ties) parsed from the canonical database
- Quote library is compact + paginated (30/load) with click-to-expand modal showing the designed poster when available
- All four narrative pages (`/universe/geography`, `/arcs`, `/exacerbators`, `/lore`) now use page-specific structured parsers with custom layouts — no more mammoth-HTML walls
  - **Geography**: 5 borough cards with accent scenes, resident chips, Before/After Capital vibe panels
  - **Arcs**: 5-step Core Healing Mechanism band + 9 PairArc cards (Shadow → Grounded portraits + stage cards + growth bullets)
  - **Exacerbators**: 6 chain bands with click-to-expand tile grid → modal (Exacerbator + Victim portraits + 5 fields)
  - **Lore**: 12-chapter accordion with terracotta-shadowed Bowlby drop caps, optional scene images, mustard pull-quotes
- Asset presence is a precomputed manifest (`content/asset-presence.json`) so client components can check `hasPortrait`/`hasHeroCard` without `fs` imports
- Sitewide mobile pass: nav shrinks, hero fonts scale, paddings tighten
- Supabase waitlist healthy: `public.waitlist` + RLS, `/api/waitlist` Zod-validated

### Known Issues
- 7 "Bad/Neutral" characters (Bossy Boots, Honeytrap, Velour, Amp, Mirrorball, Glitch, Capital) lack a structured `arc` field — docx uses different field labels for them. Pages render fine without the Arc card.
- Amp and Velour have no scene panel (only 23 of 25 characters got scenes); their profile skips the scene band gracefully
- 2 PR merges via GitHub UI have dropped lines from `web/lib/content.ts` (specifically the new type definitions while keeping their casts) — root cause unknown; recipe is documented (see Lessons Learned)
- Pilot and Pinch don't show up in any borough's resident list — they're noted as transients in the doc ("live there during the week", "visit on weekends") and intentionally not assigned

### In Progress
- (nothing actively in flight)

## Implementation History

### 2026-05-14 — v1 platform built end-to-end
Full Next.js + Tailwind + Lenis/Framer Motion site, content pipeline, 10 routes, Supabase waitlist API, Vercel deploy.

### 2026-05-14 — Supabase wired + Vercel deployed
Migration applied via SQL Editor, `sb_publishable_…`/`sb_secret_…` keys in `.env.local`. Two Vercel settings: Root Directory `web`, Framework Preset Next.js.

### 2026-05-14 — Phase 1 rebrand to Mo Town cartoon style (commit `dd00e2e`)
Swapped luxury-dark palette for canon Mo Town. Bowlby One + Fraunces + Inter. Cream paper-grain + teal cinematic sections. 3px borders + cartoon offset shadows. Decor primitives + 16 portraits + 18 title cards + 18 scenes wired.

### 2026-05-14 — Full graphics wiring + image pipeline (commit `ed6d1ec`)
Official bubble wordmark logo, Welcome to Mo Town billboard, cast group shot, 88 designed quote posters, sample PDF. New `scripts/optimize-images.ts` (sharp): 317 MB raw → 29 MB shipped WebP.

### 2026-05-14 — Graphics(1) audit + remap (commit `13cbe1b`)
50 unlabeled files mapped: `1=welcome`, `50=cast`, `2-24=23 scene panels`, `25-49=25 hero cards`. After remap every canonical character has at least a hero card.

### 2026-05-14 — Quotes page redesign (commit `4936440`)
Compact uniform cards, "Load N more" pagination starting at 30, click-to-expand modal showing the full poster when available, character chips collapsed into a dropdown.

### 2026-05-14 — Character profile fleshed out (commit `f8bfbcc`)
New character section of `build-content.ts` parses all 25 characters with structured `CharacterTraits` (state, represents, personality, role, family ties, backstory, arc). Profile page renders Stats / Family / Backstory / Arc cards.

### 2026-05-14 — Profile vibe + sitewide mobile pass (commit `bea18fa`)
Represents promoted to italic kicker, pair badge linking partner character, personality manifesto card, family bullets as cream chips, sticker color follows state. Mobile: nav shrinks, hero fonts scale, all hero sections tighten.

### 2026-05-16 — Phase 2: narrative pages (commits `f262fb7`, `f29f1df`, `bca0c4b`, `0f90044`, `58a6d9f`, `9f2aee1`)
- **Geography** (`f262fb7`): `buildGeographyStructured()` parses 5 boroughs + their fields + residents from the "HOUSING BY BOROUGH:" summary. New `Borough`/`GeographyDoc` types. New `BoroughCard` + `CharacterChip` components. Each borough gets one resident's scene as accent art via `BOROUGH_ACCENT_SLUG` lookup.
- **Arcs** (`f29f1df`): `buildArcsStructured()` parses 5-step mechanism + 9 PairArc records with full Starting/Turning/Practice/Backslide/Growth/GroundedRole fields. `MechanismSteps` + `PairArcCard` components. Page alternates cream/mustard/teal cards.
- **Exacerbators v1** (`bca0c4b`): `buildExacerbatorsStructured()` parses 6 chain headers (handling both `HONEYTRAP'S` and `BOSSY BOOTS'` possessives) with 5-field interactions. Full-width stacked `CorruptionRow` cards.
- **Exacerbators condensed** (`0f90044`): converted to tile-grid + click-to-expand modal. `'use client'` couldn't import the fs-using `CharacterPortrait`, so introduced `content/asset-presence.json` manifest generated at build-content time. `CharacterPortrait` and `QuotePost` now read the manifest instead of doing fs scans, making them client-safe.
- **Lore** (`58a6d9f`): `buildLoreStructured()` parses 12 chapters by text pattern (mammoth gave zero heading tags). Caps at "TRANSLATING THE MOTIONS INTO YOUR MARKETING & SERVICES" — past that is internal service positioning, not public lore. New `.lore-prose` CSS for terracotta-shadowed Bowlby drop cap on first paragraph, scaled type, h3 sub-headings.
- **Lore condensed** (`9f2aee1`): converted to chapter accordion. `LoreChapter` client component with collapsed header (number disc + sticker + scene chip + read time + title + +/× toggle) and animated height expand showing the full editorial body. First chapter open by default.

### 2026-05-16 — Phase 2 hotfix on main (commit `58b6f7b`)
PR #6 merged perry-phase2 → main but the merge dropped the new type definitions in `web/lib/content.ts` (Borough, GeographyDoc, MechanismStep, PairArc, ArcsDoc, CorruptionInteraction, ExacerbatorChain, ExacerbatorsDoc, LoreChapter, LoreDoc) while keeping the `as ArcsDoc` etc. casts that depend on them. Vercel build failed with `Parameter 'a' implicitly has an 'any' type`. Hotfixed by restoring the file from perry-phase2 directly. Second time this has happened on a PR merge — same fix recipe each time.

### 2026-05-16 — Mobile nav menu + Phase 2 mobile polish (commit `4b9d6ed`)
- `SiteNav` gained a hamburger button (mustard pill, morphs to terracotta X) that opens a slide-down sheet covering ~all 8 routes (Universe, the four narrative pages, Characters, Quotes, Workbook) as chunky cartoon-pill rows with offset shadows, alternating cream/mustard. Active route shown in terracotta with "here" label.
- Sheet handles: backdrop dim + blur, body-scroll lock, Escape + outside-click + route-change all close, hamburger animates ☰ → ✕.
- A prominent "Get the workbook ↗" CTA + italic tagline sits at the bottom of the sheet so the conversion path stays one tap away.
- Phase 2 mobile fixes: `PairArcCard` and `ChainSection` Avatar components had unconditional `text-right` on right-aligned cells; on mobile (where columns stack) it looked stranded. Now `sm:text-right` so it only applies once columns sit side-by-side.
- Side effect: the GitHub merge from broken main into perry-phase2 (commit `3702544`) had stripped lib/content.ts types on this branch too. Restored from post-hotfix main during the same commit.

## Architecture Evolution

Stack unchanged: **Next.js 15 App Router + TypeScript + Tailwind + Lenis + Framer Motion + sharp + Supabase + Vercel**. The Phase-2 work shifted the four narrative pages from a single generic `NarrativePage` component (which renders mammoth HTML through `dangerouslySetInnerHTML`) to **page-specific structured parsers + dedicated React components per topic**:

- `web/scripts/build-content.ts` now contains 5 structured parsers (characters, geography, arcs, exacerbators, lore) + the legacy `buildNarrativeDoc` for back-compat HTML.
- `web/lib/content.ts` exports 8 doc types and helpers (`getCharacter`, `getQuotesByCharacter`, `getPair`).
- `web/components/universe/` now has 8 components: `CharacterChip`, `BoroughCard`, `MechanismSteps`, `PairArcCard`, `CorruptionRow` (legacy), `ChainSection`, `LoreChapter`, `NarrativePage` (legacy fallback).
- `web/components/ui/SiteNav.tsx` is a `'use client'` component with a hamburger + full-width mobile sheet (uses `usePathname`, `framer-motion`).
- New `web/content/asset-presence.json` is the source of truth for `hasPortrait`/`hasHeroCard`/`hasScene`/`hasTitle`/`hasQuotePost` — generated at build time, importable from both server and client.

## Lessons Learned

- The `next build` command inside `web/` clobbers `.next/server/vendor-chunks/*.js` that `next dev` depends on — running them in parallel breaks the dev server until restart.
- Windows dev workflow: orphan `node` processes hold port 3000 after a TaskStop; new dev starts on 3001+. Recipe: `Get-Process node | Stop-Process -Force` then `rm -rf .next` then `npm run dev`.
- Big edits + mass renames put webpack's HMR cache out of sync — symptom is `__webpack_modules__[moduleId] is not a function` or `ChunkLoadError`. Fix: stop dev → `rm -rf .next` → restart → hard refresh.
- `'use client'` components can't bundle `fs` / `path` / other Node built-ins. If you need a server-only data lookup from a client component, precompute it at build time into a JSON file and import that. This is how `content/asset-presence.json` works.
- **PR merges via GitHub UI have twice dropped lines from `web/lib/content.ts`** — specifically the new type definitions while keeping their `as X` casts. Root cause not yet investigated. Hotfix recipe: `git checkout main` → `git checkout <branch> -- web/lib/content.ts` → commit → push.
- Mammoth's heading-level extraction works for some docx files (character database) and not others (lore doc). When it doesn't, fall back to text-pattern detection — all-caps lines of 2+ words with no terminating punctuation.
- The docx documents intermix two audiences: public-facing lore + internal studio service positioning. Watch for section breaks like "TRANSLATING THE MOTIONS INTO YOUR MARKETING & SERVICES" — content past that point belongs to the studio, not the platform user.
- The user's pattern for character mentions in docs (multi-name entries like "Polish - Penthouse (Pilot & Pinch live here during week)") puts some characters into structured fields and others into parenthetical asides. The structured parsers should respect that distinction.
