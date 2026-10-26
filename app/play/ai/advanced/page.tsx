import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { PlayAIPage } from '@/components/pages/PlayAIPage';
import { SeoContent } from '@/components/seo/SeoContent';
import { JsonLd } from '@/components/JsonLd';
import { jsonLdGraph, breadcrumbSchema } from '@/lib/json-ld';

import { PLAY_AI_ADVANCED_KEYWORDS } from '@/lib/seo-keywords';

export const metadata: Metadata = pageMetadata({
  title: 'Play Chess vs Hardest AI',
  description:
    'Play chess vs the hardest AI on Grandmasterchess. A tough tactical test for experienced players. Free, no sign-up.',
  keywords: PLAY_AI_ADVANCED_KEYWORDS,
  path: '/play/ai/advanced',
});

const content = {
  heading: 'Play chess vs the hardest AI',
  paragraphs: [
    'The advanced AI is the strongest opponent on Grandmasterchess (a home-built minimax engine, much weaker than Stockfish). It searches deeper than the other two levels, so tactical inaccuracies are punished.',
    'To beat it, steer toward closed, strategic positions, avoid early tactical complications you have not calculated, and take your time on the clock. Review your PGN after each game to find the moment the evaluation turned.',
  ],
  links: [
    { href: '/blog/how-to-beat-chess-ai', label: 'How to beat chess AI' },
    { href: '/learn/chess-strategies', label: 'Tactics & strategy' },
    { href: '/play/ai/intermediate', label: 'Medium AI' },
    { href: '/play/ai', label: 'All AI levels' },
  ],
};

export default function Page() {
  const graph = jsonLdGraph(
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Play chess vs AI', path: '/play/ai' },
      { name: 'Play Chess vs Hardest AI', path: '/play/ai/advanced' },
    ])
  );
  return (
    <>
      <JsonLd data={graph} />
      <PlayAIPage initialDifficulty="advanced" />
      <SeoContent {...content} />
    </>
  );
}
