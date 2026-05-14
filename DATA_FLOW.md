# DATA_FLOW

## Build-time content ingestion

Source: `.docx` / `.xlsx` / `.csv` in repo root (`Character Documentation/`, `The Motions Workbook Compotents/`, `THE MOTIONS UNIVERSE LORE - CLIENT WORK CONNECTION.docx`)
Transport: filesystem
Processor: `web/scripts/build-content.ts` (mammoth, xlsx, csv-parse)
Storage: `web/content/*.json` (committed to repo)
Downstream Consumers: `web/lib/content.ts` → every page

---

## Page render (static)

Source: `web/content/*.json` (via `lib/content.ts`)
Transport: ES module import at build time
Processor: React Server Components in `web/app/**/page.tsx`
Storage: HTML/RSC payload pre-rendered into `.next/`
Downstream Consumers: browsers (static delivery via Vercel CDN)

---

## Character profile (SSG)

Source: `web/content/characters.json` + `quotes.json`
Transport: `generateStaticParams()` enumerates 25 slugs
Processor: `web/app/universe/characters/[slug]/page.tsx`
Storage: 25 prerendered HTML pages
Downstream Consumers: browsers

---

## Quote library (client-interactive)

Source: `web/content/{quotes,characters}.json` → server component
Transport: serialized as JS bundle props to client component
Processor: `web/components/quotes/QuoteLibrary.tsx` (filter / search / shuffle in-memory)
Storage: none (ephemeral component state)
Downstream Consumers: rendered DOM

---

## Waitlist submission

Source: `web/components/ui/WaitlistForm.tsx` (client)
Transport: `fetch POST /api/waitlist` (JSON)
Processor: `web/app/api/waitlist/route.ts` — Zod-validates → `@supabase/ssr` server client
Storage: Supabase Postgres, `public.waitlist` (unique on `email`)
Downstream Consumers: manual readback via service role; future email automation

---

## Asset delivery

Source: `web/public/assets/**` (currently empty; reserved for graphics)
Transport: Next.js static assets via Vercel CDN
Processor: `next/image` for AVIF/WebP conversion
Storage: edge cache
Downstream Consumers: browsers

---

## Animation scroll signal

Source: browser scroll events
Transport: `lib/animations/LenisProvider.tsx` (rAF loop) → Framer Motion `useScroll` / `whileInView`
Processor: motion primitive components (`Parallax`, `RevealOnView`, `TextReveal`, `Marquee`)
Storage: none
Downstream Consumers: rendered DOM transforms
