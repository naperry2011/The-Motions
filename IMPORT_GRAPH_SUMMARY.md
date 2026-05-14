# IMPORT_GRAPH_SUMMARY

## Core Dependency Nodes

- `web/lib/content.ts` — single typed entry point to all generated JSON; imported by every page that renders content
- `web/components/motion/RevealOnView.tsx` — used on every page section
- `web/components/motion/TextReveal.tsx` — used on every hero/eyebrow
- `web/app/layout.tsx` — root provider; wraps every route with `LenisProvider`, `SiteNav`, `SiteFooter`
- `web/content/*.json` — generated artifacts; treated as immutable upstream by all consumers

## Utility Modules Reused Broadly

- `web/components/ui/SiteNav.tsx`, `SiteFooter.tsx` — chrome
- `web/components/ui/WaitlistForm.tsx` — reused on `/` and `/workbook`
- `web/components/universe/NarrativePage.tsx` — reused by all 4 narrative pages (geography / lore / arcs / exacerbators)
- `web/lib/supabase/server.ts` — Supabase server client factory

## Highly Coupled Module Clusters

- `app/universe/{geography,lore,arcs,exacerbators}/page.tsx` ↔ `components/universe/NarrativePage.tsx` ↔ `lib/content.ts`
  Tight by design — 4 routes are thin wrappers around one component.
- `app/api/waitlist/route.ts` ↔ `lib/supabase/server.ts` ↔ env vars
  Single API; tight is fine.

## Circular Dependencies

None detected. The graph is strictly:
`app/** → components/** → lib/** → content/*.json`

## Potential Refactor Risk Areas

- `web/scripts/build-content.ts` (single file owns 7 parsers; if any source-doc format changes the diff lands here. Acceptable for v1.)
- `web/lib/content.ts` (re-exports raw JSON shapes as TS types via `as`. If JSON schema drifts, callers won't catch it at compile time. Add Zod parse on load if data integrity matters.)
- `web/components/universe/NarrativePage.tsx` (uses `dangerouslySetInnerHTML` for mammoth-converted HTML. Trusted source today, but any future user-authored input must NOT flow through this component without sanitization.)

## External Coupling

- Next.js 15 App Router (peer-dep sensitive — React 19 stable required; package.json pinned to `next ^15.1.0`)
- Supabase via `@supabase/ssr` (relies on env vars; soft-fail in route handler when unset)
- Framer Motion, Lenis (client-only; gated by `'use client'` directives)
