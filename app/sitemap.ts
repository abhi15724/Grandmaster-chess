import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site-config';
import { getAllPosts } from '@/lib/blog';
import { converterEnabled } from '@/lib/converter';

// Google ignores <priority>/<changefreq>; only an honest <lastmod> is used, so
// we send lastmod for blog posts (real dates) and omit it where we can't be accurate.
export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    '/',
    '/play/ai',
    '/play/ai/basic',
    '/play/ai/intermediate',
    '/play/ai/advanced',
    '/play/local',
    '/learn/chess-rules',
    '/learn/chess-openings',
    '/learn/chess-strategies',
    '/tools',
    '/tools/elo-calculator',
    '/tools/pgn-viewer',
    '/tools/chess-coordinates-trainer',
    '/tools/currency-converter',
    '/tools/emi-calculator',
    '/tools/pdf-converter',
    '/tools/image-to-pdf',
    '/tools/pdf-to-word',
    // Office converters are listed only when the conversion service is configured.
    ...(converterEnabled ? ['/tools/word-to-pdf', '/tools/ppt-to-pdf'] : []),
    '/faq',
    '/blog',
    '/about',
    '/editorial-policy',
    '/contact',
    '/privacy',
    '/terms',
  ];
  const staticRoutes: MetadataRoute.Sitemap = staticPaths.map((p) => ({
    url: p === '/' ? `${SITE_URL}/` : `${SITE_URL}${p}`,
  }));

  const postRoutes: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.updated || post.date,
  }));

  // Category archive pages are thin and noindexed, so they are intentionally not listed.
  return [...staticRoutes, ...postRoutes];
}
