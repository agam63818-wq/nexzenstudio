# NexZen Studio

Personal Creator CMS + Digital Asset Hub for [@agam.nexgen.ai](https://instagram.com/agam.nexgen.ai) — AI prompts, image/video prompts, APKs, games, tools, resources, and blogs.

Built mobile-first with a dark, futuristic AI-lab aesthetic. Tagline: **Build. Create. Inspire.**

## Tech Stack

- **Frontend:** Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS 3
- **Animation:** Framer Motion (UI) + GSAP/ScrollTrigger (scroll) + React Three Fiber / drei (3D hero)
- **Backend/DB:** Supabase (Auth, PostgreSQL, Storage) — admin-only login, no public signup
- **Deploy:** Vercel (original target); running on Replit dev server

## Running on Replit

The workflow **"Start application"** runs `npm run dev` on port 5000.

```bash
npm run dev   # starts Next.js dev server at http://localhost:5000
```

Environment secrets required (set in Replit Secrets):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Non-secret env vars (set in Replit environment):
- `NEXT_PUBLIC_SITE_URL` — set to the Replit dev domain

## Supabase Setup

1. Create a project at https://supabase.com
2. Add credentials to Replit Secrets (already done if you followed setup)
3. Run the SQL migrations in `supabase/migrations/` in order:
   - `0001_init.sql` — tables + RLS policies
   - `0002_tools_search.sql` — tools search
   - `0003_gallery_analytics.sql` — gallery analytics
4. Create the first admin row in the `admins` table and a matching Auth user

## Project Structure

```
src/
  app/          — Next.js App Router pages (prompts, apks, games, tools, resources, blog, gallery, admin)
  components/   — React components (layout, sections, ui, three)
  lib/          — Supabase client, queries, types, utilities
supabase/
  migrations/   — SQL migration files
```

## Notes

- Brand icons (Instagram, YouTube, GitHub) are in `src/components/ui/brand-icons.tsx` — lucide-react v0.469+ removed them
- The middleware file uses the deprecated `middleware` convention; Next.js 16 prefers `proxy`
- 3D hero uses `AdaptiveThree` which simplifies on mobile / low-core devices and respects `prefers-reduced-motion`

## User Preferences

- Keep existing project structure and stack
