import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { PlayAIPage } from '@/components/pages/PlayAIPage';
import { SeoContent } from '@/components/seo/SeoContent';
import { JsonLd } from '@/components/JsonLd';
import { jsonLdGraph, breadcrumbSchema } from '@/lib/json-ld';

import { PLAY_AI_BASIC_KEYWORDS } from '@/lib/seo-keywords';

export const metadata: Metadata = pageMetadata({
  title: 'Play Chess vs Easy AI (Beginner)',
  description:
    'Play chess vs an easy AI built for beginners. Learn the rules and basic tactics in a free online game, no sign-up needed.',
  keywords: PLAY_AI_BASIC_KEYWORDS,
  path: '/play/ai/basic',
});

const content = {
  heading: 'Play chess vs an easy AI (beginner level)',
  paragraphs: [
    'The basic AI on Grandmasterchess is tuned for people who are new to chess or coming back after a long break (roughly an 800 rating). It makes natural beginner mistakes, so you get the chance to practice checkmating patterns, develop pieces and learn how the game flows without being crushed.',
    'Use this level to get comfortable with how each piece moves, to try your first openings, and to practice converting an advantage into checkmate. When you start winning most games, step up to the intermediate AI.',
  ],
  links: [
    { href: '/learn/chess-rules', label: 'Learn the chess rules' },
    { href: '/blog/best-chess-openings-for-beginners', label: 'Best openings for beginners' },
    { href: '/play/ai/intermediate', label: 'Try the medium AI' },
    { href: '/play/ai', label: 'All AI levels' },
  ],
};

export default function Page() {
  const graph = jsonLdGraph(
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Play chess vs AI', path: '/play/ai' },
      { name: 'Play Chess vs Easy AI', path: '/play/ai/basic' },
    ])
  );
  return (
    <>
      <JsonLd data={graph} />
      <PlayAIPage initialDifficulty="basic" />
      <SeoContent {...content} />
    </>
  );
}
