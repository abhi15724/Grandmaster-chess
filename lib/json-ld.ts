import { SITE_NAME, SITE_ALT_NAMES, SITE_URL, absoluteUrl } from './site-config';
import type { BlogPost } from './blog';

export function organizationSchema() {
  return {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    alternateName: SITE_ALT_NAMES,
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: absoluteUrl('/icons/icon-512.png'),
      width: 512,
      height: 512,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      url: absoluteUrl('/contact'),
    },
  };
}

export function websiteSchema() {
  // No SearchAction: /blog has no ?q= search, and Google retired the sitelinks
  // search box, so declaring one only advertises a feature that doesn't exist.
  return {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    alternateName: SITE_ALT_NAMES,
    description: 'Play chess online free against a chess AI or on the same device.',
    inLanguage: 'en',
    publisher: { '@id': `${SITE_URL}/#organization` },
  };
}

export function webApplicationSchema() {
  return {
    '@type': 'WebApplication',
    '@id': `${SITE_URL}/#webapp`,
    name: `${SITE_NAME} - Play Chess Online`,
    alternateName: SITE_ALT_NAMES,
    url: SITE_URL,
    applicationCategory: 'GameApplication',
    genre: 'Chess',
    operatingSystem: 'Any (web browser)',
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    isAccessibleForFree: true,
    inLanguage: 'en',
    image: absoluteUrl('/icons/icon-512.png'),
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: [
      'Play chess vs AI at basic, intermediate and advanced levels',
      'Local 2-player pass-and-play chess',
      'Chess clocks: bullet, blitz, rapid and untimed',
      'Move history with PGN export',
      'Full FIDE rules: castling, en passant, promotion, draws',
    ],
    description:
      'Free web-based chess: play vs AI, local pass-and-play, chess clocks and full rule validation. No download or sign-up.',
    publisher: { '@id': `${SITE_URL}/#organization` },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqSchema(qa: { question: string; answer: string }[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: qa.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function articleSchema(post: BlogPost) {
  const url = absoluteUrl(`/blog/${post.slug}`);
  return {
    '@type': 'Article',
    '@id': `${url}#article`,
    headline: post.title.slice(0, 110),
    description: post.description,
    image: [absoluteUrl(`/og?title=${encodeURIComponent(post.title)}&label=${encodeURIComponent(post.category)}`)],
    datePublished: post.date,
    dateModified: post.updated || post.date,
    author: {
      '@type': 'Organization',
      name: post.author,
      url: SITE_URL,
    },
    publisher: { '@id': `${SITE_URL}/#organization` },
    isPartOf: { '@id': `${SITE_URL}/#website` },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    articleSection: post.category,
    keywords: post.tags.join(', '),
    inLanguage: 'en',
  };
}

export function jsonLdGraph(...nodes: Record<string, unknown>[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes,
  };
}
