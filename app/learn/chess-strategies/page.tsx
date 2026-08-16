import type { Metadata } from 'next';
import { LearnStrategiesPage } from '@/components/pages/LearnStrategiesPage';
import { jsonLdGraph, breadcrumbSchema } from '@/lib/json-ld';

import { LEARN_STRATEGY_KEYWORDS } from '@/lib/seo-keywords';

export const metadata: Metadata = {
  title: 'Chess Tactics & Middlegame Strategy Guide',
  description:
    'Learn the core tactical patterns and middlegame strategies that decide most chess games: forks, pins, skewers, discovered attacks, and positional planning.',
  keywords: LEARN_STRATEGY_KEYWORDS,
  alternates: { canonical: '/learn/chess-strategies' },
};

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
