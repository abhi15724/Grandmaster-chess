import type { Metadata } from 'next';
import { LearnOpeningsPage } from '@/components/pages/LearnOpeningsPage';
import { jsonLdGraph, breadcrumbSchema } from '@/lib/json-ld';

import { LEARN_OPENINGS_KEYWORDS } from '@/lib/seo-keywords';

export const metadata: Metadata = {
  title: 'Popular Chess Openings Guide — Italian, Sicilian, London & More',
  description:
    'A clear guide to the most popular chess openings for White and Black, with the ideas and plans behind each — from the Italian Game to the Sicilian Defense.',
  keywords: LEARN_OPENINGS_KEYWORDS,
  alternates: { canonical: '/learn/chess-openings' },
};

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
