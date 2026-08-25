import type { Metadata } from 'next';
import './globals.css';
import { AppShell } from '@/components/AppShell';
import {
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

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  authors: [{ name: SITE_NAME }],
  robots: { index: true, follow: true },
  alternates: { canonical: '/' },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    url: SITE_URL,
    title: `${SITE_NAME} | ${SITE_TAGLINE}`,
    description:
      'Challenge AI opponents or play locally against yourself, with clocks, move analysis, and custom themes.',
    siteName: SITE_NAME,
  },
  twitter: {
    card: 'summary_large_image',
    site: TWITTER_HANDLE,
    title: `${SITE_NAME} | Play Free Chess`,
    description:
      'Play free online chess against AI or against yourself locally. Features move analysis and chess clocks.',
  },
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
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
        />
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
