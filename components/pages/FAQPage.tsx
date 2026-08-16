'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HelpCircle, ChevronDown, ChevronUp, Bot, Monitor, ShieldCheck, Sparkles } from 'lucide-react';

interface FAQPageProps {
  navigate?: (path: string) => void;
}

export const FAQPage: React.FC<FAQPageProps> = ({}) => {
  const router = useRouter();
  const navigate = (path: string) => router.push(path);

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Is Grandmaster Chess completely free to play?',
      a: 'Yes, 100% free! You can play against AI bots across three difficulties (Basic, Intermediate, Advanced), play locally against yourself pass-and-play style, analyze moves with PGN export, and study openings without paying a penny or creating an account.',
    },
    {
      q: 'Can I sync my stats and rating across devices?',
      a: 'Yes. Create a free account and your rating, game history, and results are saved to your profile in Supabase, so they follow you when you sign in on another device.',
    },
    {
      q: 'How does the AI chess engine work?',
      a: 'Our AI engine uses the Minimax algorithm with Alpha-Beta pruning and Quiescence search. Basic AI plays intuitive beginner moves (~800 Elo), Intermediate AI uses minimax depth 2 with positional piece-square evaluations (~1400 Elo), and Advanced AI calculates deep multi-ply variations with quiescence search to avoid the horizon effect (~2100 Elo).',
    },
    {
      q: 'Are all standard FIDE chess rules enforced?',
      a: 'Yes. The platform strictly validates en passant captures, kingside and queenside castling, pawn promotions (Queen, Rook, Bishop, Knight), threefold repetition, stalemate, the 50-move rule, and insufficient material draws.',
    },
    {
      q: 'Can I export my games to PGN format?',
      a: 'Yes! After or during any game, you can click "Copy PGN" or "Download PGN" in the move history panel to save your notation. The PGN file can be imported into Chess.com, Lichess, or ChessBase for deep post-game analysis.',
    },
    {
      q: 'Does it work smoothly on mobile phones and tablets?',
      a: 'Yes. The board layout is fully responsive and touch-friendly. You can tap squares to move pieces or drag and drop on iOS, iPadOS, Android, and desktop browsers.',
    },
    {
      q: 'What is the best first move in chess?',
      a: '1.e4 and 1.d4 are the two most popular and reliable first moves, since both immediately claim a central square and open lines for a bishop or queen. Beginners are usually better served picking one and learning its ideas than searching for a single "best" move.',
    },
    {
      q: 'How many squares are on a chessboard?',
      a: 'A chessboard has 64 squares in an 8x8 grid, alternating between light and dark colors, with 32 squares of each color.',
    },
    {
      q: "What's the difference between blitz, rapid, and classical chess?",
      a: 'Blitz games use a fast clock (roughly 3-5 minutes per player), rapid sits in the middle (10-15 minutes), and classical gives each player 30+ minutes or more, allowing much deeper calculation. Grandmaster Chess Online supports blitz, rapid, and untimed games in both AI and local play.',
    },
    {
      q: 'Is online chess rating the same as FIDE rating?',
      a: 'No. Online chess ratings (like the ones tracked here) are calculated from games played on this platform and are not directly interchangeable with an official FIDE rating, though both typically use Elo-based systems.',
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-3 py-6 sm:px-5 lg:px-6 space-y-6">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#81b64c]/40 bg-[#81b64c]/10 px-3 py-1 text-xs font-bold text-[#81b64c] mb-2.5">
          <HelpCircle className="h-3.5 w-3.5" />
          <span>Support & Knowledgebase</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 tracking-tight mb-2">
          Frequently Asked Questions
        </h1>
        <p className="text-xs text-zinc-400 leading-relaxed">
          Everything you need to know about online chess matches, AI engines, local play, and rules.
        </p>
      </div>

      {/* Accordion List */}
      <div className="space-y-2">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="rounded-lg border border-[#3c3934] bg-[#262421] overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full flex items-center justify-between p-3.5 text-left hover:bg-[#3c3934]/40 transition-colors"
              >
                <span className="text-xs sm:text-sm font-bold text-zinc-100 pr-4">
                  {faq.q}
                </span>
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 text-[#81b64c] shrink-0" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-zinc-500 shrink-0" />
                )}
              </button>
              {isOpen && (
                <div className="px-3.5 pb-3.5 text-xs text-zinc-300 leading-relaxed border-t border-[#3c3934] pt-2.5">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        <button
          onClick={() => navigate('/play/ai')}
          className="p-3.5 rounded-lg bg-[#262421] border border-[#3c3934] hover:border-[#81b64c] text-left transition-colors"
        >
          <Bot className="h-4 w-4 text-[#81b64c] mb-1.5" />
          <h4 className="text-xs font-bold text-zinc-100">Play vs AI</h4>
          <p className="text-[11px] text-zinc-400 mt-0.5">Challenge our 3 AI bots immediately</p>
        </button>

        <button
          onClick={() => navigate('/play/local')}
          className="p-3.5 rounded-lg bg-[#262421] border border-[#3c3934] hover:border-emerald-500/50 text-left transition-colors"
        >
          <Monitor className="h-4 w-4 text-emerald-400 mb-1.5" />
          <h4 className="text-xs font-bold text-zinc-100">Play with Yourself</h4>
          <p className="text-[11px] text-zinc-400 mt-0.5">Local pass-and-play, both sides</p>
        </button>

        <button
          onClick={() => navigate('/learn/rules')}
          className="p-3.5 rounded-lg bg-[#262421] border border-[#3c3934] hover:border-sky-500/50 text-left transition-colors"
        >
          <ShieldCheck className="h-4 w-4 text-sky-400 mb-1.5" />
          <h4 className="text-xs font-bold text-zinc-100">Chess Rules</h4>
          <p className="text-[11px] text-zinc-400 mt-0.5">FIDE piece movement and special rules</p>
        </button>
      </div>

    </div>
  );
};
