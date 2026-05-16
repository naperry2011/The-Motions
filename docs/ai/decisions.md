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

**Update 2026-05-14:** Bios are no longer empty — see ADR-008 for the
structured-traits parser. The CSV remains canonical for the cast list;
`NAME_ALIASES = { flo: 'flow' }` reconciles disagreements between the
docx's "FLO" and the CSV's "Flow".

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

## ADR-006: One asset directory per role, not per character

**Date:** 2026-05-14
**Status:** Accepted

**Context**
The source graphics arrived in five folders ("The Motions Graphics (1..5)") with mixed contents: characters, scenes, title cards, hero illustrations, group shots, billboards. Components needed predictable lookups like "does Quake have a portrait?" without ad-hoc fs scans per render.

**Decision**
Organize by role, not by character: `public/assets/{characters,hero-cards,scenes,titles,illustrations,quote-posts,logo}/`. Every file inside is named `{slug}.webp` (or for illustrations, descriptive: `welcome.webp`, `cast.webp`). The `CharacterPortrait` component does a one-time fs scan at module load to build `availablePortraits`/`availableHeroCards`/`availableScenes`/`availableTitles` sets; helpers (`hasPortrait(slug)`, `hasHeroCard(slug)`, etc.) are O(1) presence checks.

**Consequences**
- **Positive:** Adding a new image is just dropping a `.webp` in the right folder — no code change. Pages render gracefully whether a given character has 0–4 art types available.
- **Negative:** Renames are required when source filenames change (e.g. "Resonate Radio Station.png" → `resonate.webp`). `scripts/remap-illustrations.ts` codifies the mapping for the Graphics(1) folder.
- **Neutral:** The fallback chain `portrait → hero-card → initial-circle` is encoded in the component, not in each call site.

---

## ADR-007: WebP image pipeline, source PNGs stay in source folders

**Date:** 2026-05-14
**Status:** Accepted

**Context**
Source illustrations are 1–3 MB PNGs each. Without optimization, the asset payload was 317 MB — over Vercel's 100 MB compressed-deploy limit and slow regardless. Two paths: (a) store originals out-of-tree (e.g. Cloudflare R2) and serve via CDN; (b) optimize in-tree once and commit the smaller derivatives.

**Decision**
Build `web/scripts/optimize-images.ts` using sharp. Each role directory gets a max-width + quality target: quote-posts 1000px @ q78, scenes/illustrations 1600px @ q80, characters 800px @ q85, hero 1600px @ q80. Originals are replaced in place with `.webp`. `npm run assets:optimize` is run after new PNGs land. The original source PNGs stay under the repo root (`Character Documentation/`, `The Motions Graphics (1..5)/`) untouched.

**Consequences**
- **Positive:** Total shipped assets: 317 MB → 29 MB. Well under Vercel's 100 MB ceiling with headroom. Next.js `<Image>` still does runtime AVIF/WebP serving for further reduction.
- **Negative:** Optimized assets are committed to git, growing the repo over time. Re-running the script is destructive (overwrites in place); originals only live in the source folders.
- **Neutral:** Logo PNGs (~268 KB total) skip the pipeline — too small to bother.

---

## ADR-008: Character profiles use structured traits, not free-form bios

**Date:** 2026-05-14
**Status:** Accepted (supersedes part of ADR-003)

**Context**
The previous parser concatenated each character's docx body into a single `bio` string. The string was empty for most characters because the heading heuristic didn't match. Even when it didn't fail, a wall of free-form text doesn't render well — and the source document has a consistent structure (Age, Pronouns, Represents, Personality, Role, Family/Relationships, Backstory, Dynamic/Arc) worth preserving.

**Decision**
Rewrite the character parser to detect `^([A-Z][A-Z\s]+?)\s+\(([^)]+)\)\s*$` section headers and pull each "Field: value" line into a typed `CharacterTraits` object. Family/Relationships bullets collect into an array (`string[]`). Free-form paragraphs that don't match any known field land in a `bodyHtml` field for rare cases. The profile page renders Stats / Family / Backstory / Arc as distinct cards rather than one prose block.

**Consequences**
- **Positive:** 25/25 characters now show personality + role + family + represents. 18/25 also show an arc. Profile pages read like proper biographies. Pages can conditionally render exactly the cards a character has data for.
- **Negative:** New field labels in future docx revisions need an entry in the field-detection table; otherwise the prose lands in `bodyHtml` (a graceful fallback but loses structure).
- **Neutral:** The legacy `bio: string` field is still computed (stripped HTML from `bodyHtml`) so older callers keep working.

**Alternatives considered**
- Hand-author MDX per character — Higher editorial control but no longer source-doc-driven; rejected because the docx is already structured and authoritative.

---

## ADR-009: Sticker color follows character state

**Date:** 2026-05-14
**Status:** Accepted

**Context**
Phase-1 character profiles use a `Sticker` decoration as the eyebrow above the title. With one stable color the eyebrow read as decorative rather than informational, despite the canon dividing characters into Shadow / Grounded / Neutral / Bad/Sympathetic / Apex Predator types.

**Decision**
`stateColor(state)` returns a `StickerTint` based on the parenthetical state from the docx: shadow → terracotta, grounded → teal, neutral → mustard, apex/mastermind/bad → terracotta. The state label itself ("Shadow State · Anxiety & Fear") is what the sticker says. The pair badge ("↔ Paired with HARBOR") below it links to the partner character.

