import type { Metadata } from 'next';
import { FAQPage } from '@/components/pages/FAQPage';
import { jsonLdGraph, faqSchema, breadcrumbSchema } from '@/lib/json-ld';
import { FAQ_KEYWORDS } from '@/lib/seo-keywords';

export const metadata: Metadata = {
  title: 'FAQ — Online Chess & AI Engine Questions Answered',
  description:
    'Answers to common questions about playing free online chess: AI difficulty, FIDE rule enforcement, PGN export, and mobile support.',
  keywords: FAQ_KEYWORDS,
  alternates: { canonical: '/faq' },
};

const faqs = [
  {
    question: 'Is Grandmaster Chess completely free to play?',
    answer:
      'Yes, 100% free. You can play against AI bots across three difficulties, play locally against yourself pass-and-play style, analyze moves with PGN export, and study openings without paying or creating an account.',
  },
  {
    question: 'Can I sync my stats and rating across devices?',
    answer:
      'Yes. Create a free account and your rating, game history, and results are saved to your profile in the cloud, so they follow you when you sign in on another device.',
  },
  {
    question: 'How does the AI chess engine work?',
    answer:
      'The AI engine uses Minimax with Alpha-Beta pruning and Quiescence search. Basic AI plays intuitive beginner moves, Intermediate AI uses positional piece-square evaluations, and Advanced AI calculates deep multi-ply variations to avoid the horizon effect.',
  },
  {
    question: 'Are all standard FIDE chess rules enforced?',
    answer:
      'Yes. The platform validates en passant, castling, pawn promotion, threefold repetition, stalemate, the 50-move rule, and insufficient material draws.',
  },
  {
    question: 'Can I export my games to PGN format?',
    answer:
      'Yes. You can copy or download PGN notation from the move history panel and import it into Chess.com, Lichess, or ChessBase for analysis.',
  },
  {
    question: 'Does it work smoothly on mobile phones and tablets?',
    answer:
      'Yes, the board is fully responsive and touch-friendly across iOS, Android, and desktop browsers.',
  },
  {
    question: 'What is the best first move in chess?',
    answer:
      '1.e4 and 1.d4 are the two most popular and reliable first moves, since both immediately claim a central square and open lines for a bishop or queen. Beginners are usually better served picking one and learning its ideas than searching for a single "best" move.',
  },
  {
    question: 'How many squares are on a chessboard?',
    answer:
      'A chessboard has 64 squares in an 8x8 grid, alternating between light and dark colors, with 32 squares of each color.',
  },
  {
    question: "What's the difference between blitz, rapid, and classical chess?",
    answer:
      'Blitz games use a fast clock (roughly 3-5 minutes per player), rapid sits in the middle (10-15 minutes), and classical gives each player 30+ minutes or more, allowing much deeper calculation. Grandmaster Chess Online supports blitz, rapid, and untimed games in both AI and local play.',
  },
  {
    question: 'Is online chess rating the same as FIDE rating?',
    answer:
      'No. Online chess ratings (like the ones tracked here) are calculated from games played on this platform and are not directly interchangeable with an official FIDE rating, though both typically use Elo-based systems.',
  },
];

export default function Page() {
  const graph = jsonLdGraph(
    faqSchema(faqs),
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'FAQ', path: '/faq' },
    ])
  );
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
      />
      <FAQPage />
    </>
  );
}
