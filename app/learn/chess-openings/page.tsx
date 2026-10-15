import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { LearnOpeningsPage } from '@/components/pages/LearnOpeningsPage';
import { jsonLdGraph, breadcrumbSchema } from '@/lib/json-ld';

import { LEARN_OPENINGS_KEYWORDS } from '@/lib/seo-keywords';

export const metadata: Metadata = pageMetadata({
  title: 'Best Chess Openings Explained',
  description:
    'A clear guide to the best chess openings for White and Black, from the Italian Game to the Sicilian Defense, with the ideas behind each.',
  keywords: LEARN_OPENINGS_KEYWORDS,
  path: '/learn/chess-openings',
});

export default function Page() {
  const graph = jsonLdGraph(
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Learn', path: '/learn/chess-openings' },
      { name: 'Chess Openings', path: '/learn/chess-openings' },
    ])
  );
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
      />
      <LearnOpeningsPage />
    </>
  );
}
