# ENTRY_POINTS

## Next.js dev server

Path: `web/` (`npm run dev` → `next dev`)
Responsibility: Local development server with HMR
Invokes: app router routes under `web/app/**`
Depends On: Node ≥ 18, `package.json` deps installed

---

## Next.js production build

Path: `web/` (`npm run build` → `next build`)
Responsibility: Compile, type-check, SSG static pages
Invokes: all `app/**/page.tsx`, `generateStaticParams` in `app/universe/characters/[slug]/page.tsx`
Depends On: `web/content/*.json` present (run content pipeline first)

---

## Next.js production server

Path: `web/` (`npm run start` → `next start`)
Responsibility: Serve compiled output on Vercel (or anywhere)
Invokes: static prerenders + `/api/waitlist` server function
Depends On: `next build` output, env vars

---

## POST /api/waitlist

Path: `web/app/api/waitlist/route.ts`
Responsibility: Validate email + insert into `public.waitlist`
Invokes: `createSupabaseServer()` → Supabase REST
Depends On: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Soft-fails (returns `{ok:true,queued:false}`) when URL missing.

---

## Content pipeline

Path: `web/scripts/build-content.ts` (`npm run content:build` → `tsx scripts/build-content.ts`)
Responsibility: Parse source docs in repo root into `web/content/*.json`
Invokes: mammoth, xlsx, csv-parse
Depends On: `..` (repo root) contains the source `.docx`, `.xlsx`, `.csv` files

---

## Typecheck

Path: `web/` (`npm run typecheck` → `tsc --noEmit`)
Responsibility: Strict TS check across the project
Depends On: `web/tsconfig.json`

---

## Lint

Path: `web/` (`npm run lint` → `next lint`)
Responsibility: ESLint with `eslint-config-next`
Depends On: Next.js, ESLint

---

## Vercel deploy

Path: GitHub `main` branch → Vercel project
Responsibility: Continuous deploy
Invokes: `next build` from Root Directory `web`
Depends On: Vercel project settings — Framework Preset: Next.js, Root Directory: `web`, env vars (3 Supabase keys)

---

## Supabase migration

Path: `web/supabase/migrations/0001_init.sql`
Responsibility: Create `public.waitlist` + RLS policy
Invokes: Manually applied via Supabase SQL Editor (no migration runner wired)
Depends On: `pgcrypto` extension
