'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Chess } from 'chess.js';
import { BookOpen, Shield, ChevronRight, Swords, Sparkles } from 'lucide-react';
import { ChessPieceIcon } from '@/lib/chess/pieces';
import { PieceType } from '@/types/chess';

interface LearnRulesPageProps {
  navigate?: (path: string) => void;
}

export const LearnRulesPage: React.FC<LearnRulesPageProps> = ({}) => {
  const router = useRouter();
  const navigate = (path: string) => router.push(path);

  const [selectedPiece, setSelectedPiece] = useState<PieceType>('p');

  const pieceExplanations: Record<PieceType, { title: string; moves: string; value: string; tips: string[] }> = {
    p: {
      title: 'The Pawn',
      moves: 'Moves forward 1 square (or 2 squares on its very first move). Captures diagonally 1 square forward. Can execute en passant and promote on the 8th rank.',
      value: '1 Point (Base material)',
      tips: [
        'Pawns can never move backward.',
        'When a pawn reaches the opposite end of the board, it immediately promotes into a Queen, Rook, Bishop, or Knight.',
        'Pawn chains create resilient fortresses for your pieces.',
      ],
    },
    n: {
      title: 'The Knight',
      moves: 'Moves in an "L-shape" (2 squares in one cardinal direction and 1 square perpendicular). The only piece on the board capable of jumping over other pieces.',
      value: '3 Points (Minor piece)',
      tips: [
        'Knights excel in closed positions packed with pawns.',
        'A knight placed on an outpost square in the center controls 8 vital squares.',
        'The phrase "A knight on the rim is dim" warns against placing knights on edge squares (a-file or h-file).',
      ],
    },
    b: {
      title: 'The Bishop',
      moves: 'Moves diagonally any number of open squares. A bishop remains on squares of its starting color (light or dark) for the entire game.',
      value: '3 Points (Minor piece)',
      tips: [
        'Bishops thrive on long, open diagonals.',
        'The "Bishop Pair" (having both light and dark-squared bishops) is a lethal advantage in open endgames.',
        'Avoid locking your bishop behind your own fixed pawns of the same color.',
      ],
    },
    r: {
      title: 'The Rook',
      moves: 'Moves horizontally or vertically across any number of unoccupied squares. Together with the King, executes castling.',
      value: '5 Points (Major piece)',
      tips: [
        'Rooks belong on open and semi-open files.',
        'A rook penetrating to the 7th rank attacks enemy pawns and cuts off the opponent king.',
        'Double your rooks on open files to control the board.',
      ],
    },
    q: {
      title: 'The Queen',
      moves: 'The most powerful piece in chess. Combines the powers of the Rook and Bishop, moving any number of squares horizontally, vertically, or diagonally.',
      value: '9 Points (Major piece)',
      tips: [
        'Do not bring the Queen out too early in the opening, where enemy minor pieces can attack it while developing.',
        'Use the Queen in combination with minor pieces to deliver checkmate.',
      ],
    },
    k: {
      title: 'The King',
      moves: 'Moves 1 square in any direction. The most crucial piece: if the King is placed in checkmate, the game is immediately over.',
      value: 'Infinite (Priceless)',
      tips: [
        'Castle early to tuck your King behind a protective wall of pawns.',
        'In the endgame, the King transforms into an active fighting piece that supports passed pawns.',
      ],
    },
  };

  return (
    <div className="mx-auto max-w-5xl px-3 py-6 sm:px-5 lg:px-6 space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#81b64c]/40 bg-[#81b64c]/10 px-3 py-1 text-xs font-bold text-[#81b64c] mb-2.5">
          <BookOpen className="h-3.5 w-3.5" />
          <span>FIDE Official Chess Guide</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 tracking-tight mb-2">
          Chess Rules & Piece Movement
        </h1>
        <p className="text-xs text-zinc-400 leading-relaxed">
          Learn how every piece moves, special rules like castling and en passant, and conditions for checkmate and draws.
        </p>
      </div>

      {/* Piece Movement Interactive Guide */}
      <section className="rounded-xl border border-[#3c3934] bg-[#262421] p-5 sm:p-6">
        <h2 className="text-base font-bold text-zinc-100 mb-4 flex items-center gap-2">
          <Swords className="h-4 w-4 text-[#81b64c]" />
          <span>Piece Movement & Values</span>
        </h2>

        {/* Piece Selector Tabs */}
        <div className="grid grid-cols-6 gap-1.5 mb-5">
          {(['p', 'n', 'b', 'r', 'q', 'k'] as PieceType[]).map((type) => {
            const isSelected = selectedPiece === type;
            return (
              <button
                key={type}
                onClick={() => setSelectedPiece(type)}
                className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all ${
                  isSelected
                    ? 'bg-[#81b64c]/20 border-[#81b64c] text-[#81b64c] font-bold'
                    : 'bg-[#161512] border-[#3c3934] text-zinc-400 hover:border-zinc-500'
                }`}
              >
                <div className="w-7 h-7 mb-0.5">
                  <ChessPieceIcon type={type} color="w" />
                </div>
                <span className="text-[10px] uppercase font-semibold">{type === 'p' ? 'Pawn' : type === 'n' ? 'Knight' : type === 'b' ? 'Bishop' : type === 'r' ? 'Rook' : type === 'q' ? 'Queen' : 'King'}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Piece Details */}
        <div className="rounded-lg bg-[#161512] border border-[#3c3934] p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-3 border-b border-[#3c3934]">
            <div>
              <h3 className="text-base font-extrabold text-[#81b64c]">
                {pieceExplanations[selectedPiece].title}
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">{pieceExplanations[selectedPiece].moves}</p>
            </div>
            <span className="font-mono-chess text-xs font-bold text-zinc-200 bg-[#262421] border border-[#3c3934] px-2.5 py-1 rounded self-start sm:self-center">
              {pieceExplanations[selectedPiece].value}
            </span>
          </div>

          <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
            Strategic Tips & Principles:
          </h4>
          <ul className="space-y-1.5 text-xs text-zinc-300">
            {pieceExplanations[selectedPiece].tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-[#81b64c] font-bold">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Special Rules Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Castling */}
        <div className="p-4 rounded-xl bg-[#262421] border border-[#3c3934]">
          <h3 className="text-sm font-bold text-zinc-100 mb-1.5">1. Castling</h3>
          <p className="text-xs text-zinc-400 leading-relaxed mb-2.5">
            A simultaneous move of the King and Rook. The King moves two squares toward the Rook, and the Rook hops over to the King’s adjacent square.
          </p>
          <div className="text-[11px] text-zinc-400 bg-[#161512] p-2 rounded border border-[#3c3934]">
            <strong>Requirements:</strong> Neither King nor Rook has moved; no pieces between them; King cannot be in check or pass through check.
          </div>
        </div>

        {/* En Passant */}
        <div className="p-4 rounded-xl bg-[#262421] border border-[#3c3934]">
          <h3 className="text-sm font-bold text-zinc-100 mb-1.5">2. En Passant</h3>
          <p className="text-xs text-zinc-400 leading-relaxed mb-2.5">
            If an opponent advances a pawn two squares forward and lands directly adjacent to your pawn, you can capture it diagonally behind as if it had only moved one square.
          </p>
          <div className="text-[11px] text-zinc-400 bg-[#161512] p-2 rounded border border-[#3c3934]">
            <strong>Timing:</strong> Must be played immediately on the very next turn, otherwise the right is lost.
          </div>
        </div>

        {/* Pawn Promotion */}
        <div className="p-4 rounded-xl bg-[#262421] border border-[#3c3934]">
          <h3 className="text-sm font-bold text-zinc-100 mb-1.5">3. Pawn Promotion</h3>
          <p className="text-xs text-zinc-400 leading-relaxed mb-2.5">
            When a pawn advances all the way to the 8th rank (for White) or 1st rank (for Black), it transforms into a Queen, Rook, Bishop, or Knight.
          </p>
          <div className="text-[11px] text-zinc-400 bg-[#161512] p-2 rounded border border-[#3c3934]">
            <strong>Most Common:</strong> Promoting to a Queen (&quot;Queening&quot;), though underpromoting to a Knight can prevent stalemates.
          </div>
        </div>
      </section>

      {/* Check, Checkmate & Draws */}
      <section className="rounded-xl border border-[#3c3934] bg-[#262421] p-5 sm:p-6">
        <h2 className="text-base font-bold text-zinc-100 mb-3">
          Game End Conditions: Checkmate vs Draw
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-lg bg-[#161512] border border-[#3c3934]">
            <h4 className="font-bold text-rose-400 text-xs mb-1">Checkmate (Win / Loss)</h4>
            <p className="text-zinc-400 leading-relaxed text-[11px]">
              The King is attacked in check, and there is no legal move to escape the attack: the King cannot move to a safe square, cannot block the checking line, and the checking piece cannot be captured.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-[#161512] border border-[#3c3934]">
            <h4 className="font-bold text-[#81b64c] text-xs mb-1">Stalemate (Draw)</h4>
            <p className="text-zinc-400 leading-relaxed text-[11px]">
              The player whose turn it is has no legal moves available, but their King is <strong>not</strong> in check. The game ends in an immediate draw.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-[#161512] border border-[#3c3934]">
            <h4 className="font-bold text-sky-400 text-xs mb-1">Threefold Repetition</h4>
            <p className="text-zinc-400 leading-relaxed text-[11px]">
              If the exact same board position occurs 3 times with the same player to move and the same legal moves, the game is declared a draw.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-[#161512] border border-[#3c3934]">
            <h4 className="font-bold text-emerald-400 text-xs mb-1">Fifty-Move Rule</h4>
            <p className="text-zinc-400 leading-relaxed text-[11px]">
              If 50 consecutive turns occur without a single pawn move or a piece capture, either player can claim a draw.
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/play/ai')}
            className="inline-flex items-center gap-2 rounded-lg bg-[#81b64c] px-5 py-2.5 text-xs font-bold text-zinc-950 hover:bg-[#70a33e] transition-colors shadow-md"
          >
            <span>Practice Rules vs AI</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </section>

    </div>
  );

};
