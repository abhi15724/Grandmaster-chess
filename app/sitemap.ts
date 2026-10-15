import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site-config';
import { getAllPosts, getAllCategories } from '@/lib/blog';

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
    '/faq',
    '/blog',
    '/about',
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

  const categoryRoutes: MetadataRoute.Sitemap = getAllCategories().map((cat) => ({
    url: `${SITE_URL}/blog/category/${encodeURIComponent(cat.toLowerCase())}`,
  }));

  return [...staticRoutes, ...postRoutes, ...categoryRoutes];
}
