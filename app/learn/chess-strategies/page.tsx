import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { LearnStrategiesPage } from '@/components/pages/LearnStrategiesPage';
import { jsonLdGraph, breadcrumbSchema } from '@/lib/json-ld';

import { LEARN_STRATEGY_KEYWORDS } from '@/lib/seo-keywords';

export const metadata: Metadata = pageMetadata({
  title: 'Chess Tactics & Strategy Guide',
  description:
    'Learn the chess tactics and strategy that win games: forks, pins, skewers, discovered attacks, endgame basics and positional planning.',
  keywords: LEARN_STRATEGY_KEYWORDS,
  path: '/learn/chess-strategies',
});

export default function Page() {
  const graph = jsonLdGraph(
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Learn', path: '/learn/chess-strategies' },
      { name: 'Chess Strategies', path: '/learn/chess-strategies' },
    ])
  );
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
      />
      <LearnStrategiesPage />
    </>
  );
}
