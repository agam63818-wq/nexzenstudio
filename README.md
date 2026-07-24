# NexZen Studio

Personal Creator CMS + Digital Asset Hub for [@agam.nexgen.ai](https://instagram.com/agam.nexgen.ai) — AI prompts, image/video prompts, APKs, games, tools, resources, and blogs.

Built mobile-first with a dark, futuristic AI-lab aesthetic. Tagline: **Build. Create. Inspire.**

## Tech stack

- **Frontend:** Next.js 15 (App Router) + React + TypeScript + Tailwind CSS
- **Animation:** Framer Motion (UI) + GSAP/ScrollTrigger (scroll) + React Three Fiber / drei (3D hero, lazy-loaded & simplified on mobile)
- **Backend/DB:** Supabase (Auth, PostgreSQL, Storage) — admin-only login, no public signup
- **Deploy:** Vercel

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in Supabase keys
npm run dev
```

App runs at http://localhost:3000

## Supabase setup

1. Create a project at https://supabase.com
2. Copy the URL + anon key + service role key into `.env.local`
3. Run the SQL in `supabase/migrations/0001_init.sql` to create tables + RLS policies
4. Create the first admin row in the `admins` table and a matching Auth user (no public signup)

## Responsiveness

Mobile-first (375px) → tablet (768px) → desktop (1280px+). No horizontal scroll at any width. Min 44px tap targets. 3D hero complexity auto-reduces on mobile / low-core devices and respects `prefers-reduced-motion`.

## Roadmap

This is **Phase 1** (foundation). See the merge request description for the full phased plan.
