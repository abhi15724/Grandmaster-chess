'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Chess } from 'chess.js';
import { Bot, Monitor, ShieldCheck, Zap, Sparkles, BookOpen, ChevronRight, HelpCircle, Trophy } from 'lucide-react';
import { ChessBoard } from '@/components/ChessBoard';
import { DEFAULT_BOARD_THEME } from '@/lib/chess/themes';
import { FAMOUS_OPENINGS } from '@/lib/chess/openings';

interface HomePageProps {
  navigate?: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({}) => {
  const router = useRouter();
  const navigate = (path: string) => router.push(path);

  // Static demo board in Ruy Lopez opening position for hero visual
  const demoChess = new Chess('r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3');

  return (
    <div className="flex flex-col gap-10 py-6 px-3 sm:px-5 lg:px-6 max-w-7xl mx-auto">
      
      {/* 1. HERO SECTION */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pt-2 lg:pt-4">
        
        {/* Left Col: Headline & Primary Actions */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#81b64c]/40 bg-[#81b64c]/10 px-3 py-1 text-xs font-bold text-[#81b64c] mb-4 shadow-xs">
            <Sparkles className="h-3.5 w-3.5 text-[#81b64c]" />
            <span>FIDE Standard Rules • 100% Free & No Registration Required</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-100 tracking-tight leading-[1.15] mb-4">
            Play Chess Online — <br className="hidden sm:inline" />
            <span className="text-[#81b64c]">
              Yourself or the AI
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed mb-6 max-w-2xl">
            Challenge intelligent AI opponents across three difficulty levels, or play locally against yourself, pass-and-play style, on any device.
          </p>

          {/* CTA Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-md mb-5">
            
            {/* Play AI */}
            <button
              id="hero-play-ai-btn"
              onClick={() => navigate('/play/ai')}
              className="flex items-center justify-center gap-2 rounded-lg bg-[#81b64c] px-4 py-3 text-xs font-bold text-zinc-950 hover:bg-[#70a33e] shadow-md hover:scale-101 active:scale-98 transition-all"
            >
              <Bot className="h-4 w-4 text-zinc-950" />
              <span>Play vs AI</span>
            </button>

            {/* Play Local Chess */}
            <button
              id="hero-play-local-btn"
              onClick={() => navigate('/play/local')}
              className="flex items-center justify-center gap-2 rounded-lg bg-[#161512] px-4 py-3 text-xs font-bold text-zinc-200 hover:bg-[#262421] border border-[#3c3934] hover:scale-101 active:scale-98 transition-all"
            >
              <Monitor className="h-4 w-4 text-zinc-400" />
              <span>Local Game</span>
            </button>
          </div>

          {/* Feature Micro-Badges */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-zinc-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Server Validated Moves
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-[#81b64c]" /> Real-time Clock Sync
            </span>
            <span className="flex items-center gap-1.5">
              <Trophy className="h-3.5 w-3.5 text-sky-400" /> Elo Tracking & Replays
            </span>
          </div>
        </div>

        {/* Right Col: Visual Interactive Chessboard Preview */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full max-w-[420px] p-2.5 rounded-xl bg-[#262421] border border-[#3c3934] shadow-lg">
            <div className="flex items-center justify-between px-2 pb-2 text-xs font-bold text-zinc-200">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#81b64c] animate-pulse" />
                <span>Interactive Board Preview</span>
              </div>
              <span className="font-mono-chess text-[11px] text-[#81b64c]">Ruy Lopez</span>
            </div>
            
            <ChessBoard
              chess={demoChess}
              boardTheme={DEFAULT_BOARD_THEME}
              orientation="w"
              isInteractive={true}
              onMove={() => {}}
            />

            <div className="mt-2.5 flex items-center justify-between px-2 pt-1 text-xs text-zinc-400">
              <span className="text-[11px]">Click or drag pieces to test board</span>
              <button
                onClick={() => navigate('/play/ai')}
                className="text-[#81b64c] font-bold hover:underline flex items-center gap-1 text-xs"
              >
                Start Game <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. WHY PLAY HERE SECTION */}
      <section className="border-t border-[#3c3934] pt-8">
        <div className="text-center max-w-3xl mx-auto mb-6">
          <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-100 tracking-tight mb-1">
            Why Play on Grandmaster Chess?
          </h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Engineered for pure speed, fluid touch interaction, and comprehensive chess rule accuracy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1 */}
          <div className="p-4 rounded-xl bg-[#262421] border border-[#3c3934] hover:border-[#81b64c]/50 transition-colors">
            <div className="h-8 w-8 rounded-lg bg-[#81b64c]/15 border border-[#81b64c]/30 flex items-center justify-center text-[#81b64c] mb-3">
              <Bot className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-bold text-zinc-100 mb-1.5">Adaptive AI Opponents</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Choose between Basic (beginner friendly), Intermediate (minimax evaluation), and Advanced (deep positional calculation) engines.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-4 rounded-xl bg-[#262421] border border-[#3c3934] hover:border-[#81b64c]/50 transition-colors">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3">
              <Monitor className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-bold text-zinc-100 mb-1.5">Local Pass & Play</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Play both sides on the same device. Perfect for studying positions, running through openings, or two players sharing one screen.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-4 rounded-xl bg-[#262421] border border-[#3c3934] hover:border-[#81b64c]/50 transition-colors">
            <div className="h-8 w-8 rounded-lg bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 mb-3">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-bold text-zinc-100 mb-1.5">Strict FIDE Validation</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              En passant, castling kingside/queenside, pawn promotions, three-fold repetition, 50-move rule, and insufficient material draws are fully validated.
            </p>
          </div>
        </div>
      </section>

      {/* 3. POPULAR CHESS OPENINGS PREVIEW */}
      <section className="border-t border-[#3c3934] pt-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h2 className="text-xl font-extrabold text-zinc-100 tracking-tight mb-0.5">
              Master Legendary Chess Openings
            </h2>
            <p className="text-xs text-zinc-400">
              Study the first moves played by world champions and grandmasters.
            </p>
          </div>
          <button
            onClick={() => navigate('/learn/chess-openings')}
            className="flex items-center gap-1 text-xs font-bold text-[#81b64c] hover:underline self-start sm:self-center"
          >
            <span>Explore All Openings</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {FAMOUS_OPENINGS.slice(0, 4).map((opening) => (
            <div
              key={opening.name}
              className="p-3.5 rounded-lg bg-[#262421] border border-[#3c3934] hover:border-zinc-500 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono-chess text-[10px] font-bold text-[#81b64c] bg-[#81b64c]/15 border border-[#81b64c]/30 px-1.5 py-0.5 rounded">
                    ECO {opening.eco}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-zinc-100 mb-1">{opening.name}</h4>
                <p className="text-[11px] text-zinc-400 leading-relaxed mb-2.5 line-clamp-2">
                  {opening.description}
                </p>
              </div>
              <div className="font-mono-chess text-[10px] text-zinc-300 bg-[#161512] p-1.5 rounded border border-[#3c3934]">
                {opening.moves.join(' ')}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. FREQUENTLY ASKED QUESTIONS SUMMARY */}
      <section className="border-t border-[#3c3934] pt-8 pb-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-xl font-extrabold text-zinc-100 tracking-tight mb-1">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-zinc-400">
              Clear, concise information about the chess platform and features.
            </p>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-lg bg-[#262421] border border-[#3c3934]">
              <h4 className="text-xs font-bold text-zinc-100 mb-1">
                Is Grandmaster Chess completely free to play?
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Yes! All features—including play vs AI, local pass-and-play, chess clocks, opening guides, and PGN export—are 100% free with no paywalls or registration requirements.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-[#262421] border border-[#3c3934]">
              <h4 className="text-xs font-bold text-zinc-100 mb-1">
                Can I sync my stats and rating across devices?
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Yes. Create a free account and your rating, game history, and results are saved to your profile in the cloud, so they follow you when you sign in on another device.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-[#262421] border border-[#3c3934]">
              <h4 className="text-xs font-bold text-zinc-100 mb-1">
                Does the game work smoothly on mobile phones and tablets?
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Yes! The chessboard is designed with responsive sizing, fluid touch controls, click-to-move, and drag-and-drop support optimized for iPhone, iPad, Android, and desktop screens.
              </p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/faq')}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#81b64c] hover:underline"
            >
              <HelpCircle className="h-3.5 w-3.5" />
              <span>Read Full FAQ & Guides</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

