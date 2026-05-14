# CODE_MAP

Repo layout: `web/` is the Next.js 15 app. Everything outside `web/` is **source content** (docx / pdf / xlsx / png) that the content pipeline reads at build time.

---

## Marketing & Storytelling Pages

Category: UI (Next.js App Router, RSC)

Primary Files:
- web/app/page.tsx — cinematic homepage
- web/app/workbook/page.tsx — workbook sales page
- web/app/universe/page.tsx — Mo Town overview

Supporting Files:
- web/components/ui/SiteNav.tsx
- web/components/ui/SiteFooter.tsx
- web/components/ui/WaitlistForm.tsx

Entry Points:
- `/`, `/universe`, `/workbook`

---

## Mo Town Universe Pages

Category: UI

Primary Files:
- web/app/universe/characters/page.tsx — character index
- web/app/universe/characters/[slug]/page.tsx — character profile (SSG)
- web/app/universe/geography/page.tsx
- web/app/universe/lore/page.tsx
- web/app/universe/arcs/page.tsx
- web/app/universe/exacerbators/page.tsx

Supporting Files:
- web/components/universe/NarrativePage.tsx — shared layout for HTML-rendered narrative docs

Entry Points:
- `/universe/characters`, `/universe/characters/[slug]`, `/universe/{geography,lore,arcs,exacerbators}`

---

## Quote Library

Category: UI (client-interactive)

Primary Files:
- web/app/quotes/page.tsx
- web/components/quotes/QuoteLibrary.tsx — filter/search/shuffle

Entry Points:
- `/quotes`

---

## Animation System

Category: UI primitives

Primary Files:
- web/lib/animations/LenisProvider.tsx — smooth scroll
- web/components/motion/TextReveal.tsx
- web/components/motion/RevealOnView.tsx
- web/components/motion/Parallax.tsx
- web/components/motion/Marquee.tsx

External Integrations: Framer Motion, Lenis, GSAP (installed, not yet imported)

---

## Waitlist API

Category: API

Primary Files:
- web/app/api/waitlist/route.ts — POST handler, Zod validation

Supporting Files:
- web/lib/supabase/server.ts — Supabase SSR client
- web/components/ui/WaitlistForm.tsx — client form

External Integrations: Supabase Postgres (table `public.waitlist`)

Entry Points:
- `POST /api/waitlist`

---

## Content Pipeline (build-time)

Category: Worker / build script

Primary Files:
- web/scripts/build-content.ts

External Integrations:
- mammoth (.docx → text/HTML)
- xlsx / SheetJS (.xlsx)
- csv-parse (.csv)

Reads from (repo root):
- `Character Documentation/*.docx`
- `The Motions Workbook Compotents/*.xlsx` + `motions_complete_250_quotes.csv`
- `THE MOTIONS UNIVERSE LORE - CLIENT WORK CONNECTION.docx`

Writes to:
- web/content/{quotes,characters,geography,arcs,exacerbators,historic-district,lore,modules}.json

Entry Points:
- `npm run content:build`

---

## Content Loader

Category: Service

Primary Files:
- web/lib/content.ts — typed loaders + lookup helpers

Consumers: all UI pages.

---

## Database / Schema

Category: Infra

Primary Files:
- web/supabase/migrations/0001_init.sql — `waitlist` table + RLS

External Integrations: Supabase (Postgres)

---

## Root Layout & Theme

Category: UI infra

Primary Files:
- web/app/layout.tsx — fonts (Inter, Fraunces), Lenis, nav, footer
- web/app/globals.css — Tailwind + reduced-motion guard
- web/tailwind.config.ts — Mo Town palette, motion colors, typography
- web/next.config.mjs
- web/postcss.config.mjs

---

## Source Content (non-code)

Category: Other (raw assets)

Primary Files:
- Character Documentation/ — character DB + arcs + geography + exacerbator docs
- The Motions Workbook Compotents/ — workbook docx + 8 module xlsx + quotes csv
- The Motions Static Quote Posts/ — 86 quote graphics
- The Motions Graphics (1..5)/ — brand graphics
- Motions/, Visual Assets/, PDFs/ — supplementary

Consumed by: content pipeline only.
