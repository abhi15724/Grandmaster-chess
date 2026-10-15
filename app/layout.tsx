import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';
import { AppShell } from '@/components/AppShell';
import { JsonLd } from '@/components/JsonLd';
import {
  SITE_BRAND,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_DESCRIPTION,
  SITE_URL,
  TWITTER_HANDLE,
} from '@/lib/site-config';
import {
  jsonLdGraph,
  organizationSchema,
  websiteSchema,
  webApplicationSchema,
} from '@/lib/json-ld';
import { SITE_KEYWORDS } from '@/lib/seo-keywords';
import { ogImageUrl } from '@/lib/seo';

const DEFAULT_TITLE = `${SITE_TAGLINE} | ${SITE_BRAND}`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${SITE_BRAND}`,
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  applicationName: SITE_BRAND,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: 'games',
  // NOTE: no root-level `alternates.canonical`. A canonical here is inherited by
  // any page that forgets its own and would point it at the homepage.
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    url: SITE_URL,
    title: DEFAULT_TITLE,
    description: SITE_DESCRIPTION,
    siteName: SITE_NAME,
    locale: 'en_US',
    images: [{ url: ogImageUrl('Play Chess Online Free'), width: 1200, height: 630, alt: DEFAULT_TITLE }],
  },
  twitter: {
    card: 'summary_large_image',
    site: TWITTER_HANDLE,
    title: DEFAULT_TITLE,
    description: SITE_DESCRIPTION,
    images: [ogImageUrl('Play Chess Online Free')],
  },
};

export const viewport: Viewport = {
  themeColor: '#161512',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const graph = jsonLdGraph(
    webApplicationSchema(),
    websiteSchema(),
    organizationSchema()
  );

  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <JsonLd data={graph} />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3716104050682143"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className="bg-zinc-950 text-zinc-100 antialiased selection:bg-amber-500/30 selection:text-amber-200">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
