# The Motions — web

Cinematic web platform for **The Motions** — Mo Town universe, 250 quotes, 25 characters, and the 8-module solopreneur workbook.

## Stack
Next.js 15 (App Router) · TypeScript · Tailwind · Lenis · Framer Motion · GSAP · Supabase · Vercel.

## Develop
```bash
npm install
npm run content:build   # parses ../*.docx / .csv / .xlsx into content/*.json
npm run dev
```

## Production
```bash
npm run build && npm start
```

## Routes (v1)
- `/` — cinematic homepage
- `/universe` — Mo Town overview
- `/universe/characters` and `/universe/characters/[slug]` — the 25 characters
- `/universe/geography` — districts & housing
- `/universe/lore` — universe lore × client work connection
- `/universe/arcs` — character arcs & transformations
- `/universe/exacerbators` — exacerbator → motion corruption interactions
- `/quotes` — the 250-quote library (filter / search / shuffle)
- `/workbook` — workbook sales + waitlist
- `POST /api/waitlist` — Supabase insert

## Supabase
Copy `.env.example` → `.env.local`, then apply `supabase/migrations/0001_init.sql` in your Supabase project. Without env vars set, the waitlist API soft-fails (logs but returns 200) so local dev still works.

## Content pipeline
`scripts/build-content.ts` reads source documents from the repo root:
- `motions_complete_250_quotes.csv` → `content/quotes.json`
- `COMPLETE MO TOWN CHARACTER DATABASE.docx` → `content/characters.json` (canonical names taken from quotes; docx provides bios where heading matches)
- `Module*_*.xlsx` → `content/modules.json`
- Geography / arcs / exacerbators / lore docx → narrative HTML JSON

Re-run `npm run content:build` after editing any source doc.

## What's not built yet (v2)
Stripe Checkout, gated workbook program pages (`/workbook/program/...`), per-user progress tracking, exercise downloads, magic-link sign-in UI. Supabase + auth are wired but ungated.
