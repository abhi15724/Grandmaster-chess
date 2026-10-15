import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { LocalChessPage } from '@/components/pages/LocalChessPage';
import { SeoContent } from '@/components/seo/SeoContent';
import { JsonLd } from '@/components/JsonLd';
import { jsonLdGraph, breadcrumbSchema } from '@/lib/json-ld';

import { PLAY_LOCAL_KEYWORDS } from '@/lib/seo-keywords';

export const metadata: Metadata = pageMetadata({
  title: '2 Player Chess Online (Pass & Play)',
  description:
    'Play 2 player chess on one device. Free pass-and-play with chess clocks, full move validation and a flipping board. No sign-up.',
  keywords: PLAY_LOCAL_KEYWORDS,
  path: '/play/local',
});

const content = {
  heading: 'Play 2 player chess on one device',
  paragraphs: [
    'Local chess on Grandmasterchess is a free 2 player chess mode for one screen: sit next to a friend and take turns on the same phone, tablet or computer. The board validates every move, so illegal moves, castling, en passant and promotion all work exactly as in a real game.',
    'Add a chess clock for fast blitz games, flip the board after each move for face-to-face play, or play untimed and just enjoy the position. You can also play against yourself to analyze an opening, test an idea or work through a position, then export the game as PGN.',
  ],
  links: [
    { href: '/play/ai', label: 'Play chess vs AI' },
    { href: '/learn/chess-rules', label: 'Chess rules' },
    { href: '/learn/chess-openings', label: 'Chess openings' },
    { href: '/blog/blitz-vs-rapid-vs-classical', label: 'Blitz vs rapid vs classical' },
  ],
};

export default function Page() {
  const graph = jsonLdGraph(
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: '2 player chess (local)', path: '/play/local' },
    ])
  );
  return (
    <>
      <JsonLd data={graph} />
      <LocalChessPage />
      <SeoContent {...content} />
    </>
  );
}