**Consequences**
- **Positive:** Visual genre cue lands at first glance — terracotta for the difficult emotions, teal for grounded counterparts. Reinforces the pair structure of the canon.
- **Negative:** The sticker tint is implicit information; for accessibility the state name must always be present in text (it is).
- **Neutral:** New character types added later need a `stateColor` branch.

---

## ADR-010: Per-page structured parsers for narrative pages

**Date:** 2026-05-16
**Status:** Accepted (Phase 2)

**Context**
Phase 1 left the four narrative pages (`/universe/geography`, `/arcs`, `/exacerbators`, `/lore`) rendering as a single block of mammoth-converted HTML through one generic `NarrativePage` component. The hero stickers looked great but the body was flat text. We had 25 hero cards, 23 scenes, character data, and pair relationships sitting unused on these pages.

**Decision**
Each of the four narrative pages becomes a dedicated React page powered by a page-specific structured parser in `scripts/build-content.ts`. Each parser detects the document's section pattern (borough headers, pair headers, exacerbator possessives, chapter headings) and emits typed JSON that the page renders with bespoke components. Legacy `NarrativePage` stays in the tree as a fallback but the four pages stop using it.

**Decision matrix per page:**
- **Geography**: 5 borough cards with one resident's scene as accent art + portrait chips + Before/After vibe cards
- **Arcs**: 5-step mechanism band + 9 Shadow→Grounded pair cards with portraits + stage fields
- **Exacerbators**: 6 chain bands; each interaction is a tile that opens a modal (condensed to keep page short)
- **Lore**: 12-chapter accordion with drop caps + optional scene images + pull quotes

**Consequences**
- **Positive:** Each narrative page now has the same visual quality as the character profiles. Character names embed as clickable chips, scene art reinforces location/identity, page heights are bounded by collapse patterns where appropriate.
- **Negative:** `build-content.ts` is ~700 lines now with 10 parsers. New source-doc revisions need parser updates rather than just a re-run.
- **Neutral:** Each page lives in its own `app/universe/<page>/page.tsx` with its own component set — more files, less monolithic.

**Alternatives considered**
- One smarter generic renderer that auto-decorates the legacy HTML (character-name detection, sticker-style H2s, etc.) — Rejected because the four docs have radically different shapes (5 boroughs vs 9 pairs vs 6 chains vs 12 chapters) and a generic renderer would either degrade to the lowest common denominator or grow more conditional logic than 4 specific parsers.

---

## ADR-011: Asset presence manifest, not fs scans

**Date:** 2026-05-16
**Status:** Accepted

**Context**
`CharacterPortrait.tsx` originally did `fs.readdirSync` at module load to build `availablePortraits`/`hasHeroCard`/etc. sets. When `ChainSection.tsx` (the new client component for the Exacerbators tile grid + modal) needed `hasHeroCard`, the build failed: `'use client'` components can't bundle Node built-ins.

**Decision**
Add a `buildAssetPresence()` step to the content pipeline that scans `public/assets/{characters,hero-cards,scenes,titles,quote-posts}/` and emits `content/asset-presence.json` with arrays of slugs / numeric IDs per role. `CharacterPortrait.tsx` and `QuotePost.tsx` import that JSON and construct `Set`s at module load — no `fs` at runtime, safe for both server and client components.

**Consequences**
- **Positive:** Client components can use `hasPortrait` / `hasHeroCard` / `hasQuotePost` everywhere. The manifest is precomputed once per build, smaller than an fs traversal.
- **Negative:** Adding a new asset file requires re-running `npm run content:build` so the manifest picks it up — was implicit before, now explicit.
- **Neutral:** The manifest is committed alongside other content JSON; size is trivial.

---

## ADR-012: Condense long narrative pages with click-to-expand patterns

**Date:** 2026-05-16
**Status:** Accepted

**Context**
The Phase-2 Exacerbators page (6 chains × 6 victims × 5 fields each as full-width cards) and the Lore page (12 stacked editorial chapters) were beautiful but generated 3000–5000px of scroll each. User feedback after each landed: "it looks amazing but condense it."

**Decision**
Both pages convert to click-to-expand patterns rather than show-everything-at-once:
- **Exacerbators**: each interaction is a compact tile (Exacerbator → Victim portraits + 3-line teaser of "The Trap") in a 2/3-column grid. Click opens a modal with the full 5-field card. (`ChainSection.tsx`, `'use client'`.)
- **Lore**: chapter accordion — each chapter is a tight ~80px header row (number disc + sticker + title + "+" toggle) with the editorial body (scene, drop-cap prose, pull-quote) animating open in place. First chapter open by default. (`LoreChapter.tsx`, `'use client'`, framer-motion height animation.)

**Consequences**
- **Positive:** Both pages now collapse to a single-screen scannable index of titles/tiles. Users see the full breadth before drilling in. Mobile-friendly. Editorial detail still appears on demand.
- **Negative:** Content is one click away from the reader instead of in front of them. Acceptable for browse/explore content; would be wrong for read-through-once content.
- **Neutral:** Page bundle weight goes up slightly (each gained a client component) but well under 5 kB total.

**Alternatives considered**
- Pagination (load 30, click to load more) — Used on `/quotes`. Less ideal for chaptered content where readers want to scan all titles first.
- Tabs (one chapter visible) — Hides too much; readers would need to know who they care about before seeing anything.

---
