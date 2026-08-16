'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Award, RefreshCw, PlusCircle, Copy, Check, Download } from 'lucide-react';
import { sound } from '@/lib/audio';
import { downloadPgnFile } from '@/lib/storage';

interface GameEndModalProps {
  winner: 'w' | 'b' | 'draw' | null;
  reason: string;
  myColor?: 'w' | 'b' | null;
  movesCount: number;
  pgn: string;
  onRematch?: () => void;
  onNewGame: () => void;
  onClose: () => void;
}

export const GameEndModal: React.FC<GameEndModalProps> = ({
  winner,
  reason,
  myColor,
  movesCount,
  pgn,
  onRematch,
  onNewGame,
  onClose,
}) => {
  const [copied, setCopied] = React.useState(false);

  const isWin = myColor && winner === myColor;
  const isLoss = myColor && winner && winner !== 'draw' && winner !== myColor;
  const isDraw = winner === 'draw';

  useEffect(() => {
    if (isWin || (!myColor && winner !== 'draw')) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#fbbf24', '#10b981', '#ffffff'],
      });
      sound.playGameEnd(true);
    } else {
      sound.playGameEnd(false);
    }
  }, [isWin, isLoss, isDraw]);

  const handleCopyPgn = () => {
    navigator.clipboard.writeText(pgn);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getTitle = () => {
    if (isDraw) return 'Game Drawn';
    if (isWin) return 'Victory!';
    if (isLoss) return 'Defeat';
    return winner === 'w' ? 'White Wins!' : 'Black Wins!';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-xl border border-[#3c3934] bg-[#262421] p-6 shadow-2xl text-center">
        {/* Icon banner */}
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-[#81b64c] text-zinc-950 shadow-md">
          {isDraw ? (
            <Award className="h-7 w-7 text-zinc-950" />
          ) : (
            <Trophy className="h-7 w-7 text-zinc-950" />
          )}
        </div>

        {/* Title */}
        <h2 className="text-xl font-extrabold text-zinc-100 tracking-tight mb-1">
          {getTitle()}
        </h2>

        {/* Reason */}
        <p className="text-xs font-semibold text-[#81b64c] mb-4">{reason}</p>

        {/* Stats Summary Box */}
        <div className="grid grid-cols-2 gap-3 bg-[#161512] rounded-lg p-3 border border-[#3c3934] mb-5 text-xs">
          <div>
            <span className="text-zinc-400 block mb-0.5 text-[11px]">Total Moves</span>
            <span className="font-mono-chess font-bold text-zinc-200 text-sm">{movesCount}</span>
          </div>
          <div>
            <span className="text-zinc-400 block mb-0.5 text-[11px]">Outcome</span>
            <span className="font-bold text-zinc-200 text-sm capitalize">
              {winner === 'draw' ? 'Draw' : `${winner === 'w' ? 'White' : 'Black'} Won`}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          {onRematch && (
            <button
              onClick={onRematch}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#81b64c] py-2.5 text-xs font-bold text-zinc-950 hover:bg-[#70a33e] transition-colors shadow-md"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Play Rematch</span>
            </button>
          )}

          <button
            onClick={onNewGame}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#3c3934] py-2 text-xs font-semibold text-zinc-100 hover:bg-[#4a4641] transition-colors border border-[#3c3934]"
          >
            <PlusCircle className="h-4 w-4" />
            <span>New Game</span>
          </button>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleCopyPgn}
              className="flex flex-1 items-center justify-center gap-1.5 rounded bg-[#161512] py-1.5 text-xs font-medium text-zinc-300 hover:bg-[#3c3934] border border-[#3c3934] transition-colors"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'PGN Copied' : 'Copy PGN'}</span>
            </button>
            <button
              onClick={() => downloadPgnFile(pgn)}
              className="flex flex-1 items-center justify-center gap-1.5 rounded bg-[#161512] py-1.5 text-xs font-medium text-zinc-300 hover:bg-[#3c3934] border border-[#3c3934] transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download PGN</span>
            </button>
          </div>
        </div>

        {/* Review board button */}
        <button
          onClick={onClose}
          className="mt-3 text-xs text-zinc-400 hover:text-zinc-200 hover:underline"
        >
          Review Final Position
        </button>
      </div>
    </div>
  );
};

