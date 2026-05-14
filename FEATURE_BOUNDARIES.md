# FEATURE_BOUNDARIES

## Content Pipeline (`web/scripts/build-content.ts`)

Owns: parsing source `.docx` / `.xlsx` / `.csv`, emitting `web/content/*.json`
Does NOT Own: rendering, schema validation at consume time, source-doc authorship
Communicates With: filesystem only
Isolation Level: Strong (offline build step; never runs in request path)

---

## Content Loader (`web/lib/content.ts`)

Owns: typed access to generated JSON, lookup helpers (`getCharacter`, `getQuotesByCharacter`)
Does NOT Own: parsing, fetching, mutation
Communicates With: `web/content/*.json` (static imports), consumed by UI
Isolation Level: Strong (pure, side-effect-free)

---

## Animation Primitives (`web/components/motion/*`, `web/lib/animations/*`)

Owns: scroll-driven reveal/parallax/marquee/text-reveal behavior, Lenis lifecycle
Does NOT Own: data fetching, content shape, page composition
Communicates With: Framer Motion, Lenis; consumed by UI pages
Isolation Level: Strong (pure presentational; reusable)

---

## UI Chrome (`web/components/ui/SiteNav.tsx`, `SiteFooter.tsx`, `WaitlistForm.tsx`)

Owns: top-level navigation, footer, waitlist form UX
Does NOT Own: data, routing definitions, server logic
Communicates With: `/api/waitlist` (form); routes (links)
Isolation Level: Moderate (form has runtime coupling to API contract)

---

## Marketing Pages (`web/app/page.tsx`, `web/app/workbook/page.tsx`)

Owns: cinematic homepage + workbook sales-page composition
Does NOT Own: animation behavior, content data, API logic
Communicates With: content loader, motion primitives, WaitlistForm
Isolation Level: Strong

---

## Universe Pages (`web/app/universe/**`)

Owns: route definitions for universe sections; thin layout choices
Does NOT Own: narrative rendering (delegated to `NarrativePage`), data
Communicates With: `lib/content.ts`, `components/universe/NarrativePage.tsx`, motion primitives
Isolation Level: Strong

---

## Narrative Renderer (`web/components/universe/NarrativePage.tsx`)

Owns: shared layout for HTML-narrative docs (geography / lore / arcs / exacerbators)
Does NOT Own: HTML sanitization (relies on trusted source), data fetching
Communicates With: `NarrativeDoc` type from `lib/content.ts`
Isolation Level: Strong

---

## Quote Library (`web/app/quotes/page.tsx`, `web/components/quotes/QuoteLibrary.tsx`)

Owns: filter/search/shuffle interactivity, client-side state
Does NOT Own: persistence, server logic
Communicates With: content loader (props), Framer Motion
Isolation Level: Strong (self-contained client component)

---

## Waitlist API (`web/app/api/waitlist/route.ts`)

Owns: request validation, Supabase insert, friendly error mapping
Does NOT Own: email delivery, UI, schema definition
Communicates With: `lib/supabase/server.ts`, Supabase Postgres
Isolation Level: Strong (single route, single concern)

---

## Supabase Adapter (`web/lib/supabase/server.ts`)

Owns: SSR-safe Supabase client construction with Next.js cookies
Does NOT Own: business logic, RLS policy (lives in SQL)
Communicates With: `@supabase/ssr`, Next.js `cookies()` API
Isolation Level: Strong

---

## Database Schema (`web/supabase/migrations/0001_init.sql`)

Owns: `public.waitlist` table + RLS policy
Does NOT Own: ORM, application code
Communicates With: Supabase (applied manually via SQL editor)
Isolation Level: Strong (no runtime coupling beyond table shape)

---

## Root Layout & Theme (`web/app/layout.tsx`, `globals.css`, `tailwind.config.ts`)

Owns: fonts, color tokens, reduced-motion guard, global providers, page chrome
Does NOT Own: per-page content or animation behavior
Communicates With: every route (wraps all children)
Isolation Level: Moderate (global side effects via providers, but composition-only)
