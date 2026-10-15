import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { PlayAIPage } from '@/components/pages/PlayAIPage';
import { SeoContent } from '@/components/seo/SeoContent';
import { JsonLd } from '@/components/JsonLd';
import { jsonLdGraph, breadcrumbSchema } from '@/lib/json-ld';

import { PLAY_AI_KEYWORDS } from '@/lib/seo-keywords';

export const metadata: Metadata = pageMetadata({
  title: 'Play Chess vs Computer Online Free',
  description:
    'Play chess against the computer online, free. Pick a basic, intermediate or advanced AI, set a clock and start instantly. No download, no sign-up.',
  keywords: PLAY_AI_KEYWORDS,
  path: '/play/ai',
});

const content = {
  heading: 'Play chess against the computer on Grandmasterchess',
  paragraphs: [
    'Grandmasterchess lets you play chess against the computer for free, right in your browser. Choose a basic, intermediate or advanced AI opponent, pick White, Black or random, set a chess clock (bullet, blitz, rapid) or play untimed, and your game starts instantly with no download and no account.',
    'Every game follows full FIDE rules, including castling, en passant, pawn promotion, threefold repetition, the 50-move rule and insufficient-material draws. Your moves are saved in a move list you can export as PGN to study later or analyze on another site.',
    'Not sure which level to pick? Start with the basic AI if you are learning, move to intermediate when you can win consistently, and test yourself against the advanced AI once you know your openings and basic tactics.',
  ],
  links: [
    { href: '/play/ai/basic', label: 'Easy AI (beginner)' },
    { href: '/play/ai/intermediate', label: 'Medium AI' },
    { href: '/play/ai/advanced', label: 'Hardest AI' },
    { href: '/play/local', label: '2 player chess' },
    { href: '/learn/chess-rules', label: 'Chess rules' },
    { href: '/blog/how-to-beat-chess-ai', label: 'How to beat chess AI' },
  ],
};

export default function Page() {
  const graph = jsonLdGraph(
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Play chess vs AI', path: '/play/ai' },
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
