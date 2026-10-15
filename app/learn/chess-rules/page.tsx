import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { LearnRulesPage } from '@/components/pages/LearnRulesPage';
import { jsonLdGraph, breadcrumbSchema } from '@/lib/json-ld';

import { LEARN_RULES_KEYWORDS } from '@/lib/seo-keywords';

export const metadata: Metadata = pageMetadata({
  title: 'Chess Rules for Beginners: How to Play',
  description:
    'Learn how to play chess: how every piece moves, check and checkmate, castling, en passant, promotion and every draw rule explained simply.',
  keywords: LEARN_RULES_KEYWORDS,
  path: '/learn/chess-rules',
});

export default function Page() {
  const graph = jsonLdGraph(
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Chess Rules', path: '/learn/chess-rules' },
    ])
  );
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
      />
      <LearnRulesPage />
    </>
  );
}
