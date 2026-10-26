import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { PlayAIPage } from '@/components/pages/PlayAIPage';
import { SeoContent } from '@/components/seo/SeoContent';
import { JsonLd } from '@/components/JsonLd';
import { jsonLdGraph, breadcrumbSchema } from '@/lib/json-ld';

import { PLAY_AI_INTERMEDIATE_KEYWORDS } from '@/lib/seo-keywords';

export const metadata: Metadata = pageMetadata({
  title: 'Play Chess vs Medium AI (Casual)',
  description:
    'Play chess vs a medium-strength AI: a fair fight for improving players. Free, in your browser, no sign-up needed.',
  keywords: PLAY_AI_INTERMEDIATE_KEYWORDS,
  path: '/play/ai/intermediate',
});

const content = {
  heading: 'Play chess vs a medium-strength AI (casual level)',
  paragraphs: [
    'The intermediate AI plays at roughly a 1400 rating, similar to a solid casual or club-level player. It punishes loose pieces and simple tactics, but it still leaves openings for forks, pins and positional ideas, which makes it a good training partner once you know the basics.',
    'Try a different opening each game, pay attention to king safety, and use the chess clock to practice making decent moves under time pressure. When you can beat this level regularly, the advanced AI is the next step.',
  ],
  links: [
    { href: '/learn/chess-openings', label: 'Chess openings guide' },
    { href: '/learn/chess-strategies', label: 'Tactics & strategy' },
    { href: '/play/ai/advanced', label: 'Try the hardest AI' },
    { href: '/play/ai', label: 'All AI levels' },
  ],
};

export default function Page() {
  const graph = jsonLdGraph(
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Play chess vs AI', path: '/play/ai' },
      { name: 'Play Chess vs Medium AI', path: '/play/ai/intermediate' },
    ])
  );
  return (
    <>
      <JsonLd data={graph} />
      <PlayAIPage initialDifficulty="intermediate" />
      <SeoContent {...content} />
    </>
  );
}
