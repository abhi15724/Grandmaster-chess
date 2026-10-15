import type { Metadata } from 'next';
import { SITE_BRAND, SITE_NAME, absoluteUrl } from './site-config';

/** Dynamic 1200x630 social-preview image served by app/og/route.tsx */
export function ogImageUrl(title: string, label?: string): string {
  const q = new URLSearchParams({ title });
  if (label) q.set('label', label);
  return absoluteUrl(`/og?${q.toString()}`);
}

interface PageMetaOptions {
  /** Page title WITHOUT the brand suffix (the layout template adds " | Grandmasterchess"). */
  title: string;
  description: string;
  /** Canonical path, e.g. "/play/ai". */
  path: string;
  keywords?: string[];
  /** Use the title exactly as given (no brand suffix) - for long titles / home page. */
  absoluteTitle?: boolean;
  noindex?: boolean;
  ogLabel?: string;
}

/**
 * One place that builds title, description, canonical, Open Graph and Twitter
 * metadata. Per-page `openGraph` objects REPLACE the layout's (Next does a
 * shallow merge), so every page must emit its own url/title/image - this does it.
 */
export function pageMetadata(o: PageMetaOptions): Metadata {
  const fullTitle = o.absoluteTitle ? o.title : `${o.title} | ${SITE_BRAND}`;
  const image = ogImageUrl(o.title, o.ogLabel);
  return {
    title: o.absoluteTitle ? { absolute: o.title } : o.title,
    description: o.description,
    keywords: o.keywords,
    alternates: { canonical: o.path },
    ...(o.noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      type: 'website',
      url: absoluteUrl(o.path),
      title: fullTitle,
      description: o.description,
      siteName: SITE_NAME,
      locale: 'en_US',
      images: [{ url: image, width: 1200, height: 630, alt: o.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: o.description,
      images: [image],
    },
  };
}
