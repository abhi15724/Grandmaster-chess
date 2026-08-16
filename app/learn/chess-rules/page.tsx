import type { Metadata } from 'next';
import { LearnRulesPage } from '@/components/pages/LearnRulesPage';
import { jsonLdGraph, breadcrumbSchema } from '@/lib/json-ld';

import { LEARN_RULES_KEYWORDS } from '@/lib/seo-keywords';

export const metadata: Metadata = {
  title: 'Chess Rules Explained — Complete Beginner\u2019s Guide',
  description:
    'Learn every chess rule: how each piece moves, check and checkmate, castling, en passant, pawn promotion, and all draw conditions.',
  keywords: LEARN_RULES_KEYWORDS,
  alternates: { canonical: '/learn/chess-rules' },
};

export default function Page() {
  const graph = jsonLdGraph(
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Learn', path: '/learn/chess-rules' },
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
