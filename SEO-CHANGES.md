# SEO changes (claude-seo audit) — Grandmasterchess

Target queries: "chess", "grandmasterchess", "play chess online".

## Fixed
1. **Crawlable internal links** – navbar, footer and homepage CTAs were `<button onClick={router.push}>`
   (no `<a href>`), so Google could only find pages via the sitemap. Now real `<Link href>`.
2. **Wrong per-page Open Graph** – every page inherited the homepage og:url/og:title. New `lib/seo.ts#pageMetadata`
   emits correct canonical, og:url, og:title, twitter and image for every page.
3. **Canonical bug** – root layout had `canonical: '/'`; removed so no page can inherit it.
4. **Titles** – brand was a 40-char string appended to every title (titles 70-90 chars, truncated). Now
   `Page title | Grandmasterchess` (all core pages ≤ 58 chars). Home: "Play Chess Online Free | Grandmasterchess".
5. **Open Graph images** – none existed. Added dynamic `/og?title=` (1200x630) used on every page and blog post.
6. **Schema** – WebSite/Organization now have short `name` + `alternateName` (Grandmasterchess, GrandmasterChess, …) to
   help Google's site-name; removed fake SearchAction; 512px logo; WebApplication featureList; Article gets image,
   mainEntityOfPage; fixed duplicate breadcrumb on /learn/chess-rules; added breadcrumbs to play pages.
7. **Thin play pages** – /play/ai (+3 levels) and /play/local had no H1 and almost no text. Added H1 + unique copy + links.
8. **Homepage** – H1 now "Play Chess Online Free — vs the AI or Yourself" + about section with internal links.
9. **Sitemap/robots** – added /about /contact /privacy /terms, fixed category URL encoding, honest lastmod only,
   robots uses SITE_URL and blocks /api/.
10. Blog post "Play Chess Online" title/description shortened.

## You still need to do (can't be done in code)
- Verify `www.grandmasterchess.in` in **Google Search Console** and submit `/sitemap.xml`; also add the non-www domain
  and make sure it 301s to www (or vice versa) at the host/DNS level.
- Use URL Inspection → Request indexing for `/`, `/play/ai`, `/play/local`.
- Earn backlinks/mentions (chess forums, Reddit r/chess, Product Hunt, Indian chess communities, directories). "chess" alone
  is dominated by chess.com/lichess; realistic wins are "grandmasterchess", "play chess vs computer free", "2 player chess online".
- Add social profile URLs to `organizationSchema().sameAs` once they exist.
- Optional: shorten the other 20+ blog titles (>60 chars) and descriptions (>160).
