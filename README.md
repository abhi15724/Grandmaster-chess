# Grandmaster Chess Online — Next.js Edition

Migrated from a Vite + React SPA to Next.js 15 (App Router) for real
server-rendered pages, per-route SEO metadata, structured data, and a new
blog/content system. All game logic, the board, the AI engine, sounds, and
storage are the original code, ported as-is.

## What changed and why

The old app was a client-only SPA: `<div id="root">` and everything rendered
after JavaScript loaded. That's fine for the interactive game itself, but it
meant Google saw empty HTML on `/play`, `/learn/*`, `/faq`, etc. — no title,
no meta description, no content to index.

This version:

- Uses **Next.js App Router** with real file-based routes matching the old
  paths (`/play/ai`, `/learn/chess-rules`, `/faq`, ...).
- **Server-renders every page** on first load — view-source on any page now
  shows real HTML content and JSON-LD, not an empty div.
- Content pages (home, learn guides, FAQ, blog) are prerendered at build
  time (SSG) for maximum speed and crawlability.
- Interactive pages (`/play/ai`, `/play/local`,
  `/dashboard`) still render the exact same React game components you had —
  they're marked as Client Components but are still server-rendered on
  first paint, so they benefit from real HTML too.
- Adds a full **blog** at `/blog` (SSG, Markdown-based) with starter
  articles targeting real chess search queries, internally linked to your
  play/learn pages.
- Adds `sitemap.xml`, `robots.txt`, `llms.txt`, Open Graph/Twitter tags,
  and JSON-LD (WebApplication, WebSite, Organization, Article, FAQPage,
  BreadcrumbList) sitewide.
- 301 redirects from the old short URLs (`/learn/rules`, `/play`, etc.) to
  the new canonical ones, so nothing breaks and no link equity is lost.

## Project structure

```
app/                    Next.js routes (pages, layouts, metadata)
  blog/                 Blog index, [slug] posts, category pages
  learn/, play/, faq/, dashboard/
  sitemap.ts, robots.ts
components/             All ported UI components (board, navbar, modals, etc.)
  pages/                Ported page-level components (former src/pages)
  blog/                 Blog-specific UI (post cards)
lib/                    Chess engine, audio, storage, blog content loader, SEO helpers
services/               (removed — multiplayer client lived here)
content/blog/           Markdown blog posts (frontmatter + body)
types/                  Shared TypeScript types
```

## Accounts (Supabase) & synced stats

**Guest ID stability** — `lib/storage.ts` guards against a malformed/partial
`localStorage` entry silently minting a new guest id, and generates guest ids
with `crypto.randomUUID()` when available. Signed-in users get a stable id
from Supabase Auth instead of relying on the browser's local storage at all.

### Setting up Supabase (signup/login + synced stats)

1. In your Supabase project's SQL Editor, run `supabase/schema.sql`. It
   creates a `profiles` table (name, rating, games/wins/losses/draws,
   history) with Row Level Security so users can only read/write their own
   row, plus a trigger that auto-creates a profile on signup.
2. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in
   your environment (`.env.local` already has this project's values filled
   in — see `.env.example` for the format).
3. By default, Supabase requires email confirmation before a new signup can
   log in. Turn this off (Authentication → Providers → Email → "Confirm
   email") if you want instant sign-in after signup, or leave it on and
   users will get a confirmation email first.
4. That's it — `components/AuthModal.tsx` (opened from the "Log In / Sign
   Up" button in the navbar) handles both flows, `contexts/AuthContext.tsx`
   tracks the session, and `lib/storage.ts` syncs stats to `profiles`
   whenever they change while signed in, and pulls them back down on
   sign-in/session restore. Playing as a guest (not signed in) still works
   exactly as before, stats just stay local to that browser.

## Running locally

```bash
npm install
cp .env.example .env.local   # set NEXT_PUBLIC_SITE_URL, Supabase keys
npm run dev                  # http://localhost:3000
```

## Deploying

Vercel is the path of least resistance (zero config for App Router SSG/SSR,
image optimization, redirects). Netlify, Railway, or a Docker/Node server
also work — this is a standard Next.js app. Whichever host you use, set
`NEXT_PUBLIC_SITE_URL` to your production domain (e.g.
`https://www.grandmasterchess.in`) and the Supabase env vars in that host's
environment settings — `.env.local` is only read locally and is not
deployed with the app.

## Adding a new blog post

Drop a new Markdown file in `content/blog/` with frontmatter:

```md
---
title: "Your Post Title"
description: "One or two sentences for meta description and card preview."
date: "2026-08-15"
author: "Grandmaster Chess Editorial Team"
category: "Strategy"
tags: ["chess", "tactics"]
readingMinutes: 6
---

Your content in Markdown...
```

It's picked up automatically — no code changes needed. The slug is the
filename with any leading `NN-` ordering prefix and `.md` stripped.

## SEO/AEO checklist covered

- [x] Per-page title/description/canonical
- [x] Open Graph + Twitter Cards
- [x] `sitemap.xml` (dynamic, includes all blog posts/categories)
- [x] `robots.txt` (blocks `/dashboard`)
- [x] `llms.txt` for AI answer engines
- [x] JSON-LD: WebApplication, WebSite, Organization, Article, FAQPage,
      BreadcrumbList
- [x] Semantic headings, internal linking between blog ↔ play/learn pages
- [x] 301 redirects from legacy URLs
- [x] Real server-rendered HTML on every route (verified via build output)
