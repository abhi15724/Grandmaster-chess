import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site-config';
import { getAllPosts, getAllCategories } from '@/lib/blog';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/play/ai`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/play/ai/basic`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/play/ai/intermediate`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/play/ai/advanced`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/play/local`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/learn/chess-rules`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/learn/chess-openings`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/learn/chess-strategies`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/faq`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/blog`, changeFrequency: 'weekly', priority: 0.8 },
  ];

  const postRoutes: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.updated || post.date,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = getAllCategories().map(
    (cat) => ({
      url: `${SITE_URL}/blog/category/${cat.toLowerCase()}`,
      changeFrequency: 'weekly',
      priority: 0.5,
    })
  );

  return [...staticRoutes, ...postRoutes, ...categoryRoutes];
}
